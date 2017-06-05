--- layout: post title: Introduction Galactique au Domain Driven Design
author: rpierlot date: '2016-02-17 15:23:36 +0100' date\_gmt:
'2016-02-17 14:23:36 +0100' categories: - Non classé tags: - php -
architecture - DDD --- {% raw %}

[Le Domain Driven Design, décrit dans le livre d’Eric Evans
]{style="font-weight: 400"}[“]{style="font-weight: 400"}*[Domain Driven
Design, Tackling Complexity in the Heart of
Software]{style="font-weight: 400"}*[”, permet de mieux appréhender la
complexité d’un projet en partageant une approche et un langage communs
par tous les membres impliqués dans la construction d’une
application.]{style="font-weight: 400"}

[Sa définition peut être énoncée en 3 points clés
:]{style="font-weight: 400"}

-   [Se concentrer sur le coeur du domaine]{style="font-weight: 400"}
-   [Explorer les modèles de son domaine via une collaboration créative
    des experts métiers et des développeurs]{style="font-weight: 400"}
-   [Parler un langage partagé (*ubiquitous language)* dans un contexte
    délimité (]{style="font-weight: 400"}*[bounded
    context]{style="font-weight: 400"}*[)]{style="font-weight: 400"}

[Le besoin d’un langage partagé]{style="font-weight: 400"}
----------------------------------------------------------

[Les experts métiers utilisent leur propre jargon, tandis que les
développeurs ont leur propre langage pour discuter de la façon dont ils
vont implémenter techniquement ce qui est exprimé par le métier. Ainsi,
une déconnexion survient entre le vocabulaire utilisé dans le code et
celui utilisé dans les discussions quotidiennes.
]{style="font-weight: 400"}[\
]{style="font-weight: 400"}[Eric Evans souligne ici un point crucial :
utiliser le modèle en tant que pierre angulaire du langage. Impliquer
l’équipe à s’exercer à utiliser ce langage partagé entre tous les
membres de l'équipe et dans le code. Utiliser le même vocabulaire à
l’écrit, à l’oral, dans les diagrammes… Cela rendra toute communication
plus cohérente et explicite. ]{style="font-weight: 400"}[\
]{style="font-weight: 400"}[Le fort couplage entre le langage et le
modèle permet ainsi de réduire toute confusion et de rendre le
design lisible. Tout changement dans le langage partagé impliquera donc
forcément du changement dans le code. Il est important de revoir le
design, renommer les méthodes ou classes pour convenir à l'évolution du
modèle.]{style="font-weight: 400"}

[Layered Architecture]{style="font-weight: 400"}
------------------------------------------------

[Dans une application complexe, de nombreuses choses sont mélangées au
sein du code : notre code métier est couplé avec notre base de données,
notre interface utilisateur, des librairies externes… Cela engendre une
plus grande difficulté pour faire évoluer le code, et même le
comprendre. Nous perdons le plus important dans la représentation de
notre code métier : sa compréhension et son évolutivité.
]{style="font-weight: 400"}[\
]{style="font-weight: 400"}[Le *Domain Driven Design* permet de répondre
à ce problème en isolant complètement le code métier de
notre application et en éliminant toute dépendance superflue :
infrastructure, interface utilisateur, logique
applicative…]{style="font-weight: 400"}

