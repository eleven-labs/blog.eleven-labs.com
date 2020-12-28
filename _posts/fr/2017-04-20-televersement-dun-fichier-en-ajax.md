---
layout: post
title: "Téléversement d’un fichier en AJAX"
authors:
    - tthuon
lang: fr
permalink: /fr/televersement-dun-fichier-en-ajax/
excerpt: "Aujourd’hui, je voudrais partager avec vous une fonctionnalité très souvent demandée dans une application : le téléversement d’un fichier."
categories:
    - Symfony
    - Php
tags:
    - ajax
---

Aujourd’hui, je voudrais partager avec vous une fonctionnalité très souvent demandée dans une application : le téléversement d’un fichier.
Très souvent, le téléversement d’un fichier se fait via un formulaire en html avec l’attribut **enctype="multipart/form-data"**. Ensuite le formulaire est posté au serveur. Mais lorsqu’un fichier pèse plusieurs mégaoctet, voir plusieurs gigaoctet, l’utilisateur attend sans avoir de retour sur l’état du téléversement du fichier.

C’est là qu’intervient AJAX ! (wouhou!) Il va nous permettre de rendre le téléversement d’un fichier asynchrone et permet d’avoir des informations sur son état.

Je vous propose de voir comment implémenter un système de téléversement de fichier en JavaScript et avec Symfony côté serveur.

### Implémentation du formulaire Symfony

Mon formulaire va contenir deux champs : **name** et **file**. Le premier va contenir le nom du fichier que l’utilisateur veut donner.
Le second sera la représentation du fichier via l’objet **Symfony\Component\HttpFoundation\File\UploadedFile**.

Symfony a un **FormType** qui est **FileType**. Comme son nom l’indique, il permet de gérer un champ de formulaire de type fichier.

```php
<?php
// src/AppBundle/Form/UploadType.php
namespace AppBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class UploadType extends AbstractType
{
    /**
     * {@inheritdoc}
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('name', TextType::class)
            ->add('file', FileType::class)
        ;
    }

    /**
     * {@inheritdoc}
     */
    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => 'AppBundle\Entity\File',
        ]);
    }
}
```

En plus de ce formulaire, je vais le lier à une entité **AppBundle\Entity\File**, ce qui va me permettre ensuite de le persister dans la base de données.

```php
<?php
// src/AppBundle/Entity/File.php

namespace AppBundle\Entity;

use Symfony\Component\HttpFoundation\File\UploadedFile;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity(repositoryClass="AppBundle\Repository\FileRepository")
 */
class File
{
    /**
     * @ORM\Id()
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     *
     * @var int
     */
    private $id;

    /**
     * @ORM\Column(type="string")
     * @Assert\NotBlank(message="Name should not be blank.")
     * @Assert\Type("string")
     *
     * @var string
     */
    private $name;

    /**
     * @Assert\NotBlank(message="File should not be blank.")
     * @Assert\File(
     *     mimeTypes={"image/jpeg", "image/png", "image/gif", "application/x-gzip", "application/zip"},
     *     maxSize="1074000000"
     * )
     *
     * @var UploadedFile
     */
    private $file;

    /**
     * @ORM\Column(type="string")
     *
     * @var string
     */
    private $path;
```

J’ai ajouté des contraintes sur le champ **file**. Il me permet de valider que le fichier que je vais téléverser est bien du bon type et d’une taille maximale de 1Go.

Côté contrôleur, je mets en place une route pour afficher mon formulaire. Et une autre pour gérer la requête de téléversement du fichier.


```php
<?php
// src/AppBundle/Controller/DefaultController.php
namespace AppBundle\Controller;

use AppBundle\Form\UploadType;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

class DefaultController extends Controller
{
    /**
     * @Route("/", name="homepage", methods={"GET"})
     */
    public function indexAction()
    {
        return $this->render('default/index.html.twig');
    }

    /**
     * @Route("/upload", name="upload", methods={"POST"})
     *
     * @param Request $request
     *
     * @return JsonResponse|FormInterface
     */
    public function uploadAction(Request $request)
    {
        $form = $this->createForm(UploadType::class);
        $form->handleRequest($request);

        if ($form->isSubmitted() &amp;&amp; $form->isValid()) {
            $this->getDoctrine()
                ->getRepository('AppBundle:File')
                ->store($form->getData());

            return new JsonResponse([], 201);
        }

        return $form;
    }
}
```

J’ai mis en place un écouteur sur l’événement **kernel.view** pour gérer le cas où le formulaire est invalide (voir src/AppBundle/EventListener/ViewListener.php).

