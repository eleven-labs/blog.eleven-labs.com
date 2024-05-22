---
contentType: article
lang: fr
date: '2024-05-20'
slug: crossplane-kubernetes-introduction
title: 'Gestion de ressources externes et platform engineering depuis un cluster Kubernetes avec Crossplane'
excerpt: >-
  Découvrez Crossplane, un outil open-source qui étend Kubernetes avec des concepts de platform engineering et permet de gérer le cycle de vie de vos ressources cloud dans une boucle de réconciliation.
seo:
  title: "Utiliser Crossplane dans un cluster Kubernetes : mode d'emploi"
  description: >-
    Découvrez ce qu'est crossplane et apprenez grâce à notre mode d'emploi à le configurer et à l'utiliser étapes par étapes dans votre projet.
cover:
  path: /imgs/articles/2024-05-20-crossplane-kubernetes/cover.jpg
categories:
  - architecture
authors:
  - dfert
keywords:
  - kubernetes
  - k8s
  - cloud
  - platform engineering
  - crossplane
---

![Logo Crossplane]({BASE_URL}/imgs/articles/2024-05-20-crossplane-kubernetes/crossplane-logo.webp)

Si on schématise grossièrement, Crossplane reprend le but initial de Terraform — IaC déclarative, gestion de state, etc. — en l'adaptant au modèle Kubernetes. Il s'installe sur un cluster et étend ses fonctionnalités pour permettre la gestion de ressources cloud qu'il va alors scruter et réconcilier automatiquement. _In fine_, ce cluster agira comme un _control plane_ pour ressources cloud et on le présente alors comme un _framework_ de _control plane cloud-natif_. Aussi, il s'intègre bien dans la logique de platform engineering en permettant de définir des abstractions poussées.

Ce projet open-source lancé par la société Upbound a rejoint la Cloud Native Computing Foundation (CNCF) en 2020 et est aujourd'hui au niveau de maturité _incubating_ depuis septembre 2021. J'ai découvert ce projet lors de la KubeCon de Paris 2024 et il m'a semblé intéressant d'en présenter les principaux concepts pour bien cerner l'étendu de ses capacités.

## Platform engineering kézako ? 🤔
> En quelques mots, c'est une approche visant à améliorer l'expérience développeur par la mise en place d'une plateforme de service permettant de demander de manière abstraite des ressources d'infrastructure. La complexité est alors gérée par les administrateurs de la plateforme et invisible pour les utilisateurs. 

Appliqué à notre cas, cette plateforme sera alors notre cluster Kubernetes sur lequel nous pourrons demander de l'infrastructure abstraite (e.g. "Un environnement de développement sur AWS") que Crossplane se chargera de mettre en place.

## Installation

Crossplane fournit un chart Helm pour faciliter son installation. On pourra l'installer sur un cluster de test avec la commande suivante qui mettra en place un `Namespace` (optionnel), des `ServicesAccounts`, des `Secrets`, des `ClusterRoles`/`ClusterRoleBinding`, un `Service`, des `Deployments`, des CRDs et des nouveaux endpoints d'API.

```helm
helm install crossplane \
crossplane-stable/crossplane \
--namespace crossplane-system \
--create-namespace \s
--set provider.packages='{xpkg.upbound.io/crossplane-contrib/provider-aws:v0.39.0}'
```

On pourra également installer la CLI `crank` disponible à cette adresse : https://releases.crossplane.io/stable/current/bin. Elle contient des outils pour le rendering, la validation de templates et des fonctions en local.

Une fois que tout est en place, rentrons maintenant dans le vif du sujet.

## En profondeur

### Providers

À l'image de Terraform, Crossplane utilise la notion de _provider_ pour désigner le composant responsable de faire les appels API vers les systèmes externes. Upbound distribue ses providers par "famille", à l'échelle d'un provider par service cloud (i.e. pour la famille AWS : un provider S3, un autre pour RDS, etc.). En plus des providers de service, chaque famille dispose aussi d'un provider de configuration globale pour cette famille. Ce dernier est déployé automatiquement dès que l'on utilise un des providers de service. Pour l'exemple et vous rappeller qu'il existe, nous l'utilisons explicitement pour déclarer notre premier provider, mais il n'est pas nécessaire.

![Family AWS]({BASE_URL}/imgs/articles/2024-05-20-crossplane-kubernetes/provider-family-transition.png)

Exemple de déclaration de providers :

```yaml
apiVersion: pkg.crossplane.io/v1
kind: Provider
metadata:
  name: provider-family-aws
spec:
  package: xpkg.upbound.io/upbound/provider-family-aws:v1.3.1
---
apiVersion: pkg.crossplane.io/v1
kind: Provider
metadata:
  name: provider-aws-rds
spec:
  package: xpkg.upbound.io/upbound/provider-aws-rds:v1.4.0
```