[![Screen Shot 2016-01-31 at 14.43.25
1](http://blog.eleven-labs.com/wp-content/uploads/2016/01/Screen-Shot-2016-01-31-at-14.43.25-1-300x185.png){.size-medium
.wp-image-1566 .aligncenter width="300"
height="185"}](http://blog.eleven-labs.com/wp-content/uploads/2016/01/Screen-Shot-2016-01-31-at-14.43.25-1.png)

[Ainsi l’architecture adoptée du *Domain Driven Design* est composée de
4 couches. Voyons cela plus en détail.]{style="font-weight: 400"}

#### Domain

Cette couche contient l’information sur le domaine. C’est le coeur de
l’application.  C’est ici que votre code métier vit. Le stockage de
données est une tache délaissée à la couche infrastructure.\
Nous détaillerons plus profondément comment modéliser notre métier dans
la partie suivante.

#### [Presentation (ou User Interface)]{style="font-weight: 400"}

[Cette couche a pour responsabilité de présenter les informations
observables du systèmes à l’utilisateur et interpréter ses
intentions vis-à-vis du système.]{style="font-weight: 400"}

#### [Application]{style="font-weight: 400"}

[Cette couche est responsable de la coordination de l’activité de
l’application. Aucune logique métier n’est présente dans cette couche,
et elle ne maintient aucun état des objets du domaine. Cependant, elle
peut contenir un état de progression d’une tache
applicative.]{style="font-weight: 400"}

#### [Infrastructure]{style="font-weight: 400"}

[Cette couche cache les détails d'implémentation technique de
l’application, et s'occupe de la persistance des données du modèle. La
communication entre les couches fait parti du rôle de l’infrastructure.
]{style="font-weight: 400"}[\
]{style="font-weight: 400"}[Ainsi, tout ce qui est choix d’ORM, de
serializer ou tout autre détail technique est implémenté dans cette
couche. Cela a un gros bénéfice : la couche domaine n’est pas du tout
consciente des choix techniques, et donc aucune dépendance n’est
introduite avec notre modèle. ]{style="font-weight: 400"}

 

[Ce découpage en couches permet aux objets du domaine de se concentrer à
modéliser le métier, car ils n’ont pas la responsabilité de se persister
en base de données, de s’afficher…]{style="font-weight: 400"}[\
]{style="font-weight: 400"}[Voilà donc un autre point intéressant :
l'indépendance du domaine, le fait de se concentrer uniquement sur le
modèle du domaine, et l'isoler de tout système
externe.]{style="font-weight: 400"}

[Modéliser son ]{style="font-weight: 400"}*[domain]{style="font-weight: 400"}*
------------------------------------------------------------------------------

[Nous venons de voir que la couche ]{style="font-weight: 400"}*[domain
]{style="font-weight: 400"}*[est celle qui contient toute la logique
métier. La modélisation du domaine est faite avec de nombreux éléments.
Voyons en quelques uns en détail.]{style="font-weight: 400"}

#### [Entities]{style="font-weight: 400"}

[Ce sont des objets avec une identité et un cycle de vie (ex: un
Customer, un Purchase)]{style="font-weight: 400"}

#### [Value Objects]{style="font-weight: 400"}

[Elément clé du Domain Driven Design, un Value Object peut être défini
de la sorte : un objet dont la notion d’égalité n’est pas basée sur son
identité mais sur ses attributs. Ainsi, une date, une devise ou encore
une adresse sont des candidats naturels pour devenir des Value
Objects.]{style="font-weight: 400"}

[[![Screen Shot 2016-01-31 at
15.44.05](http://blog.eleven-labs.com/wp-content/uploads/2016/01/Screen-Shot-2016-01-31-at-15.44.05-300x173.png){.size-medium
.wp-image-1567 .aligncenter width="300"
height="173"}](http://blog.eleven-labs.com/wp-content/uploads/2016/01/Screen-Shot-2016-01-31-at-15.44.05.png)]{style="font-weight: 400"}[Les
Value Objects permettent de nommer explicitement des concepts clés de
notre modèle, d’en améliorer la lisibilité et la
communication.]{style="font-weight: 400"}[\
]{style="font-weight: 400"}[Il est fortement conseillé de rendre les
Value Objects immuables, car s’ils sont partagés, ils peuvent mettre en
péril l’intégrité des données.]{style="font-weight: 400"}

#### [Services]{style="font-weight: 400"}

[Quand certaines opérations agissent sur notre domaine et qu'elles ne
sont pas la responsabilité d'une entité ou d'un value object, il est
nécessaire de créer un service du domaine. Le nom de ce service doit
faire parti du *ubiquitous language*.]{style="font-weight: 400"}

#### [Domain Events]{style="font-weight: 400"}

Les événements métiers permettent de modéliser l'information sur
l'activité du domaine. Un *domain event *est une représentation de
quelque chose qui s'est passé dans le domaine.

#### [Repositories]{style="font-weight: 400"}

[Pour chaque entité qui nécessite un accès, il faut créer une interface
qui définira l’ajout et la suppression, ainsi que la sélection d’objets
selon différents critères. L’implémentation de cette interface sera
effectuée dans la couche infrastructure (notre domaine ne sait pas
comment les objets sont persistés ou
récupérés)]{style="font-weight: 400"}

#### [Specifications]{style="font-weight: 400"}

[Un dernier aspect que j’aimerai aborder concerne le pattern
]{style="font-weight: 400"}*[[specification](http://martinfowler.com/apsupp/spec.pdf)]{style="font-weight: 400"}*[.
Ce dernier ne fait pas parti des *building blocks* du *Domain Driven
Design,* mais présente de nombreux avantages.\
Très simple à mettre en place, il permet d’encapsuler vos règles métiers
dans une classe avec une sémantique précise.]{style="font-weight: 400"}

``` {.theme:sublime-text .lang:php .decode:true title="Le pattern specification"}
<?php

class RocketCanBeLaunched implements Specification
{
    public function isSatisfiedBy($rocket)
    {
        foreach ($rocket->getAstronauts() as $astronaut) {
            if (false === $astronaut->isReady()) {

                return false;
            }
        }

        return true;
    }
}
```

[Les spécifications ont un réel intérêt car elles présentent les
avantages suivants : ]{style="font-weight: 400"}

-   [Un code indépendant]{style="font-weight: 400"}
-   [Facilement testable]{style="font-weight: 400"}
-   [Une sémantique guidée par le métier]{style="font-weight: 400"}

[Il est clair que définir ses règles métiers au travers de
spécifications accroît la lisibilité et la maintenabilité de votre
application.]{style="font-weight: 400"}

 

[Tous ces patterns permettent ainsi une meilleure séparation des
responsabilités et ont pour objectifs de rendre explicite notre modèle.
]{style="font-weight: 400"}

#### Conclusion

[Le Domain Driven Design permet donc de se focaliser sur le métier,
plutôt que la technique. Afin d'obtenir un domaine autonome, notre
application peut être divisée en quatre couches : Presentation,
Application, Domain et Infrastructure.]{style="font-weight: 400"}

[Penser à sa modélisation métier en communiquant et en utilisant un
langage partagé au sein de l’équipe permettra une meilleure lisibilité.
De plus, prendre du recul avant d’implémenter une fonctionnalité pour
savoir dans quel contexte cette dernière intervient vous garantira une
meilleure maintenabilité, ainsi qu’une plus grande aisance lors de la
lecture de votre code.\
Le *ubiquitous language *et les outils de modélisation du modèle
permettent de faire apparaître l'intention dans le code, et d'expliciter
les contextes. N'est-ce pas une approche
intéressante?]{style="font-weight: 400"}

 

[![CZ4vGqYUEAEkzNa.jpg-large](http://blog.eleven-labs.com/wp-content/uploads/2016/02/CZ4vGqYUEAEkzNa.jpg-large-300x207.jpeg){.wp-image-1592
.aligncenter width="659"
height="455"}](http://blog.eleven-labs.com/wp-content/uploads/2016/02/CZ4vGqYUEAEkzNa.jpg-large.jpeg)

### Pour aller plus loin

[Domain Driven Design
Quickly](http://www.infoq.com/minibooks/domain-driven-design-quickly)

[Domain Driven Design : des armes pour affronter la
complexité](http://blog.octo.com/domain-driven-design-des-armes-pour-affronter-la-complexite/)

[Why Value Objects](http://thepaulrayner.com/blog/why-value-objects/)

{% endraw %}
