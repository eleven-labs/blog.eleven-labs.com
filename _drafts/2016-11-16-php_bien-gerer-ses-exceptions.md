---
layout: post
title: Bien gérer ses exceptions
author: tthuon
date: '2016-11-16 15:28:19 +0100'
date_gmt: '2016-11-16 14:28:19 +0100'
categories:
- Php
tags:
- php
- exception
- best practice
- error
---
{% raw %}
<p>Bonjour à tous ! Aujourd'hui je voudrais vous parler d'un sujet peu abordé en php : les exceptions. Une exception est une alerte lancée lors de l'exécution du code, pour indiquer que quelque chose ne s'est pas passé comme prévu. Cela peut être un mauvais identifiant de connexion à la base de données, ou bien une opération sur un fichier qui n'est pas autorisée, ou encore une division par zéro par exemple.</p>
<p>Une fois que cette alerte est levée, il faut bien en faire quelque chose. Soit je la laisse sous le tapis et je la passe sous silence, soit je la gère correctement pour que mon application continue de fonctionner normalement même après cette erreur.</p>
<p>Dans cet article, je vais m'intéresser à deux axes :</p>
<ul>
<li>lever les exceptions</li>
<li>gérer les exceptions</li>
</ul>
## Lever les exceptions au bon moment
<p>Commençons d'abord par le début, il y a une exception parce qu'à un moment dans l'application ou un des composants, une condition ou une opération n'a pas pu être remplie.</p>
<p>Il existe quelques bonnes pratiques sur la création des exceptions. Je vais m'intéresser à deux en particulier : le nommage et le contexte.</p>
### Nommer l'erreur, pas l'émetteur
<p>Il est plus facile de nommer l'exception par sa localisation plutôt que par le problème en lui-même. Ce n'est pas une bonne pratique, car le message renvoyé ne permettra pas d'identifier rapidement et simplement la cause. Par exemple, une opération de division par zéro génère une exception. Lancer une exception <em>OperationNotPossibleException</em> donne peu d'indications sur l'origine de l'erreur. Avec ce nom : <em>DivisionByZeroException</em>, l'erreur est claire et précise.</p>
<p>Une exception doit permettre de décrire le plus simplement possible le problème rencontré.</p>
<pre class="lang:php decode:true ">&lt;?php

class Filesystem
{
    public function copy($originFile, $targetFile, $overwriteNewerFiles = false)
    {
        if (stream_is_local($originFile) &amp;&amp; !is_file($originFile)) {
            throw new FileNotFoundException(sprintf('Failed to copy "%s" because file does not exist.', $originFile), 0, null, $originFile);
		}
		(...)
    }
}

// https://github.com/symfony/symfony/blob/master/src/Symfony/Component/Filesystem/Filesystem.php#L41</pre>
<p>Dans cet exemple, la copie n'a pas pu être effectuée à cause du fichier d'origine introuvable. L'exception est nommée par la cause de l'erreur et non par l'émetteur : ici la méthode <em>copy()</em>. Si j'avais nommé l'exception par l'émetteur, ça pourrait être <em>CouldNotCopyFileException</em>.</p>
### Lever l'exception en fonction du contexte
<p>Le nom de l'exception permet de comprendre la cause. Pour l'enrichir, il peut être intéressant de lui ajouter un contexte.</p>
<p>Les exceptions PHP de base ne permettent pas d'identifier le contexte de l'erreur. Avec l'extension SPL, il y a 13 exceptions supplémentaires. Elles sont regroupées en deux groupes : les exceptions logiques et les exceptions au moment de l'exécution (<em>runtime exception</em>).</p>
<p>Une exception logique montre un problème au niveau du code. Par exemple l'exception <em>\InvalidArgumentException</em> donne une indication au développeur sur une erreur dans le code : un argument attendu n'est pas valide. En plus d'être nommée en fonction de la cause, je sais que c'est dans le contexte d'une exception logique. Cela signifie qu'en tant que développeur, je n'ai pas passé un bon argument à la méthode.</p>
<pre class="lang:php decode:true ">&lt;?php

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

// https://github.com/symfony/symfony/blob/master/src/Symfony/Component/Validator/Constraint.php#L80</pre>
<p>Les exceptions levées au moment de l'exécution du code ne peuvent pas être détectées avant leur interprétation. Ce sont les exceptions suivantes : <em>OutOfBoundsException</em>, <em>OverflowException</em>, <em>RangeException</em>, <em>UnderflowException</em>, <em>UnexpectedValueException</em>. A la différence d'une exception logique, ce n'est pas une erreur liée au code ou à sa mauvaise utilisation, mais liée à une erreur lors de l'exécution du code.</p>
<p>Prenons l'exemple <em>OutOfBoundsException</em>.  Cette exception indique que l'index n'a pas de valeur valide dans un tableau.</p>
<pre class="lang:php decode:true ">&lt;?php

class PropertyPath
{
    public function getElement($index)
    {
        if (!isset($this-&gt;elements[$index])) {
            throw new OutOfBoundsException(sprintf('The index %s is not within the property path', $index));
        }

        return $this-&gt;elements[$index];
    }
}

