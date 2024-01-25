---
contentType: article
lang: fr
date: '2016-11-16'
slug: php-bien-gerer-ses-exceptions
title: Bien gérer ses exceptions
excerpt: >-
  Bonjour à tous ! Aujourd'hui je voudrais vous parler d'un sujet peu abordé en
  php : les exceptions. Une exception est une alerte lancée lors de l'exécution
  du code, pour indiquer que quelque chose ne s'est pas passé comme prévu. Cela
  peut être un mauvais identifiant de connexion à la base de données, ou bien
  une opération sur un fichier qui n'est pas autorisée, ou encore une division
  par zéro par exemple.
categories:
  - php
authors:
  - tthuon
keywords:
  - exception
  - best practice
  - error
---

Bonjour à tous ! Aujourd'hui je voudrais vous parler d'un sujet peu abordé en php : les exceptions. Une exception est une alerte lancée lors de l'exécution du code, pour indiquer que quelque chose ne s'est pas passé comme prévu. Cela peut être un mauvais identifiant de connexion à la base de données, ou bien une opération sur un fichier qui n'est pas autorisée, ou encore une division par zéro par exemple.

Une fois que cette alerte est levée, il faut bien en faire quelque chose. Soit je la laisse sous le tapis et je la passe sous silence, soit je la gère correctement pour que mon application continue de fonctionner normalement même après cette erreur.

Dans cet article, je vais m'intéresser à deux axes :

-   lever les exceptions
-   gérer les exceptions

## Lever les exceptions au bon moment

Commençons d'abord par le début, il y a une exception parce qu'à un moment dans l'application ou un des composants, une condition ou une opération n'a pas pu être remplie.

Il existe quelques bonnes pratiques sur la création des exceptions. Je vais m'intéresser à deux en particulier : le nommage et le contexte.

### Nommer l'erreur, pas l'émetteur

Il est plus facile de nommer l'exception par sa localisation plutôt que par le problème en lui-même. Ce n'est pas une bonne pratique, car le message renvoyé ne permettra pas d'identifier rapidement et simplement la cause. Par exemple, une opération de division par zéro génère une exception. Lancer une exception *OperationNotPossibleException* donne peu d'indications sur l'origine de l'erreur. Avec ce nom : *DivisionByZeroException*, l'erreur est claire et précise.

Une exception doit permettre de décrire le plus simplement possible le problème rencontré.

```php
<?php

class Filesystem
{
    public function copy($originFile, $targetFile, $overwriteNewerFiles = false)
    {
        if (stream_is_local($originFile) && !is_file($originFile)) {
            throw new FileNotFoundException(sprintf('Failed to copy "%s" because file does not exist.', $originFile), 0, null, $originFile);
        }
        (...)
    }
}

// https://github.com/symfony/symfony/blob/master/src/Symfony/Component/Filesystem/Filesystem.php#L41
```

Dans cet exemple, la copie n'a pas pu être effectuée à cause du fichier d'origine introuvable. L'exception est nommée par la cause de l'erreur et non par l'émetteur : ici la méthode *copy()*. Si j'avais nommé l'exception par l'émetteur, ça pourrait être *CouldNotCopyFileException*.

### Lever l'exception en fonction du contexte

Le nom de l'exception permet de comprendre la cause. Pour l'enrichir, il peut être intéressant de lui ajouter un contexte.

Les exceptions PHP de base ne permettent pas d'identifier le contexte de l'erreur. Avec l'extension SPL, il y a 13 exceptions supplémentaires. Elles sont regroupées en deux groupes : les exceptions logiques et les exceptions au moment de l'exécution (*runtime exception*).

Une exception logique montre un problème au niveau du code. Par exemple l'exception *\\InvalidArgumentException* donne une indication au développeur sur une erreur dans le code : un argument attendu n'est pas valide. En plus d'être nommée en fonction de la cause, je sais que c'est dans le contexte d'une exception logique. Cela signifie qu'en tant que développeur, je n'ai pas passé un bon argument à la méthode.

```php
<?php

class Constraint
{
    public static function getErrorName($errorCode)
    {
        if (!isset(static::$errorNames[$errorCode])) {
            throw new InvalidArgumentException(sprintf(
                'The error code "%s" does not exist for constraint of type "%s".',
                $errorCode,
                get_called_class()
            ));
        }
        return static::$errorNames[$errorCode];
    }
}

// https://github.com/symfony/symfony/blob/master/src/Symfony/Component/Validator/Constraint.php#L80
```

Les exceptions levées au moment de l'exécution du code ne peuvent pas être détectées avant leur interprétation. Ce sont les exceptions suivantes : *OutOfBoundsException*, *OverflowException*, *RangeException*, *UnderflowException*, *UnexpectedValueException*. A la différence d'une exception logique, ce n'est pas une erreur liée au code ou à sa mauvaise utilisation, mais liée à une erreur lors de l'exécution du code.

Prenons l'exemple *OutOfBoundsException*.  Cette exception indique que l'index n'a pas de valeur valide dans un tableau.

```php
<?php

class PropertyPath
{
    public function getElement($index)
    {
        if (!isset($this->elements[$index])) {
            throw new OutOfBoundsException(sprintf('The index %s is not within the property path', $index));
        }

        return $this->elements[$index];
    }
}

// https://github.com/symfony/symfony/blob/master/src/Symfony/Component/PropertyAccess/PropertyPath.php#L188
```

