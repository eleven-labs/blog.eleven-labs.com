---
layout: post
title: "Symfony, Javascript et traduction : BazingaJSTranslationBundle, comment l'utiliser avec le format ICU ?"
excerpt: ""
authors:
    - marianne
permalink: /fr/2022-08-24-symfony-javascript-traduction-bazinga-js-translation-bundle-icu/
categories:
    - PHP
    - Javascript

---

# Symfony, Javascript et traduction : BazingaJSTranslationBundle, comment l'utiliser avec le format ICU ?

Même si de plus en plus d'architectes séparent le back et le front pour qu'ils puissent évoluer indépendamment, certaines applications (souvent du legacy) implémentent le front dans l'application Symfony avec twig et du javascript. Nous allons refaire le point sur le fonctionnement des traductions et sur le formattage ICU.

## Comment sont gérés les traductions dans Symfony ?
Dans les nombreux composants proposés par Symfony, il y a celui qui permet de gérer les traductions : [translation](https://symfony.com/doc/current/translation.html).

Il permet de générer les traductions soit par une phrase, soit par une clé dans le PHP (avec le service Translator) ou dans les twigs. Les fichiers de traductions peuvent être en YAML, XML et PHP, et l'emplacement ainsi que la langue par défaut sont définis dans la [configuration](https://symfony.com/doc/current/translation.html#configuration). Ils sont généralement nommés messages.{locale}.yaml.
```php
// PHP
use Symfony\Contracts\Translation\TranslatorInterface;

public function index(TranslatorInterface $translator)
{
    $translatedByPhrase = $translator->trans('Symfony is great'); // phrase
    $translatedByKey = $translator->trans('home.welcome'); // phrase
}
```
{% raw %}
```text
{# Twig #}
{% trans %}Symfony is great{% endtrans %}
{{ welcome.home|trans }}
```
{% endraw %}
```yaml
# translations/messages.fr.yaml
Symfony is great: J'aime Symfony
home:
    welcome: Bonjour
```


C'est pratique pour pouvoir gérer le texte statique, mais on peut avoir parfois besoin d'afficher des paramètres dans la phrase, ou encore de gérer les pluriels.

Pour cela, on peut rajouter des paramètres dans les fonctions, et Symfony possède la variable _%count%_ pour gérer les pluriels (uniquement pour des fichiers au format YAML ou PHP).
```php
// PHP
$translatedWithName = $translator->trans('home.welcome', ['%name%' => $name]);
$translatedWithCount = $translator->trans('home.notification.message', ['%count%' => $count]);
```
{% raw %}
```text
{# Twig #}
{{ welcome.home|trans({'%name%': name}) }}
{{ home.notification.message|trans({'%count%': count}) }}
```
{% endraw %}
```yaml
# translation
home:
    welcome: Bonjour %name%
    notification:
            message: {0}Vous n'avez aucun message|{1}Vous avez un message|]1,Inf[Vous avez %count% messages
```
> 👉🏻 Symfony gère les pluriels différemment en fonction de la langue : pour le français, le 0 équivaut au 1, mais pour les autres langues (hormis quelques langues spécifiques comme le russe), le 0 équivaut au pluriel. En effet, on va dire 0 message en français, mais 0 messages en anglais.

Il existe plein d'autres subtilités et de configurations ainsi que des bundles propres pour gérer les solutions Saas dans la documentation officielle.

D'ailleurs, ces solutions Saas utilisent un autre format que celui proposé de base par Symfony : le format ICU.

## Qu'est-ce que le format ICU ?
Le format ICU (International Components for Unicode) est un format de message largement utilisé dans de nombreux systèmes logiciels de traduction tels que localize.biz (et vous pouvez en apprendre plus sur son utilisation sur l’article [Gestion des traductions avec localise.biz](https://blog.eleven-labs.com/fr/gestion-des-traductions-avec-localise.biz/)), [phrase](https://phrase.com/), [lokalise](https://lokalise.com) ou encore [crowdin](https://crowdin.com/). Ce format permet de gérer des patterns tels que le pluriel.

Le format ne fait pas varier l'utilisation et l'ordonnancement des clés des fichiers de traduction, mais les fichiers doivent être renommés messages.{locale}+intl-icu.yaml et les patterns modifiés.

Reprenons l’exemple plus haut d’une traduction incluant le pluriel :
```yaml
home:
    notification:
            message: {0}Vous n'avez aucun message|{1}Vous avez un message|]1,Inf[Vous avez %count% messages
```
Devient en format ICU sous Symfony
```yaml
home:
    notification:
        message: >-
            count, plural,
                =0     {Vous n'avez aucun message}
                one   {Vous avez un message}
                other {Vous avez # messages}
            }
```


D’autres patterns existent : la sélection (par exemple l’indication du genre pour afficher le bon pronom), le formatage des dates, des pourcentages ou encore des affichages spécifiques des prix en fonction de la monnaie. Vous pouvez retrouver toutes les possibilités dans la [documentation de Symfony](https://symfony.com/doc/current/translation/message_format.html).


## Pour les traductions dans le Javascript, il y a BazingaJSTranslationBundle
[BazingaJSTranslationBundle](https://github.com/willdurand/BazingaJsTranslationBundle) sert à utiliser les traductions gérées par Symfony. Il va générer un fichier js avec l’ensemble des traductions qui vont pouvoir être ensuite utilisées dans les autres classes js.

Pour revenir à notre exemple de traduction sur le nombre de messages dont on doit être notifié, voici ce que cela donnerait :
```javascript
Translator.trans('home.notification.message', {'%count%': countNotifications}, 'messages');
```
> ⚠️ Il n’est plus conseillé d’utiliser _Translator.transChoice()_: la fonction _transChoice()_ du composant Translation de Symfony a été dépréciée et supprimée en version 5.

Ce bundle permet d'utiliser le format ICU en incluant la librairie externe _intl-messageformat.min.js_, mais malheureusement, tout ne se passe pas comme prévu.


## BazingaJSTranslationBundle et format ICU, que se passe-t-il ?

Lors d'une de mes missions, je me suis retrouvée devant deux problématiques.

Pour la première, il se trouve que certaines traductions comprenaient des tags HTML. Si cela ne posait aucun souci hors ICU, cela le devenait d’un coup. En comparant la version de BazingaJSTranslationBundle avec la dernière sortie et en lisant la dernière [Release Note](https://github.com/willdurand/BazingaJsTranslationBundle/releases/tag/5.0.0), je me suis rendu compte qu’il s’agissait d’un bug connu de ma version 4.*, et qu’elle était réglée en version 5.0. Une simple montée de version a donc résolu ce problème.

Concernant la deuxième, elle est survenue uniquement en mode production : impossible de récupérer le fichier js des traductions ! J’avais une belle erreur 500 😱

Je n'avais eu aucun souci en local, mais parce que les assets ne sont pas générés de la même façon entre la dev et la prod avec BazingaJSTranslationBundle. Pourquoi ? Parce qu’en prod, ça considère que le fichier messages.en+intl-icu.yaml est le même domaine que le fichier messages.en.yaml, et du coup, ça fonctionne !

Plusieurs PRs ont été proposées mais aucune n’a été acceptée pour l’instant (on dirait que la maintenance du bundle est un peu mort), il a fallu que je trouve en [réponse d’une des PRs](https://github.com/willdurand/BazingaJsTranslationBundle/pull/322#issuecomment-975614873) un petit tour de passe-passe (sinon, il allait falloir faire un fork) : rajouter un fichier vide nommé _messages.en.yaml_ en plus du votre fichier en format ICU.

## Conclusion

De plus en plus d’entreprises utilisent des solutions Saas pour gérer les traductions, et si vous devez faire une migration, vous allez devoir passer par cette passation de format de traduction. La phase est chronophage et fastidieuse, et l’existant peut réserver des surprises avec ce nouveau format. En espérant que cet article vous aura aidé soit à mettre en place des traductions, soit à faire cette migration !