Upbound distribue ces providers sur son [marketplace](https://marketplace.upbound.io/providers) sur lequel on pourra consulter la liste de tous les providers natifs.

L'ajout d'un provider créé de nouveaux enpoints d'API qu'on utilisera pour créer nos différentes ressources externes. Les endpoints sont propres à chaque provider, et on consultera la documentation du provider pour voir quels types d'objet nous sont désormais accessibles. Le provider RDS rajoute l'endpoint `rds.aws.upbound.io/v1beta1` par exemple. Notez que Crossplane peut gérer des révisions lorsque l'on change la version du paquet d'un provider, mais par défaut, il utilisera toujours la plus récente et n'aura qu'une profondeur d'historique de 1.

On va maintenant configurer ce provider. Cela peut se faire à deux niveaux :

- Niveau *ressource managée* — En créant un objet `ProviderConfig` qu'on référencera dans les ressources managées via `spec.providerConfigRe.name` (exemple dans la prochaine section.) Ce sera alors une configuration que le contrôleur n'appliquera que pour la ressource en question. Comme les ressources créés depuis l'endpoints RDS sont *de facto* gérées par le Provider RDS, on ne précisera pas ici de référence entre les objets `ProviderConfig` et `Provider`.

```yaml
apiVersion: aws.upbound.io/v1beta1
kind: ProviderConfig
metadata:
  name: provider-family-aws
spec:
  credentials:
    secretRef:
      key: credentials
      name: example-aws-creds
      namespace: crossplane-system
    source: Secret
```

- Niveau global — En créant un objet `DeploymentRuntimeConfig` qu'on référencera dans le champ `spec.runtimeConfigRef` de l'objet `Provider`. La configuration sera alors appliquée au runtime du paquet du provider. L'exemple ci-dessous montre comment rajouter un flag au lancement du contrôleur pour activer une feature alpha.

```yaml
apiVersion: pkg.crossplane.io/v1beta1
kind: DeploymentRuntimeConfig
metadata:
  name: enable-external-secret
spec:
  deploymentTemplate:
    spec:
      selector: {}
      template:
        spec:
          containers:
            - name: package-runtime
              args:
                - --enable-external-secret-stores
---
apiVersion: pkg.crossplane.io/v1
kind: Provider
metadata:
  name: provider-family-aws
spec:
  package: xpkg.upbound.io/upbound/provider-family-aws:v1.3.1
  runtimeConfigRef:
    name: enable-external-secret
    # etc.
```

Notez qu'il est possible de faire une configuration 100% locale (e.g. avec le projet _LocalStack_) en modifiant l'endpoint du provider. On prendra soin d'adapter l'URL à notre usage.

```yaml
apiVersion: aws.upbound.io/v1beta1
kind: ProviderConfig
metadata:
  name: provider-family-aws
spec:
  credentials:
    secretRef:
      key: credentials
      name: example-aws-creds
      namespace: crossplane-system
    source: Secret
  endpoint:
    hostnameImmutable: true
    url:
      type: Static
      static: http://host.docker.internal:4566
  skip_credentials_validation: true
  skip_metadata_api_check: true
  skip_requesting_account_id: true
  # etc.
```

### Créer des ressources externes

Maintenant que notre provider RDS est déclaré et configuré, Crossplane va pouvoir interagir avec l'API AWS pour créer nos ressources. Demandons par exemple une instance RDS. L'objet Kubernetes suivant est alors appelé _ressource managée_.

```yaml
apiVersion: rds.aws.upbound.io/v1beta1
kind: Instance
metadata:
  name: my-rds-instance
spec:
  deletionPolicy: Delete
  providerConfigRef: 
    name: provider-family-aws
  forProvider:
    engine: postgres
    engineVersion: 16.1
    storageType: gp3
    # etc.
```
N.B. : La documentation de l'API RDS se trouve ici : https://marketplace.upbound.io/providers/upbound/provider-aws-rds/v1.3.1)

Une fois que cette ressource managée est déclarée, Crossplane va alors scruter le cloud provider pour vérifier que la ressource externe est dans l'état que nous avons demandé et tentera de corriger le *drift* sinon. Par défaut, Crossplane interroge les providers toutes les minutes et on pourra ajuster cet intervalle avec l'argument `--poll-interval n` du contrôleur. Notez qu'avec une valeur trop faible nos appels API risquent d'être bloqués par les cloud providers car trop fréquents. Crossplane reportera le statut des ressources managées en injectant un bloc `Conditions` directement dans l'objet. Aussi, toutes les informations de la ressource *externe* qui sont connues après création (e.g. ARN, id, etc.) seront renseignées a posteriori dans le champ `status.atProvider` de cet objet.

Sur le cloud, certaines ressources externes ont des attributs immuables. Par exemple, AWS ne permet pas de modifier le nom d'un bucket S3. Terraform triche un peu avec ça en autorisant la modification des champs immuables mais en proposant alors de recréer ces ressources (i.e. supprimer le bucket et le recréer avec le nouveau nom.) Crossplane, ne dispose pas de ce type de mécanisme et on ne pourra pas modifier les champs immuables. Pour faire l'équivalent, on devra supprimer et recréer nous-même l'objet en question. Le nom de la ressource externe est alors le même que celui de la ressource managée par défaut. 

### Policies

![police no way]({BASE_URL}/imgs/articles/2024-05-20-crossplane-kubernetes/policies_resized.png)

#### Deletion Policies

Crossplane permet de configurer comment le provider se comporte quand une ressource managée est supprimée de Kubernetes. Cette configuration est faite dans le bloc `spec.deletionPolicy` de la ressource et on distingue deux cas :

- `deletionPolicy: Delete` — La ressource externe est supprimée quand on l'objet est supprimé de Kubernetes (comportement par défaut)
- `deletionPolicy: Orphan` — La ressource externe n'est pas supprimée quand l'objet est supprimé de Kubernetes (ce qui laisse des orphelins sur le cloud, à l'image d'un `state rm` pour Terraform)

#### Management Policies

Les `managementPolicies` permettent de limiter les droits de Crossplane sur les ressources externes. On les spécifie dans le tableau `spec.managementPolicies` de nos ressources managées. Voici les différentes valeurs (cumulables) possibles :

</br>

| Policy          | Fonctionnement                                                                                                                                                              |
|---------------- |---------------------------------------------------------------------------------------------------------------------------------------------------------------------------  |
| *               | (Defaut) Crossplane a tous les droits sur la ressource externe.                                                                                                                |
| Create          | Crossplane est autorisé à créer la ressource externe si elle n'existe pas.                                                                       |
| Delete          | Crossplane est autorisé à supprimer la ressource externe quand la ressource managée est supprimée de Kubernetes.                                                                                             |
| LateInitialize  | On parle de *late initialization* quand un contrôleur Kubernetes met à jour les champs d'une ressource après sa création. Cette police autorise Crossplane à mettre à jour une ressource managée _a posteriori_ notamment pour l'enrichir avec des informations sur la ressource externe qui ne sont connues qu'après sa création (e.g ARN.)   |
| Observe         | Crossplane est autorisé à observer les ressources externes. Utile pour importer des ressources externes déjà existante sous forme de ressources managées.                                                                         |
| Update          | Crossplane est autorisé à appliquer des changements sur les ressources externes quand des changements sont appliqués sur les ressources managées.                                                                                                |

</br>

On récapitule différentes combinaisons intéressantes : 

| Create  | Delete  | LateInitialize  | Observe   | Update  |                                                                                     Description                                                                                     |
|:------: |:------: |:--------------: |:-------:  |:------: |:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|    ✔️     |    ✔️     |        ✔️         |    ✔️     |    ✔️     | Police par défaut. Crossplane a tous les droits sur la ressource.                                                                                                                      |
|    ✔️     |    ✔️     |        ✔️         |    ✔️     |         | Similaire à la police par défaut sans pouvoir mettre à jour la ressource externe (ce qui la rend immutable du point de vue de Crossplane)                                          |
|    ✔️     |    ✔️     |                 |    ✔️     |    ✔️     | Similaire à la police par défaut sans pouvoir rajouter à la ressource managée les valeurs de la ressource externe qui ne sont connues qu'après-création.                                            |
|    ✔️     |    ✔️     |                 |    ✔️     |         | Similaire à la police par défaut sans pouvoir rajouter à la ressource managée les informations connues _a posteriori_, ni modifier la ressource externe (union des 2 cas précédents.) |
|    ✔️     |         |        ✔️         |    ✔️     |    ✔️     | Similaire à la police par défaut sans pouvoir supprimer les ressources externes quand la ressource managée est supprimée.                                                                                                 |
|    ✔️     |         |        ✔️         |    ✔️     |         | Similaire à la police par défaut sans pouvoir supprimer les ressources externes quand la ressource managée est supprimée ni modifier la ressource externe après création.                    |
|    ✔️     |         |                 |    ✔️     |    ✔️     | Crossplane ne supprime pas la ressource externe quand la ressource managée est supprimée. Crossplane n'importe aucun paramètre de la ressource externe.                           |
|    ✔️     |         |                 |    ✔️     |         | Crossplane créé la ressource externe, mais n'applique aucun changement ni sur la ressource externe, ni sur la ressource managée et la suppression n'est pas autorisée                       |
|         |         |                 |    ✔️     |         | Crossplane observe seulement la ressource.                                                                                                               |
|         |         |                 |           |         | Aucune managed policy, équivaut à mettre la ressource managée en "pause" (les modifications n'ont plus lieu.)                                                                                                                        |

<br>

<div class="admonition tip" markdown="1"><p class="admonition-title">Important</p>

Quand la fonctionnalité de `managementPolicy` est activée et qu'on utilise une police différente de celle par défaut, la `managementPolicy` a priorité sur la `deletionPolicy`.
</div>

Nous savons désormais créer des ressources unitaires et paramétrer des droits. Il est alors temps de créer une première abstraction, à l'image peut-être de ce que permettent les modules Terraform.

### Créer une première abstraction

Attention, là, ça commence à se gâter. Certains termes sont assez proches et on a vite fait de les confondre. 
Pour mettre en place une abstraction, nous allons devoir combiner différents concepts qu'on synthétise dans le schéma ci-dessous. Détaillons chaque élément, en commençant par les compositions.

![Logo Crossplane]({BASE_URL}/imgs/articles/2024-05-20-crossplane-kubernetes/schema_crossplane_end_users.svg)
<p style="text-align: center;">Schéma d'interfaçage entre les différents concepts Crossplane</p></br>

#### Compositions

Une composition est une sorte de liste de ressource que l'on pourra créer par l'intermédiaire d'un seul objet (que l'on appellera alors _ressource composite_, nous y reviendrons). Prenons l'exemple ci-dessous :

```yaml
apiVersion: apiextensions.crossplane.io/v1
kind: Composition
metadata:
  name: my-first-composition
spec:
  compositeTypeRef:
    apiVersion: custom.api.exemple.org/v1alpha1
    kind: XRDS
  resources:
    - name: RDSInstance
      base:
        apiVersion: rds.aws.upbound.io/v1beta1
        kind: Instance
        spec:
          forProvider:
            region: eu-west-3
            # etc.
    - name: SubnetGroup
      base:
        apiVersion: rds.aws.upbound.io/v1beta1
        kind: SubnetGroup     
        spec:
          forProvider:
            region: eu-west-3
            subnetIdRefs:
              - name: db-subnet1
              - name: db-subnet2
            tags:
              Name: My DB subnet group
            # etc.
```
On retrouve notre liste de ressources dans `spec.resources[]` dans lequel j'ai remis notre instance RDS déclarée au début de ce billet, accompagnée d'un subnet group. Notez que `spec.resources[].name` est purement arbitraire ici et permet uniquement de se repérer dans le template.

Le bloc `spec.compositeTypeRef` indique quelle ressource composite est autorisée à utiliser cette composition. De plus, cela génère également un endpoint d'API qui nous permettra de référencer cette composition dans une autre composition. Dans l'exemple ci-dessous, on réutilise notre première composition et on déclare un rôle IAM supplémentaire :

```yaml
apiVersion: apiextensions.crossplane.io/v1
kind: Composition
metadata:
  name: my-second-composition
spec:
  resources:
    ### Réutilisation de la première composition
    - name: MainRDS
      base:
        apiVersion: custom.api.exemple.org/v1alpha1
        kind: XRDS
    ### Déclaration d'une ressource supplémentaire
    - name: IamRole
      base:
        apiVersion: iam.aws.upbound.io/v1beta1
        kind: Role 
        spec:
          forProvider:
            assumeRolePolicy: |
              {
                "Version": "2012-10-17",
                "Statement": [
                  {
                    "Effect": "Allow",
                    "Principal": {
                      "Service": "eks.amazonaws.com"
                    },
                    "Action": "sts:AssumeRole"
                  }
                ]
              }
            # etc.
    # etc.
```

Maintenant que nous avons une première composition, nous allons devoir mettre en place un endpoint d'API que nous pourrons ensuite utiliser pour créer nos ressources composites.

#### CompositeResourceDefinition

Pour cela, nous allons créer un objet `CompositeResourceDefinition` similaire à celui-ci :

```yaml
apiVersion: apiextensions.crossplane.io/v1
kind: CompositeResourceDefinition
metadata: 
  name: xrds.custom.api.exemple.org
spec:
  group: custom.api.exemple.org
  names:
    kind: XRDS
    plural: xrds
  versions:
    - name: v1alpha1
      served: true
      referenceable: true
      schema:
        openAPIV3Schema:
          type: object
          properties:
            spec:
              type: object
              properties:
                type:
                  type: string
                  # etc.
```

Cet objet permet essentiellement de définir un schéma d'API (type OpenAPI v3) pour la création de ressources composites. Nous définissons ainsi la structure de ces ressources en déterminant les champs que l'on pourra renseigner pour ces ressources (e.g. type d'instance, moteur de base de données, région). Les champs `spec.group` et `spec.names.kind` nous permettent de déterminer respectivement l'endpoint de l'API qui sera créé et le kind qu'on devra utiliser pour créer ces ressources.

N.B. : Par convention, Crossplane recommande pour les `CompositeResourceDefinition` de préfixer `spec.names[]` d'un `x` pour rappeler que la définition des APIs est custom (dans le sens qu'elles ne sont pas créé par le contrôleur Crossplane, mais géré par nous-même.)

La création de la `CompositeResourceDefinition` ci-dessus, engendre la création d'un endpoint `custom.api.exemple.org` que nous pourrons utiliser avec le `kind: XRDS`.

```yaml
apiVersion: custom.api.exemple.org/v1alpha1
kind: XRDS
metadata:
  name: my-composite-database
  annotations: 
    crossplane.io/external-name: my-custom-name
spec:
  type: large
```

#### Claims

Par définition, les ressources composites (et les ressources managées associées) ne sont pas namespacées. Lorsqu'elles le sont, on parle alors de Claim. On le défini exactement comme une ressource composite à la différence près qu'on utilisera le kind qu'on aura défini dans `spec.claimNames` (et non pas `spec.names)`.

```yaml
apiVersion: apiextensions.crossplane.io/v1
kind: CompositeResourceDefinition
metadata: 
  name: xrds.custom.api.exemple.org
spec:
  group: custom.api.exemple.org
  names:
    kind: XRDS
    plural: xrds
  claimNames:
    kind: RDS
    plural: rds
  versions:
    - name: v1alpha1
      served: true
      referenceable: true
      schema:
        openAPIV3Schema:
          type: object
          properties:
            spec:
              type: object
              properties:
                type:
                  type: string
                  #etc.
```

Avec l'exemple ci-dessus, on pourra créer le Claim ci-dessous avec le kind `RDS` (et non pas `XRDS`) et nos ressources seront cloisonnées au namespace `my-namespace`.

```yaml
apiVersion: custom.api.exemple.org/v1alpha1
kind: RDS
metadata:
  name: my-claimed-database
  namespace: my-namespace
spec:
  type: large
```

À noter que `spec.claimNames` est un champ optionnel alors que `spec.names` est obligatoire !

### Objets "Usage"

<div class="admonition tip" markdown="1"><p class="admonition-title">Note</p>

Cette fonctionnalité alpha est désactivée par défaut. Pour l'utiliser, assurez-vous que le composant core de Crossplane soit lancé avec le flag `--enable-usages`.
</div>

Les objets `Usage` offrent un autre moyen d'empêcher la suppression d'une ressource. On précisera la référence de la ressource managée que l'on souhaite protéger dans un bloc `spec.of` :

```yaml
apiVersion: apiextensions.crossplane.io/v1alpha1
kind: Usage
metadata:
  name: protect-prod-rds
spec:
  of:
    apiVersion: rds.aws.upbound.io/v1beta1
    kind: Instance
    resourceSelector:
      matchLabels:
        environment: production
  reason: "Production RDS instance- must not be deleted"
```

Si on le souhaite, on peut autoriser la suppression de cette ressource qu'après avoir supprimé une autre ressource que l'on définira dans un bloc `spec.by`. On fait ainsi une sorte d'ordonnancement pour les suppressions et il est tout à fait possible d'inclure ce type d'objets dans une composition.

```yaml
apiVersion: apiextensions.crossplane.io/v1
kind: Composition
metadata:
  name: my-first-composition
spec:
  compositeTypeRef:
    apiVersion: custom.api.exemple.org/v1alpha1
    kind: XRDS
  resources:
    - name: RDSInstance
      base:
        apiVersion: rds.aws.upbound.io/v1beta1
        kind: Instance
        metadata:
          name: my-rds-instance
        spec:
        # etc.
    - name: SubnetGroup
      base:
        apiVersion: rds.aws.upbound.io/v1beta1
        kind: SubnetGroup     
        metadata:
          name: my-subnet-group
        spec:
        # etc.
    # On inclut un objet "Usage" à notre composition
    - name: PreventDeletion
      base:
        apiVersion: apiextensions.crossplane.io/v1alpha1
        kind: Usage
        spec:
          of:
            apiVersion: rds.aws.upbound.io/v1beta1
            kind: SubnetGroup
            resourceRef:
              name: my-subnet-group
          by:
            apiVersion: rds.aws.upbound.io/v1beta1
            kind: Instance
            resourceRef:
              name: my-rds-instance
        # etc.
```

### Patches

![patch]({BASE_URL}/imgs/articles/2024-05-20-crossplane-kubernetes/patches_resized.png)

Le mécanisme de patch permet de récupérer et de transformer les valeurs des champs de nos différentes *Claims*/ressources composites pour les injecter dans nos compositions. On pourra manipuler les valeurs renseignées par nous-même (e.g. taille d'un disque), ou injectées par le contrôleur après création d'une ressource externe (e.g. ARN de la ressource). Un patch s'applique sur une ressource de composition et nous verrons plus tard un moyen pour l'appliquer à l'intégralité de la composition via des `EnvironmentConfigs`.

Voici tous les types de patches disponibles à ce jour :

<div class="admonition error" markdown="1"><p class="admonition-title">Attention</p>

La liste ci-dessous ne concerne que les patches de ressources individuelles (ressource managée) d'une composition. Nous verrons plus loin un autre contexte où les sources/destinations peuvent changer.
</div>

|       Type de patch       |                     Source de la donnée                           |                    Destination de la donnée               |
|:------------------------: |:---------------------------------------------------------------:  |:-------------------------------------------------------:  |
| FromCompositeFieldPath    | Un champ d'une ressource composite                                | Un champ de la ressource managée patchée                  |
| ToCompositeFieldPath      | Un champ d'une ressource managée patchée                          | Un champ d'une ressource composite patchée                |
| CombineFromComposite      | Plusieurs champs d'une ressource composite                        | Un champ dans la ressource managée patchée                |
| CombineToComposite        | Plusieurs champs d'une ressource managée patchée                  | Un champ d'une ressource composite                        |
| FromEnvironmentFieldPath  | Données issues d'une EnvironmentConfig                            | Un champ d'une ressource managée patchée.                 |
| ToEnvironmentFieldPath    | Un champ dans une ressource managée patchée.                      | L'environnement d'une EnvironmentConfig                     |
| CombineFromEnvironment    | Plusieurs champs issus de l'environnement d'une EnvironmentConfig | Un champ d'une ressource managée patchée.                 |
| CombineToEnvironment      | Plusieurs champs d'une ressource managée patchée.                 | Un champ dans l'environnement d'une EnvironmentConfig       |

N.B. : Les sources et destinations de ce tableau ne s'appliquent pas forcément pour les patches de ressource composite via les EnvironmentConfigs (qui seront détaillés dans la section appropriée) 
</br>

#### Nommage dynamique de ressources externes

Les ressources managées issues de Claim/ressources composites héritent d'un nommage en `<nom_du_claim>-<id_aleatoire>`. On peut changer ce comportement en rajoutant l'annotation `crossplane.io/external-name` aux ressources de notre composition. Avec l'aide des patches, on va pouvoir faire du nommage dynamique si on le souhaite. 
 
Reprenons notre premier exemple de composition. On va récupérer le type d'instance déclaré dans notre Claim/ressource composite et le passer à la ressource managée correspondante dans la composition. Aussi, nous injecterons le type d'instance dans le nom de cette ressource :

```yaml
apiVersion: apiextensions.crossplane.io/v1
kind: Composition
metadata:
  name: my-first-composition
spec:
  compositeTypeRef:
    apiVersion: custom.api.exemple.org/v1alpha1
    kind: XRDS
  resources:
    - name: RDSInstance
      base:
        apiVersion: rds.aws.upbound.io/v1beta1
        kind: Instance
        spec:
          forProvider:
            region: eu-west-3
      patches:
        # On récupère le type d'instance depuis le Claim sans le transformer
        - type: FromCompositeFieldPath
          fromFieldPath: spec.type
          toFieldPath: spec.type
        # On défini un pattern pour le nom de l'instance RDS qui contient un préfixe statique suivi du type de l'instance.
        # Le type d'instance est récupéré depuis le champ spec.type de notre Claim
        - type: FromCompositeFieldPath
          fromFieldPath: spec.type
          toFieldPath: annotations[crossplane.io/external-name]
          transforms:
            - type: string
                string:
                  type: Format
                  fmt: "static-rds-name-%s" # Résultat attendu avec notre exemple : "static-rds-name-large"
    - name: SubnetGroup
    # etc.
```

<div class="admonition warning" markdown="1"><p class="admonition-title">Attention</p>

Il est tentant d'utiliser les champs `spec.resources[].metadata.name` pour nommer nos ressources. Toutefois, le comportement dans une composition n'est pas le même que dans une déclaration de ressource managée unitaire où `metadata.name` est alors le nom de la ressource externe par défaut. Ici l'utilisation de `spec.resources[].metadata.name` est bien autorisée, mais les valeurs sont ignorées. Dans les compositions, c'est bien l'annotation "crossplane.io/external-name" qui va déterminer le nom final.
</div>

On peut également déclarer des patches au niveau Composition (au lieu du niveau Ressource) dans des `PatchSets` qui seront alors référençables par n'importe quelle ressource de cette composition.

```yaml
apiVersion: apiextensions.crossplane.io/v1
kind: Composition
metadata:
  name: my-first-composition
spec:
  compositeTypeRef:
    apiVersion: custom.api.exemple.org/v1alpha1
    kind: XRDS
  # On défini un patchset qu'on peut réutiliser dans les ressources de notre composition
  patchSets:
    - name: my-patchset
      patches:
        - type: FromCompositeFieldPath
          fromFieldPath: spec.type
          toFieldPath: spec.type
  resources:
    - name: RDSInstance
      base:
        apiVersion: rds.aws.upbound.io/v1beta1
        kind: Instance
        spec:
          forProvider:
            region: eu-west-3
      patches:
        # On référence un PatchSet
        - type: PatchSet
          patchSetName: my-patchset        
        # On défini un pattern pour le nom de l'instance RDS qui contient un préfixe statique suivi du type de l'instance. 
        # Le type d'instance et récupéré depuis le champ spec.type de notre Claim
        - type: FromCompositeFieldPath
          fromFieldPath: spec.type
          toFieldPath: annotations[crossplane.io/external-name]
          transforms:
            - type: string
              string:
                type: Format
                fmt: "static-rds-name-%s" # Résultat attendu avec notre exemple : "static-rds-name-large"
    - name: SubnetGroup
    # etc.
```

Je vous laisse explorer tout ce qu'il est possible de faire en lisant la documentation sur le sujet : https://docs.crossplane.io/latest/concepts/patch-and-transform/

### Environment Config

<div class="admonition tip" markdown="1"><p class="admonition-title">Note</p>

`EnvironmentConfig` est une fonctionnalité actuellement en alpha et donc désactivée par défaut. Pour l'utiliser, assurez-vous que le composant core de crossplane soit lancé avec le flag `--enable-environment-configs`.
</div>

Un `EnvironmentConfig` est un objet similaire à une `ConfigMap` qui sera utilisé pour créer un magasin de donnée en mémoire accessible uniquement au Claim/à la ressource composite. On utilisera ce type d'objet pour stocker de la donnée spécifique à un environement. C'est un mécanisme qui offre de la souplesse aux compositions pour la gestion de différents environnements.

Prenons cet exemple :

```yaml
apiVersion: apiextensions.crossplane.io/v1alpha1
kind: EnvironmentConfig
metadata:
  name: stagging
data:
  env: 
    name: stag
  rds:
    instanceType: large
```

Dans une `Composition`, on pourra alors associer notre `EnvironmentConfig` de 2 manières :

- En faisant une référence directe au nom de l'`EnvironmentConfig` via `spec.environment.environmentConfigs[].type: Reference`

```yaml
apiVersion: apiextensions.crossplane.io/v1
kind: Composition
metadata:
  name: my-composition
spec:
  compositeTypeRef:
    apiVersion: custom.api.exemple.org/v1alpha1
    kind: XRDS
  environment:
    environmentConfigs:
      # Référence directe
      - type: Reference
        ref:
          name: example-environment
# etc.
```

- En utilisant un sélecteur. On pourrait imaginer on associer automatiquement l'`EnvironmentConfig` de l'environnement de stagging en posant un label sur le Claim/la Ressource Composite par exemple.

```yaml
apiVersion: apiextensions.crossplane.io/v1
kind: Composition
metadata:
  name: my-composition
spec:
  compositeTypeRef:
    apiVersion: custom.api.exemple.org/v1alpha1
    kind: XRDS
  environment:
    environmentConfigs:
      # Référence via selector
      - type: Selector
       selector:
         matchLabels:
         # etc.
```

Une composition peut référencer plusieurs objets `EnvironmentConfig`. Au cours de la création/d'une mise à jour de ressource composite, les différentes `EnvironmentConfig` seront alors fusionnées pendant la création du magasin de donnée. On pourra ensuite lire ces données et les manipuler à travers les patches. On pourra par exemple récupérer une valeur du magasin pour rajouter un préfixe au nom de notre ressource composite et ainsi modifier le pattern de toutes les ressources managées sous-jacente. 

```yaml
apiVersion: apiextensions.crossplane.io/v1
kind: Composition
metadata:
  name: my-composition
spec:
  compositeTypeRef:
    apiVersion: custom.api.exemple.org/v1alpha1
    kind: XRDS
  environment:
    environmentConfigs:
      - type: Reference
        ref:
          name: stagging
    # On récupère le nom de l'environnement dans l'objet `EnvironmentConfig` et on l'injecte dans le nom de notre ressource composite 
    patches:
      - type: ToCompositeFieldPath
        fromFieldPath: env.name
        toFieldPath: annotations[crossplane.io/external-name]
        transforms:
          - type: string
            string:
              type: Format
              fmt: "static-rds-name-%s" # résultat attendu avec notre exemple : "static-rds-name-stag"
  resources:
    - name: RDSInstance
      base:
        apiVersion: rds.aws.upbound.io/v1beta1
        kind: Instance
        spec:
          forProvider:
            region: eu-west-3
        # etc.
```

Pour les patches déclarés dans `spec.environment.patches`, `ToCompositeFieldPath` copiera la donnée depuis le magasin vers la ressource composite et 
 `FromCompositeFieldPath` copiera la donnée depuis la ressource composite vers le magasin.

### Functions

Les fonctions sont des bouts de code qui sont exécutés au cours d'une composition. Elles peuvent être écrites dans différents langages. Crossplane fournit quelques fonctions directement [sur leur marketplace](https://marketplace.upbound.io/functions). Déclarons par exemple une fonction _Patch and transform_ qui reprend toutes les fonctionnalités que nous avons présentées dans la section Patches. On trouvera la documentation de cette fonction [ici](https://marketplace.upbound.io/functions/crossplane-contrib/function-patch-and-transform/v0.5.0).

```yaml
apiVersion: pkg.crossplane.io/v1beta1
kind: Function
metadata:
  name: function-patch-and-transform
spec:
  package: xpkg.upbound.io/crossplane-contrib/function-patch-and-transform:v0.5.0
```

Les fonctions s'utilisent dans des compositions séquentielles (`mode: Pipeline`) dans lesquelles on référencera les fonctions dans les différentes _steps_. Quand la composition contient plusieurs steps, elles sont exécutées dans leur ordre d'apparition dans la composition. La sortie d'une step est passée en entrée de la step suivante. 

Reprenons notre exemple initial en utilisant la **fonction** patch au lieu des patches du module core.

```yaml
apiVersion: apiextensions.crossplane.io/v1
kind: Composition
metadata:
  name: my-composition
spec:
  compositeTypeRef:
    apiVersion: custom.api.exemple.org/v1alpha1
    kind: XRDS
  mode: Pipeline
  pipeline:
    - step: patch-and-transform
      # On référence notre fonction ici
      functionRef:
        name: function-patch-and-transform 
      input:
        apiVersion: pt.fn.crossplane.io/v1beta1
        kind: Resources
        resources:
          # On déclare notre ressource ici
          - name: storage-bucket
            base:
              apiVersion: rds.aws.upbound.io/v1beta1
              kind: Instance
              spec:
                forProvider:
                  region: eu-west-3
            # On déclare les patches ici, mais en entrée d'une fonction cette fois
            patches:
              - type: FromCompositeFieldPath
                fromFieldPath: spec.type
                toFieldPath: spec.type
              - type: FromCompositeFieldPath
                fromFieldPath: spec.type
                toFieldPath: annotations[crossplane.io/external-name]
                transforms:
                  - type: string
                    string:
                      type: Format
                      fmt: "static-rds-name-%s"
          - name: SubnetGroup
          # etc.
```

Avec cet exemple, nous nous attendons à obtenir le même résultat qu'avec la méthode précédente. La différence majeure est que le rendu du template ne repose plus uniquement sur le module core de Crossplane, mais sur différents _packages_ que nous pourrons utiliser localement pour faire un _rendering_ de nos compositions à travers la commande `render` de la CLI Crossplane.

## Upjet pour faciliter la création de providers Crossplane

Crossplane a développé le projet `Upjet`, capable de générer automatiquement le code d'un provider Crossplane en lisant le code d'un provider Terraform. Il a servi d'accélérateur pour la création des principaux providers Crossplane tels que `upbound/provider-aws` ; `upbound/provider-azure` ou `upbound/provider-gcp` et pourrait vous être utile si vous souhaitez migrer un de vos provider personnalisé.

Le dépôt du projet se trouve ici : https://github.com/crossplane/upjet

## Conclusion : à votre tour de vous lancer avec Crossplane

Vous avez maintenant pas mal de matière pour commencer à jouer sérieusement avec Crossplane. Vous l'avez vu, c'est un projet assez conséquent qui nécessite d'être manipulé pour bien en comprendre les concepts. Toutefois, je suis convaincu que l'investissement sera rentable au vu des perspectives qu'il offre. Nous aurons l'occasion de compléter ce tour d'horizon dans de prochains articles, qui parlerons notamment de l'interfaçage de Crossplane avec d'autres systèmes comme Argo CD. Alors _Stay Tuned_ 😉.

## En savoir plus
- [Site internet de Crossplane](https://www.crossplane.io/)
- [Documentation Crossplane](https://docs.crossplane.io)
- [Crossplane Design Documents](https://github.com/crossplane/crossplane/tree/master/design)
- [Marketplace d'Upbound](https://marketplace.upbound.io/providers)
- [Documentation Upjet](https://github.com/crossplane/upjet/blob/main/docs/README.md)
-  KubeCon Paris 2024 : Crossplane Intro and Deep Dive - the Cloud Native Control Plane Framework
<p align="center"><iframe width="640" height="385" src="https://www.youtube.com/embed/S2BQz-5cboA" title="Crossplane Intro and Deep Dive - the Cloud Native Control Plane Framework" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></p>
