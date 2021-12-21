---
layout: post
title: Introduction à React Hook Form
excerpt: Dans cet article vous apprendrez à contrôler vos formulaires avec React-hook-form.
authors:
    - dduval
permalink: /fr/introduction-react-hook-form/
categories:
    - Javascript
---

## Commencer à contrôler les formulaire avec React-hook-form

Le but de cet article est de vous présenter simplement react-hook-form. Nous n'allons pas ici parler de la manière dont React-hook-form permet de gérer les composants incontrollés maisnous allons plutôt nous attarder sur les outils que cette librairie nous donne pour gérer les composants controlés externes comme ceux de React-Select ou Material-UI.

## Allez ! Commençons.

Sans grande surprise il nous faut tout d'abord installer ce petit package (un de ses avantages) :
```console
npm install react-hook-form
```

Maintenant, importons le Hook useForm ainsi que le composant Controller depuis le packet :
```js
import { useForm, Controller } from "react-hook-form";
```

Nous l'utilisons basiquement depuis le composant :
```js
const { control, handleSubmit } = useForm();
```

Le hook useForm retourne un object qui contient un certain nombre de proprietés. Ici on utilise seulement "control" et "handleSubmit".

"Control" est un object qui contient des méthodes liées à un usage interne du coté de React Hook Form.
Il doit être passé au composant Controller au même titre que la proprieté "name".

La méthode "handleSubmit" comme son nom l'indique, contrôle la soumission du formulaire et doit être passée en "props onSubmit" de notre composant "form".
Cette méthode prend deux fonctions en argument, la première est celle qui gérera les valeurs de notre formulaire en success, la seconde sera appelée avec les erreurs en cas d'échec.

```js
const onFormSubmit = data => console.log(data);

const onFormError = errors => console.error(errors);

<form onSubmit={handleSubmit=(onFormSubmit, onFormError)}>
{/* ... */}
</form>
```

## Et maintenant avec un composant tiers

On veut utiliser ici Material Ui pour créer nos fameux astronautes.
Avançons ici avec un simple input TextField de Material UI pour spécifier un nom :

```js
<form onSubmit={handleSubmit=(onFormSubmit, onFormError)}>
  <Controller
    name="astronaute.name"
    defaultValue=""
    control={control}
    render={({ field, fieldState }) => (
      <TextField
        inputRef={field.ref}
        onChange={field.onChange}
      />
    )}
  />
</form>
```

Détaillons un peu :
Controller utilise un certain nombre de props :
 - "name" qui correspond à l'attribut name d'un input classique
 - "defaultValue" qui comme son nom l'indique a la valeur par défaut de notre input
 - "control" que l'on a vu plus haut
 - "render" qui a lui besoin d'un composant et qui servira à "rendre" correctement notre input

Analysons render en detail :
3 props vont etre passés à notre composant de rendu (ici on en utilise seulement 2) :
- field qui est un object qui va contenir les proprietés et méthodes du champ (onChange, onBlur, value, name, ref)
- fieldState qui est un object qui va contenir des proprietés qui définissent l'état du champ (invalid, isTouched, isDirty, error)
- formState qui est la même que celle renvoyée par le hook useForm

  Il n'est pas indispensable de forward la référence du champ à notre input mais c'est nécessaire pour gérer le focus lorsqu'il y a une erreur par exemple.
  Par contre bind "field.onChange" à la proprieté "onChange" de l'input est indispensable pour que la valeur de l'input soit remontée correctement.

  C'est tout pour cette introduction au formulaire avec React Hook Form, dans le prochain article on abordera la gestion des erreurs et la validation du formulaire !