// https://github.com/symfony/symfony/blob/master/src/Symfony/Component/PropertyAccess/PropertyPath.php#L188</pre>
<p>Ici, la taille du tableau varie en fonction de l'exécution du code. Il peut arriver que l'index sélectionné n'existe pas dans le tableau. Cette exception permet de protéger l'application contre une erreur fatale qui pourrait stopper l'interprétation du code.</p>
<p>Ces deux groupes d'exceptions peuvent être étendus pour décrire ses propres erreurs. Avec le principe de ségrégation des interfaces, il est possible de décrire plus précisément les erreurs qui peuvent survenir lors de l'utilisation d'une librairie. Cela permet notamment de savoir de quel composant provient l'erreur.</p>
<pre class="lang:php decode:true ">&lt;?php

class InvalidArgumentException extends \InvalidArgumentException implements ExceptionInterface
{
}

// https://github.com/symfony/symfony/blob/master/src/Symfony/Component/Validator/Exception/InvalidArgumentException.php</pre>
## Les attraper au bon moment
<p>Il est tentant d'attraper toutes les erreurs qui peuvent survenir. Mais il est préférable d'attraper uniquement les exceptions que l'application est capable de gérer. Sinon, il vaut mieux les laisser se propager jusqu'au niveau le plus haut. Avec l'utilisation d'un framework tel que Symfony, une exception qui n'est pas attrapée dans l'application sera gérée par le framework (et affichera une belle page 500).</p>
### Attraper ce qui est gérable
<p>Dans une application moderne, le code est empilé comme des poupées russes. Une exception qui est levée à un endroit, même en profondeur, va remonter toutes les couches si elle n'est pas attrapée.</p>
<p>Avec ce principe, le développeur a la possibilité de maîtriser une partie des exceptions qui peuvent être levées. S'il ne peut pas les gérer, il va les laisser se propager dans les couches supérieures.</p>
<p>Prenons un exemple pour le cas d'une erreur gérable. Dans mon application, je dois contacter une API pour créer un utilisateur ou le mettre à jour. Je ne sais pas par avance si cet utilisateur existe ou non. Je vais d'abord faire une requête GET pour le savoir. L'API me renvoie soit une erreur 404 pour dire que l'utilisateur n'existe pas, ou une erreur 200 dans le cas contraire. Pour faire ces requêtes, j'utilise une librairie : <a href="http://docs.guzzlephp.org/en/latest/">Guzzle</a>. Dans le cas d'une 404, j'ai une exception <a href="https://github.com/guzzle/guzzle/blob/master/src/Exception/RequestException.php">RequestException</a>.</p>
<pre class="lang:php decode:true">&lt;?php

public function actionType($username)
{
    try {
    	$user = $client-&gt;get(sprintf("/api/user/%s", $username));
    } catch (RequestException $e) {
    	if (404 === $e-&gt;getResponse()-&gt;getStatusCode()) {
            return "create";
        }

        throw $e;
    }

    return "update";
}</pre>
<p>Dans cet exemple, je ne gère que le cas de la 404. Pour les autres types, je ne les gère pas, je re-lance l'exception pour laisser les autres couches de l'application la gérer.</p>
### Laisser se propager le reste
<p>Comme nous venons de le voir dans l'exemple précédent, je n'ai géré que l'exception dont j'ai besoin. Pour les autres cas, j'ai laissé l'exception se propager pour qu'elle remonte dans les couches les plus hautes.</p>
<p>Une application est un emboîtement de composants, qui lorsqu'ils sont assemblés ensemble permettent de construire une fonctionnalité. Une exception levée au niveau du composant, et donc au plus bas de la couche applicative, n'a pas de sens toute seule. Il y a un ensemble fonctionnel lié à cette exception. C'est cette chaîne fonctionnelle qui est capable de prendre soin de cette exception. Comme dans l'exemple précédent. C'est la fonctionnalité qui a permis de gérer cette exception, et non le composant Guzzle. Le composant n'a fait que lancer l'exception pour qu'elle remonte au plus haut.</p>
<p>Pour un framework, tel que Symfony, c'est le même principe. Si le développeur ne sait pas quoi faire de l'exception, il va la laisser remonter jusqu'à un écouteur capable de la gérer. Et tout en haut, il y a cet écouteur: <a href="https://github.com/symfony/symfony/blob/master/src/Symfony/Component/HttpKernel/EventListener/ExceptionListener.php">src\Symfony\Component\HttpKernel\EventListener\ExceptionListener</a>.</p>
## Pour conclure
<p>Une exception, telle que son nom l'indique, est un événement qui arrive à un moment exceptionnel dans la vie de l'application. Elle arrive car une opération s'est mal déroulée, ou un développeur a mal utilisé un composant. Quelque soit la raison, l'exception se doit d'être le plus explicite possible. Sa bonne compréhension permet de la réparer au plus vite. Il est important de lever l'exception au bon moment.</p>
<p>Par contre, l'exception ne doit pas être mise sous le tapis, mais elle doit être gérée correctement. Une bonne gestion de l'exception passe par une bonne compréhension de la fonctionnalité attendue et de son périmètre. <span style="text-decoration: underline;"><span style="color: #ff0000; text-decoration: underline;">Attraper toutes les exceptions avec un `try {} catch (\Exception $e)` est une très mauvaise pratique</span></span>. Cela masquerait une exception encore plus grave.</p>
<p>Une exception bien lancée et gérée correctement permet à votre application d'être facilement maintenable et rend le diagnostic d'une erreur plus simple et rapide.</p>
#### Références
<ul>
<li>http://wiki.c2.com/?ExceptionPatterns</li>
<li>http://www.phptherightway.com/#exceptions</li>
<li>http://ralphschindler.com/2010/09/15/exception-best-practices-in-php-5-3</li>
</ul>
{% endraw %}
