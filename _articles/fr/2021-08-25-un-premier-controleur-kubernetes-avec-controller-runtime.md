---
contentType: article
lang: fr
date: '2021-08-25'
slug: un-premier-controleur-kubernetes-avec-controller-runtime
title: Écrire un contrôleur Kubernetes en Go avec controller-runtime
excerpt: >-
  J'ai récemment écrit mon premier contrôleur pour Kubernetes. Kubernetes était
  relativement nouveau pour moi, et le concept de contrôleur complètement flou.
  J'ai eu envie d'écrire cet article pour tenter de démystifier le concept tel
  que j'aurais aimé le découvrir quand j'ai commencé à m'y interesser.
categories:
  - architecture
authors:
  - dfert
keywords:
  - devops
  - kubernetes
---

![Gopher sailing]({BASE_URL}/imgs/articles/2021-08-25-un-premier-controleur-kubernetes-avec-controller-runtime/gopher-logo.png)


J'ai récemment été amené à écrire mon premier contrôleur pour Kubernetes et je dois reconnaitre que mes premiers pas ont été difficiles. Kubernetes était encore relativement nouveau pour moi, et le concept de contrôleur complètement flou. Après avoir pris un peu de recul sur le sujet, j'ai eu envie d'écrire cet article pour tenter de démystifier le concept tel que j'aurais aimé le découvrir quand j'ai commencé à m'y intéresser.

Dans cet article, je me limiterai à l'utilisation du framework [controller-runtime](https://github.com/kubernetes-sigs/controller-runtime) que l'on ma recommandé pour faire mes premiers pas. Ce dernier s'appuie sur les projets [kubebuilder](https://book.kubebuilder.io/) et [operator-sdk](https://github.com/operator-framework/operator-sdk) et en partage les principaux concepts.

## Qu'est-ce qu'un contrôleur Kubernetes ?
Un contrôleur Kubernetes est un programme qui scrute indéfiniment les ressources d'un cluster Kubernetes. Lorsque ces dernières sont modifiées, il interagit alors avec d'autres ressources afin d'atteindre un *état désiré*. Cet état est propre à chaque controleur et varie en fonction du besoin.

Kubernetes exécute déjà plusieurs contrôleurs nativement tel que le _Replication Controller_. Pour reprendre notre définition, lorsqu'on *scale* un *Replica Set* à 5 *Pods*, le _Replication Controller_ listera les pods déjà présents dans ce _Replica Set_ et en crééra le nombre nécessaire pour être à 5. Il atteindra alors son état désiré et fera tout son possible pour le maintenir. 

On trouve couramment des contrôleurs qui facilitent la mise en place et l'évolution d'architectures complexes. Ils scrutent alors généralement des CRs (*Custom Resources*), et adaptent des configurations / des architectures. On retrouve assez souvent ce fonctionnement pour la mise en place de clusters par exemple. La CR contient alors une  description abstraite du cluster et l'opérateur s'occupe d'appliquer les changements effectifs sur les *Configmaps* ; les *Ingresses* ; etc.

Le concept du contrôleur est très libre et on peut tout à fait s'en servir sans CRs aussi. On peut imaginer plus simplement qu'un contrôleur modifie automatiquement la configuration d'un pod lorsqu'un *Ingress* est modifié par exemple. 

## Mise en place du controller-runtime

