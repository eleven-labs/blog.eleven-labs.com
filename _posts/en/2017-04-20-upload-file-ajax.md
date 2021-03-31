---
layout: post
title: "Upload file with AJAX"
authors:
    - tthuon
lang: en
permalink: /upload-file-ajax/
excerpt: "Today, I would like to share with you a feature often requested in an application: uploading a file."
categories:
    - symfony
    - php
tags:
    - ajax
---

Today, I would like to share with you a feature often requested in an application: uploading a file.
Very often, the upload of a file is done via a form in html with the attribute **enctype="multipart/form-data"**. Then the form is posted to the server. But when a file weighs several megabytes, or several gigabytes, the user waits without any response from server during file uploading.

This is where AJAX comes in! (Wouhou!) It will both allow us to make this upload as asynchronous and allow to have information about its state.

Let's see how to implement a file upload system in JavaScript and with Symfony in server-side.

### Implementing the Symfony form

My form will contain two fields: **name** and **file**. The first one will contain the name of the file that the user wants to give. The second will be the representation of the file via the **Symfony\Component\HttpFoundation\File\UploadedFile** object.

Symfony has a **FormType** that is **FileType**. As the name suggests, it allows you to manage a form field of file type.

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

In addition to this form, I'll link it to an **AppBundle\Entity\File** entity, which will then allow me to persist it in the database.

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

I added constraints on the **file** field. It allows me to validate that the file that I will upload is the right type and a maximum size of 1Go.

On the controller side, I set up a route to display my form and another to handle the file upload query.


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

I set up a listener on the **kernel.view** event to handle the case where the form is invalid (see src/AppBundle/EventListener/ViewListener.php).

So far, nothing surprising. I invite you to read the Symfony documentation for more information: [http://symfony.com/doc/current/controller/upload_file.html](http://symfony.com/doc/current/controller/upload_file.html){:rel="nofollow"}.

Now let's move to the client side with JavaScript implementation.

### Client-side implementation with JavaScript

As a PHP developer, I think this part is the most interesting. This is where the magic of **[AJAX](https://fr.wikipedia.org/wiki/Ajax_(informatique)){:rel="nofollow"}** will take place. As a reminder, AJAX  stands for **Asynchronous JavaScript XML**, and allows the browser to interact with the server asynchronously.

[XMLHttpRequest](https://developer.mozilla.org/fr/docs/Web/API/XMLHttpRequest/Utiliser_XMLHttpRequest){:rel="nofollow"} is a browser-accessible JavaScript object that allows you to create AJAX requests.

I will first set up the HTML form.

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

Like the Symfony form that I just created earlier, there are two fields: **name** and **file**.

I added 3 DOM elements. They will allow me to display any errors and the progress of the upload.

Then I will add a listener on the **submit** event of the form. This will allow me to upload to AJAX instead of the html form.

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

At first, I will take all the form fields and put them in the **[FormData](https://developer.mozilla.org/fr/docs/Web/API/FormData){:rel="nofollow"}** object. It facilitates the transport of form values. This object will then be used during the AJAX query.

Then, I prepare my  **XMLHttpRequest** object. I tell him where to post the data, add some listeners and finally I pass my **FormData** object to the **send()** method to send the data.

In this way, this will create an upload request with the **multipart** header and all this asynchronously.

Example of HTTP request:

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

One of the listener allows me to track the advanced upload of the file: **xhr.upload.addEventListener("progress", onUploadProgress, false);**

```javascript
function onUploadProgress(event) {
    if (event.lengthComputable) {
        var percentComplete = event.loaded / event.total;
        document.getElementById('progress-value').textContent = parseFloat(percentComplete*100).toFixed(2);
    }
}
```

A **ProgressEvent** object passed to the **onUploadProgress** callback function. It contains information about the progress of the file upload. In my example, I display percentage progress. But we can imagine a progress bar in CSS.

Small demo in GIF  and full code here [https://github.com/lepiaf/file-upload](https://github.com/lepiaf/file-upload){:rel="nofollow"}

![](/assets/2017-04-20-upload-file-ajax/upload.gif)


### To conclude

We have seen together how to implement the upload of a file asynchronously with AJAX and Symfony. This method allows you to encode and send the file as a binary data stream. Unlike a base64 file encoding, it does not inflate the file's weight on the network. The representation of the file in base64 increases the weight of the file by **~33%**. For a few kilobytes file this increase in weight is not significant, but with a file of several megabytes, this has a significant impact. In addition, the file is properly managed by the browser and the server. This makes the upload more efficient and allows the use of a file resource representation on the server-side  (**$_FILES** on the PHP side).

Références :

- [https://developer.mozilla.org/fr/docs/Web/API/XMLHttpRequest/Utiliser_XMLHttpRequest](https://developer.mozilla.org/fr/docs/Web/API/XMLHttpRequest/Utiliser_XMLHttpRequest){:rel="nofollow"}
- [https://gist.github.com/joyrexus/524c7e811e4abf9afe56](https://gist.github.com/joyrexus/524c7e811e4abf9afe56){:rel="nofollow"}
- [http://stackoverflow.com/questions/18240692/is-using-multipart-form-data-any-better-then-json-base64](http://stackoverflow.com/questions/18240692/is-using-multipart-form-data-any-better-then-json-base64){:rel="nofollow"}
- [http://stackoverflow.com/questions/4715415/base64-what-is-the-worst-possible-increase-in-space-usage/4715499](http://stackoverflow.com/questions/4715415/base64-what-is-the-worst-possible-increase-in-space-usage/4715499){:rel="nofollow"}
- [https://tools.ietf.org/html/rfc7578](https://tools.ietf.org/html/rfc7578){:rel="nofollow"}
- [http://www.bortzmeyer.org/7578.html](http://www.bortzmeyer.org/7578.html){:rel="nofollow"}