Ici, la taille du tableau varie en fonction de l'exécution du code. Il peut arriver que l'index sélectionné n'existe pas dans le tableau. Cette exception permet de protéger l'application contre une erreur fatale qui pourrait stopper l'interprétation du code.

Ces deux groupes d'exceptions peuvent être étendus pour décrire ses propres erreurs. Avec le principe de ségrégation des interfaces, il est possible de décrire plus précisément les erreurs qui peuvent survenir lors de l'utilisation d'une librairie. Cela permet notamment de savoir de quel composant provient l'erreur.

```php
<?php

class InvalidArgumentException extends \InvalidArgumentException implements ExceptionInterface
{
}

// https://github.com/symfony/symfony/blob/master/src/Symfony/Component/Validator/Exception/InvalidArgumentException.php
```

## Les attraper au bon moment

Il est tentant d'attraper toutes les erreurs qui peuvent survenir. Mais il est préférable d'attraper uniquement les exceptions que l'application est capable de gérer. Sinon, il vaut mieux les laisser se propager jusqu'au niveau le plus haut. Avec l'utilisation d'un framework tel que Symfony, une exception qui n'est pas attrapée dans l'application sera gérée par le framework (et affichera une belle page 500).

### Attraper ce qui est gérable

Dans une application moderne, le code est empilé comme des poupées russes. Une exception qui est levée à un endroit, même en profondeur, va remonter toutes les couches si elle n'est pas attrapée.

Avec ce principe, le développeur a la possibilité de maîtriser une partie des exceptions qui peuvent être levées. S'il ne peut pas les gérer, il va les laisser se propager dans les couches supérieures.

Prenons un exemple pour le cas d'une erreur gérable. Dans mon application, je dois contacter une API pour créer un utilisateur ou le mettre à jour. Je ne sais pas par avance si cet utilisateur existe ou non. Je vais d'abord faire une requête GET pour le savoir. L'API me renvoie soit une erreur 404 pour dire que l'utilisateur n'existe pas, ou une erreur 200 dans le cas contraire. Pour faire ces requêtes, j'utilise une librairie : [Guzzle](http://docs.guzzlephp.org/en/latest/). Dans le cas d'une 404, j'ai une exception [RequestException](https://github.com/guzzle/guzzle/blob/master/src/Exception/RequestException.php).

```php
<?php

public function actionType($username)
{
    try {
        $user = $client->get(sprintf("/api/user/%s", $username));
    } catch (RequestException $e) {
        if (404 === $e->getResponse()->getStatusCode()) {
            return "create";
        }

        throw $e;
    }

    return "update";
}
```

Dans cet exemple, je ne gère que le cas de la 404. Pour les autres types, je ne les gère pas, je re-lance l'exception pour laisser les autres couches de l'application la gérer.

### Laisser se propager le reste

Comme nous venons de le voir dans l'exemple précédent, je n'ai géré que l'exception dont j'ai besoin. Pour les autres cas, j'ai laissé l'exception se propager pour qu'elle remonte dans les couches les plus hautes.

Une application est un emboîtement de composants, qui lorsqu'ils sont assemblés ensemble permettent de construire une fonctionnalité. Une exception levée au niveau du composant, et donc au plus bas de la couche applicative, n'a pas de sens toute seule. Il y a un ensemble fonctionnel lié à cette exception. C'est cette chaîne fonctionnelle qui est capable de prendre soin de cette exception. Comme dans l'exemple précédent. C'est la fonctionnalité qui a permis de gérer cette exception, et non le composant Guzzle. Le composant n'a fait que lancer l'exception pour qu'elle remonte au plus haut.

Pour un framework, tel que Symfony, c'est le même principe. Si le développeur ne sait pas quoi faire de l'exception, il va la laisser remonter jusqu'à un écouteur capable de la gérer. Et tout en haut, il y a cet écouteur: [src\\Symfony\\Component\\HttpKernel\\EventListener\\ExceptionListener](https://github.com/symfony/symfony/blob/master/src/Symfony/Component/HttpKernel/EventListener/ExceptionListener.php).

## Pour conclure

Une exception, telle que son nom l'indique, est un événement qui arrive à un moment exceptionnel dans la vie de l'application. Elle arrive car une opération s'est mal déroulée, ou un développeur a mal utilisé un composant. Quelque soit la raison, l'exception se doit d'être le plus explicite possible. Sa bonne compréhension permet de la réparer au plus vite. Il est important de lever l'exception au bon moment.

Par contre, l'exception ne doit pas être mise sous le tapis, mais elle doit être gérée correctement. Une bonne gestion de l'exception passe par une bonne compréhension de la fonctionnalité attendue et de son périmètre. Attraper toutes les exceptions avec un \`try {} catch (\\Exception $e)\` est une très mauvaise pratique. Cela masquerait une exception encore plus grave.

Une exception bien lancée et gérée correctement permet à votre application d'être facilement maintenable et rend le diagnostic d'une erreur plus simple et rapide.

### Autre article sur le même sujet
* [PHP 7 Throwable Errors Exceptions]({BASE_URL}/fr/php7-throwable-error-exception/)

### Références

-   http://wiki.c2.com/?ExceptionPatterns
-   http://www.phptherightway.com/\#exceptions
-   http://ralphschindler.com/2010/09/15/exception-best-practices-in-php-5-3
