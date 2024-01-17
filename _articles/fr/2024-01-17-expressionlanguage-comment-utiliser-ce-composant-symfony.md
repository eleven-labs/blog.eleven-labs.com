---
contentType: article
lang: fr
date: '2024-01-17'
slug: symfony-expressionlanguage
title: 'Symfony ExpressionLanguage : Comment utiliser ce composant ?'
excerpt: >-
  "Découvrez le composant Symfony ExpressionLanguage : qu'est-ce que c'est ? Quand et comment l'utiliser ? Comment créer des expressions lors de cas plus complexes ?"
categories:
  - php
authors:
  - marianne
keywords:
  - bonnes pratiques
  - développement PHP
  - Symfony
  - ExpressionLanguage
---

L’[ExpressionLanguage](https://symfony.com/doc/current/components/expression_language.html), ça vous parle ? C’est un composant de Symfony qui existe depuis la version 2.4, autant dire qu’il a de la bouteille. Il est très utile pour quelques cas d’utilisation bien précis : je vais vous montrer quand et comment l’utiliser.

## Le fonctionnement du composant ExpressionLanguage de Symfony

L’ExpressionLanguage permet d’évaluer des expressions dynamiques en fonction d’un contexte. C'est particulièrement utile quand vous avez besoin d’interpréter des règles ou des instructions en utilisant un langage algorithmique léger. Ces dernières peuvent contenir des opérations mathématiques, des comparaisons, des conditions, des fonctions personnalisées, etc. Cela permet d’avoir une application plus flexible et configurable sans avoir à modifier le code source en cas de modification des règles.

### Quand est-il pertinent d'utiliser Symfony ExpressionLanguage ?

L’ExpressionLanguage peut être utilisé dans plusieurs cas :
-   Expression de règles métiers.
-   Gestion des droits utilisateurs : accès à l’application, autorisation sur certaines fonctionnalités, quota sur le nombre d’occurrences ou sur l’espace disque, etc.
-   Mapping de données.
-   Personnalisation de contenu : message, profil, comportement, etc.
-   Validation de données.

La liste n’est pas exhaustive, mais dans tous les cas il s’agit de la définition de règles dont l’algorithme doit être simple.

Prenons l’exemple du mapping de données qui va nous suivre pour la suite de l’article.

> Pour votre projet, vous avez besoin de mapper les données récupérées dans une API pour les transformer pour remplir un document PDF.

_Petite précision_ sur les deux fonctions permettant d’interpréter les règles :
-   `evaluate()` permet d’évaluer sans mettre en cache
-   `compile()` permet de compiler l’expression, [et donc de la mettre en cache](https://symfony.com/doc/current/components/expression_language.html#caching)

> On utilisera que `evaluate()` pour notre besoin.

## Cas pratique : Utiliser le composant ExpressionLanguage avec Symfony

Personnellement, j’aime utiliser l’ExpressionLanguage avec des règles écrites en YAML.
Dans le constructeur de ma classe `DataConverter`, je vais récupérer le mapping YAML que j’ai créé dans `/config` et initialiser mon service ExpressionLanguage.

```php
private readonly array $mapping;

private readonly ExpressionLanguage $expressionLanguage;

public function __construct()
{
   $this->mapping = Yaml::parseFile('config/mapping/data.yaml');
   $this->expressionLanguage = new ExpressionLanguage();
}
```

Dans ma fonction `convert`, je vais parcourir l’ensemble de mon mapping, et pour chaque ligne je vais utiliser le composant pour convertir l’expression indiquée dans le YAML.

```php
public function convert(array $data): array
{
   $pdfData = [];
   foreach ($this->mapping as $exportKey => $expression) {
       $pdfData[$exportKey] = $this->expressionLanguage->evaluate($expression, ['data' => $data]);
   }

   return $pdfData;
}
```

Voici les données récupérées sur mon utilisateur :
```php
$data = [
    'firstname' => 'Jean-Michel',
    'lastname' => 'MAPPER',
    'title' => 'mr',
    'address' => [
        'number' => '5',
        'street' => 'rue des données',
        'country' => 'France',
    ],
    'birthday' => '22/07/1987'
];
```

Voyons plus en détail le mapping pour un cas simple :

```yaml
person: 'data["firstname"] ~ " " ~ data["lastname"]'
```

Ici, pour le champ “person”, nous voulons la concaténation du firstname et du lastname. Comme vous avez pu le remarquer dans la fonction `evaluate()`, j’ai passé en second paramètre un tableau avec la clé `data` contenant les données de mon tableau avec les informations de l'utilisateur. Il est donc admis dans mon mapping que le nom du tableau des données à exploiter est `data`.

Vous pouvez remarquer que l’ensemble de l’expression est entre quotes et qu’on utilise les doubles quotes pour définir les clés du tableau `data`, vous noterez également que pour indiquer l’espace, on utilise `~ “ “ ~`.

On pourrait avoir le cas de cases à cocher pour indiquer la civilité avec une case pour “M” et une pour “Mme”.

```yaml
# Cache à cocher pour Monsieur/Madame /!\ ça dépendant de votre librairie pour remplir le PDF
title_mr: '"mr" === data["title"] ? 1 : 0'
title_ms: '"ms" === data["title"] ? 1 : 0'
```

On peut donc utiliser des opérations booléennes dans son expression : on part du principe que dans les données d’entrées, le `title` est un string qu’il faut comparer pour indiquer 0 ou 1 pour le PDF.

### Aller plus loin : créer une expression complexe 

On peut avoir besoin d’une expression un peu plus compliquée que les [opérateurs proposés](https://symfony.com/doc/current/reference/formats/expression_language.html#supported-operators) : on a besoin d’une “vraie” fonction.
Pas de panique, cela s’ajoute ! Dans la documentation de Symfony, il y a un cas simple pour convertir [le texte en minuscule](https://symfony.com/doc/current/components/expression_language.html#extending-the-expressionlanguage). On va essayer d’aller un peu plus loin : j’ai la date d’anniversaire et je dois la séparer en plusieurs champs pour le PDF.

```yaml
birthdate_day: 'getPartOfDate(data["birthday"], "day")'
birthdate_month: 'getPartOfDate(data["birthday"], "month")'
birthdate_year: 'getPartOfDate(data["birthday"], "year")'
```

Il faut rajouter la fonction dans votre `__construct()`
```php
$this->expressionLanguage->register('getPartOfDate',
   function ($date, $part) {
       throw new \Exception('Not use this function for compile()');
   },
   function ($arguments, $date, $part) {
       [$day, $month, $year] = explode('/', $date);


       return $$part;
   }
);
```

La fonction `register()` permet d’insérer une nouvelle fonction utilisable dans les expressions. Elle est composée :
-   du nom
-   de la fonction exécutée lors de la compilation (= pour la fonction `compile()` que je n’ai pas faite parce qu’elle n’a pas d’utilité dans mon cas)
-   de la fonction exécutée lors de l’évaluation (= pour la fonction `evaluate()`)

Il est possible de rajouter autant de paramètres que l’on veut pour le besoin, mais sachez que `$arguments` contient l’ensemble des données du context (contenant `data`).


## Conclusion : vous voilà prêts à utiliser le composant Symfony ExpressionLanguage !
J’espère que vous appréhendez un peu mieux ce composant et que vous allez pouvoir imaginer les cas d’utilisation qui seront utiles pour vos projets !
Mais n’oubliez pas qu’il faut utiliser un composant pour de bonnes raisons, sinon vous risquez de générer de la [dette technique inutilement](https://blog.eleven-labs.com/fr/comment-creer-de-la-dette-technique-des-le-debut-d-un-nouveau-projet/).