Jusqu’ici, rien de surprenant. Je vous invite à lire la documentation Symfony pour avoir plus d’informations : [http://symfony.com/doc/current/controller/upload_file.html](http://symfony.com/doc/current/controller/upload_file.html){:rel="nofollow noreferrer"}.

Passons maintenant côté client avec la mise en place du JavaScript.

### Implementation côté client avec JavaScript

En tant que développeur PHP, je pense que cette partie est la plus intéressante. C’est ici que va prendre place la magie de l’AJAX. Pour rappel, *[AJAX](https://fr.wikipedia.org/wiki/Ajax_(informatique)){:rel="nofollow noreferrer"}** pour **Asynchronous JavaScript XML** permet au navigateur de dialoguer avec le serveur de manière asynchrone.

[XMLHttpRequest](https://developer.mozilla.org/fr/docs/Web/API/XMLHttpRequest/Utiliser_XMLHttpRequest){:rel="nofollow noreferrer"}est un objet JavaScript accessible via le navigateur qui permet de créer des requêtes AJAX.

Je vais d’abord mettre en place le formulaire HTML.

```html
<form id="upload-form">
    <label for="name">Name</label> <input id="name" type="text" name="name"><br>
    <label for="file">File</label> <input id="file" type="file" name="file">
    <input type="submit">
</form>
<p>Progress: <span id="progress-value"></span>%</p>
<p id="upload-complete"></p>
<p id="errors"></p>
```

À l’image du formulaire Symfony que je viens de créer plus tôt, il y a deux champs : **name** et **file**.

J’ai ajouté 3 éléments DOM. Ils vont me permettre d’afficher les éventuelles erreurs et la progression du téléversement.

Ensuite, je vais ajouter un écouteur sur l’événement **submit** du formulaire. Cela va me permettre de faire le téléversement en AJAX à la place du formulaire html.

```javascript
document.getElementById('upload-form').addEventListener('submit', onSubmit);

function onSubmit(event) {
    event.preventDefault();

    var formData = new FormData();
    formData.append("upload[file]", document.getElementById("file").files[0]);
    formData.append("upload[name]", document.getElementById("name").value);

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/upload");
    xhr.addEventListener('load', onRequestComplete, false);
    xhr.upload.addEventListener("load", onUploadComplete, false);
    xhr.upload.addEventListener("progress", onUploadProgress, false);
    xhr.send(formData);
}
```

Dans un premier temps, je vais prendre tous les champs du formulaire et les mettre dans l’objet **[FormData](https://developer.mozilla.org/fr/docs/Web/API/FormData){:rel="nofollow noreferrer"}**. Il facilite le transport des valeurs du formulaire. Cet objet sera ensuite utilisé lors de la requête AJAX.

Ensuite, je prépare mon objet **XMLHttpRequest**. Je lui indique l’url vers où poster les données, j’ajoute quelques écouteurs et enfin je passe mon objet **FormData** à la méthode **send()** pour envoyer les données.

De cette façon, cela va créer une requête de téléversement avec les en-tête **multipart** et tout cela en asynchrone.

Exemple de requête HTTP :

```sh
POST /upload HTTP/1.1
Host: localhost:8000
User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:52.0) Gecko/20100101 Firefox/52.0
Accept: */*
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Referer: http://localhost:8000/
Content-Length: 74305
Content-Type: multipart/form-data; boundary=---------------------------11413465171617698502697247091
Cookie: PHPSESSID=4vgbbv15gbfevea18tnso6fme6
Connection: keep-alive

-----------------------------11413465171617698502697247091
Content-Disposition: form-data; name="upload[file]"; filename="shutterstock_321267065.jpg"
Content-Type: image/jpeg

// much data here
-----------------------------11413465171617698502697247091
Content-Disposition: form-data; name="upload[name]"

mon fichier
-----------------------------11413465171617698502697247091--
```

Un des écouteurs me permet de suivre l’avancé du téléversement du fichier : **xhr.upload.addEventListener("progress", onUploadProgress, false);**

```javascript
function onUploadProgress(event) {
    if (event.lengthComputable) {
        var percentComplete = event.loaded / event.total;
        document.getElementById('progress-value').textContent = parseFloat(percentComplete*100).toFixed(2);
    }
}
```

Un objet **ProgressEvent** est passé à la fonction de rappel **onUploadProgress**. Il contient les informations sur la progression du téléversement du fichier. Dans mon exemple, j’affiche le pourcentage d’avancement. Mais on peut imaginer une barre de progression en CSS.

Petite démo en GIF :) et le code complet [https://github.com/lepiaf/file-upload](https://github.com/lepiaf/file-upload){:rel="nofollow noreferrer"}

![](/assets/2017-04-20-televersement-dun-fichier-en-ajax/upload.gif)


### Pour conclure

Nous avons vu ensemble comment mettre en place le téléversement d’un fichier de façon asynchrone avec AJAX et Symfony. Cette méthode permet d’encoder et d’envoyer le fichier comme un flux de données binaire. Contrairement a un encodage du fichier en base64, il ne fait pas gonfler le poids du fichier sur le réseau. La représentation du fichier en base64 fait augmenter le poids du fichier de **~33%**. Pour un fichier de quelques kilooctets cette augmentation de poids n'est pas significatif, mais avec un fichier de plusieurs mégaoctets, cela a un impact significatif. De plus, le fichier est correctement géré par le navigateur et le serveur. Cela rend le téléversement plus efficace et permet d’utiliser la représentation d’une ressource fichier côté serveur (**$_FILES** côté PHP).

Références :

- [https://developer.mozilla.org/fr/docs/Web/API/XMLHttpRequest/Utiliser_XMLHttpRequest](https://developer.mozilla.org/fr/docs/Web/API/XMLHttpRequest/Utiliser_XMLHttpRequest){:rel="nofollow noreferrer"}
- [https://gist.github.com/joyrexus/524c7e811e4abf9afe56](https://gist.github.com/joyrexus/524c7e811e4abf9afe56){:rel="nofollow noreferrer"}
- [http://stackoverflow.com/questions/18240692/is-using-multipart-form-data-any-better-then-json-base64](http://stackoverflow.com/questions/18240692/is-using-multipart-form-data-any-better-then-json-base64){:rel="nofollow noreferrer"}
- [http://stackoverflow.com/questions/4715415/base64-what-is-the-worst-possible-increase-in-space-usage/4715499](http://stackoverflow.com/questions/4715415/base64-what-is-the-worst-possible-increase-in-space-usage/4715499){:rel="nofollow noreferrer"}
- [https://tools.ietf.org/html/rfc7578](https://tools.ietf.org/html/rfc7578){:rel="nofollow noreferrer"}
- [http://www.bortzmeyer.org/7578.html](http://www.bortzmeyer.org/7578.html){:rel="nofollow noreferrer"}