Les contrôleurs reposent fortement sur l'API Kubernetes pour manipuler les différentes ressources (get/update/create/etc) et nous allons réaliser ces appels via un *client Kubernetes*. J'ai choisi d'utiliser le [client Go](https://github.com/kubernetes/client-go/) afin de rester dans l'ecosystème Kubernetes, mais il en existe pour plusieurs langages (voir [la liste officielle](https://kubernetes.io/docs/reference/using-api/client-libraries/)). 

### Un premier contrôleur

Rentrons directement dans le vif du sujet. Voici un premier exemple d'un controlleur qui scrute les *Ingress* d'un cluster Kubernetes.

- Créez un nouveau dossier dans le répertoire de votre choix et initier un nouveau projet via `go mod init <votre-projet>`
- Créez un fichier `main.go` et mettez-y le contenu suivant :

```golang
package main

import (
        networkingv1 "k8s.io/api/networking/v1"
        "context"
        "sigs.k8s.io/controller-runtime/pkg/client"
        "sigs.k8s.io/controller-runtime/pkg/client/config"
        "sigs.k8s.io/controller-runtime/pkg/controller"
        "sigs.k8s.io/controller-runtime/pkg/handler"
        "sigs.k8s.io/controller-runtime/pkg/manager"
        "sigs.k8s.io/controller-runtime/pkg/manager/signals"
        "sigs.k8s.io/controller-runtime/pkg/reconcile"
        "sigs.k8s.io/controller-runtime/pkg/source"
)

type reconcileIngress struct {
        client client.Client
}

func (r *reconcileIngress) Reconcile(ctx context.Context, request reconcile.Request) (reconcile.Result, error) {
        // votre logique
        return reconcile.Result{}, nil
}

func main() {
        mgr, _ := manager.New(config.GetConfigOrDie(), manager.Options{})

        myCustomController, _ := controller.New("my-controller-name", mgr, controller.Options{
                Reconciler: &reconcileIngress{
                        client: mgr.GetClient(),
                },
        })

        myCustomController.Watch(&source.Kind{Type: &networkingv1.Ingress{}}, &handler.EnqueueRequestForObject{})

        mgr.Start(signals.SetupSignalHandler())
}

```
- Installez les différents paquets importés avec `go get <nom_de_paquet>` (pour aller plus vite, vous pouvez installer directement le paquet principal `sigs.k8s.io/controller-runtime`)

Ces paquets contiennent tout le nécessaire pour utiliser un client Kubernetes ; le configurer pour qu'il puisse se connecter à un cluster ; scruter / manipuler des `Ingresses` ; configurer et démarrer notre controller.

Notre premier controller ne fait (presque) rien pour le moment, mais c'est une base déjà largement suffisante pour introduire quelques notions essentielles à sa bonne compréhension.

## Concepts principaux

### Work Queue
Le controller dispose d'une _Work Queue_ pour stocker les différents évènements associés aux ressources qu'il scrute. À chaque fois qu'un évènement est dépilé, le controller déclenche une réconciliation en appelant la méthode `Reconcile()`.

### Réconciliation
La réconciliation consiste à faire correspondre l'état courant (i.e. avant la modification de la ressource) avec l'état attendu. La méthode `Reconcile()` contiendra la logique de notre controller, c'est à dire l'algorithme qui décrit comment atteindre cet état.

Il est important de comprendre que la réconciliation est déclenchée à chaque fois qu'un évènement a lieu sur le *type* de ressource scrutée. Si on scrute les Ingress et que `IngressA` et `IngressB` sont modifiés, `Reconcile()` s'exécutera 2 fois d'affilé et à chaque appel sera un objet `reconcile.Request` qui contiendra 1 nom de resource et 1 namespace --- généralement ceux de la ressource concernée par l'évènement --- qui nous permettent d'identifier cette resource.

### Composants
Pour pouvoir instancier notre controller, il faut au préalable créer les éléments suivants :

- Un *manager* qui fournira un client au controller et gèrera le cycle de via de ce dernier (il démarre via `manager.Start()` notamment).
- Un *handler* qui mettra en file les requêtes de réconciliation (`reconcile.Requests`).
- Un *controller* qui implémente les API Kubernetes. C'est lui qui permet de scruter des ressources via `controller.Watch()`

#### Manager
Le manager peut être configuré via de [nombreuses options](https://pkg.go.dev/sigs.k8s.io/controller-runtime/pkg/manager#Options) qui ne sont toutefois pas nécessaires pour ce premier contrôleur. Dans notre exemple, il obtient la configuration du client via la méthode `config.GetConfigOrDie()` qui :
- Tente d'utiliser `$HOME/.kube/config` si le contrôleur s'exécute en dehors d'un cluster kubernetes (on peut préciser un autre path en utilisant l'argument `--kubeconfig <path>`)
- Récupère automatiquement les informations de connexion si le contrôleur s'execute dans un cluster kubernetes.

<div class="admonition warning" markdown="1"><p class="admonition-title">Attention</p>

Vérifiez le contenu de votre kube config avant de tester votre contrôleur en local. Faites très attention au contexte utilisé pour éviter d'éventuelles suprises en production !

</div>

#### Handler

Le handler supporte différents modes de fonctionnement qui influent sur les valeurs contenues dans `reconcile.Request`. Plus précisemment, ces modes de fonctionnements définissent quels objets vont être réconciliés lorsqu'une ressource est modifiée.

- Avec *EnqueueRequestForObject* l'objet reconcilié est celui concerné par l'évènement. Si `toto` du namespace `tata` a été modifié, on retrouvera ces valeurs dans `reconcile.Request`.
- Avec *EnqueueRequestForOwner* l'objet reconcilié sera le _Owner_ de l'objet concerné par l'évènement. Ce sont donc le nom et le namespace de la ressource parente qui seront dans `reconcile.Request`.
- Avec *EnqueueRequestsFromMapFunc* on détermine une liste d'objet à reconcilier en déclarant une fonction. On a ainsi plusieurs couples `{Name;Namespace}` à réconcilier par évènements.


### Scruter des resources

Regardons maintenant de plus près la définition de la méthode `Watch()`.

```golang
Watch(src source.Source, eventhandler handler.EventHandler, predicates ...predicate.Predicate) error
```

Elle prend en argument les éléments suivants :
- Une source d'évènement, qui peut être interne au cluster (e.g. création de pod, modification de deploiement, etc.) en utilisant `source.Kind` et externe (e.g hook github) en utilisant `source.Channel`
- Un *handler*
- (optionnel) Des *predicates* qui permettent de définir quels évènements déclenchent une réconciliation. Il est possible par exemple de désactiver la réconciliation pour les évènements `Delete` si on le souhaite.

Pour notre premier contrôleur, nous scruterons une source interne de type `Ingress` et notre handler fonctionnera en mode `EnqueueRequestForObject`.

## Manipuler des objets Kubernetes

![Juggling]({BASE_URL}/imgs/articles/2021-08-25-un-premier-controleur-kubernetes-avec-controller-runtime/juggling.gif)

Pour manipuler un objet Kubernetes, on doit au préalable importer le paquet correspondant à son API Kubernetes (i.e. `networking` pour les `Ingresses` ; `apps` pour les `Deployments` ; etc.) afin d'accéder aux différentes structures des ressources.

Concentrons nous cette fois-ci sur la méthode `Reconcile()` dans laquelle on implémente notre logique. On récupérera une ressource avec `client.Get()` qui prend en argument un `NamespacedName` (qui représente simplement un couple `{Name;Namespace}`).


<div class="admonition note" markdown="1"><p class="admonition-title">Note</p>

Rappellez-vous que `reconcile.Request` n'est pas la représentation de l'objet en cours de réconciliation. Il ne contient que le nécessaire pour identifier une ressource.

</div>

```golang
func (r *reconcileIngress) Reconcile(ctx context.Context, request reconcile.Request) (reconcile.Result, error) {

	// Fetch Ingress
	ig := &networkingv1.Ingress{}
	r.client.Get(ctx, request.NamespacedName, ig)


	// Add Ingress annotation and update object
	ig.Annotations = map[string]string{
		"foo": "bar",
	}
	r.client.Update(ctx, ig)

	return reconcile.Result{}, nil
}
```

Une fois l'objet récupéré on peut le manipuler et changer son statut via les différentes méthodes --- `Update()` ; `Patch()` ; `Delete()` ; etc --- du client et on termine la réconciliation en retournant un couple `(reconcile.Result{}, error)`.

Pour finaliser l'explication, notre contrôleur scrute les *Ingresses* et déclenche des réconciliations à chaque fois qu'il reçoit un évènement dessus. La réconciliation consiste à récupérer l'*Ingress* qui a été modifié et à s'assurer qu'il porte bien un label `foo:bar`, rien de plus.

<div class="admonition info" markdown="1"><p class="admonition-title">Note</p>

Lorsque le contrôleur démarre, il déclenche des réconciliations pour toutes les ressources du type scruté qui existent déjà dans le cluster afin de partir d'un état cohérent.

</div>

Il ne vous reste plus qu'à vous assurer que le compte utilisé par le controller pour accéder aux ressources dispose de suffisamment de droits pour fonctionner correctement.

## Conclusion
Voilà, c'est à peu près tout ce qu'il faut selon moi pour commencer à s'amuser. La suite, c'est à vous de l'écrire.
Si je ne devais vous donner qu'un seul conseil, ce serait vraiment d'explorer la documentation des différents paquets du controller-runtime et les paquets des différentes API Kubernetes. Ils contiennent toutes les informations dont vous avez besoin.
