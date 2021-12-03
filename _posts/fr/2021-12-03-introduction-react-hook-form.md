---
layout: post
title: Commencer à controller les formulaire avec React-hook-form
excerpt: Une courte introduction à React Hook Form
authors:
- dduval
permalink: /fr/commencer-a-controller-les-formulaire-avec-react-hook-form
categories:
    - ReactJS
---

# Commencer à controller les formulaire avec React-hook-form

Le but de ce premier article est de vous introduire simplement à react-hook-form
Nous n'allons pas ici parler de la maniere dont React-hook-form permets de gerer les composant incontrollés mais plutot quels outils cette librairie nous donnent pour gerer les composant controllés externes comme ceux de React-Select ou Material-UI

## Debutons tout ca

Sans grande surprise ils nous faut tout d'abord installer ce petit package (un de ses avantages):
```console
npm install react-hook-form
```

Puis importons le Hook useForm ainsi que le composant Controller depuis le packet:
```js
import { useForm, Controller } from "react-hook-form";
```

Puis utilisons le basiquement depuis le composant:
```js
const { control, handleSubmit } = useForm();
```

Le hook useForm retournes un object qui contiens un certains nombre de proprietés, Ici on utilise seulement control et handleSubmit.

Control est un object qui contients des methodes lié à un usage interne du coté de Reat Hook Form.
Il doit etre passer au composant Controller au meme titre que la proprieté name

La methode handleSubmit comme son nom l'indique, controle la soumission du formulaire et de doit etre passer en props onSubmit de notre composant form.
Cette methode prend deux fonctions en argument, la premiere est celle qui gereras les valeurs de notre formulaire en success, la seconde seras appeler avec les erreurs en cas d'echec.

```js
const onFormSubmit = data => console.log(data);

const onFormError = errors => console.error(errors);

<form onSubmit={handleSubmit=(onFormSubmit, onFormError)}>
{/* ... */}
</form>
```

## Et maintenant avec un composant tiers

On veut utiliser ici Material Ui pour creer nos fameux astronautes.
Avancons ici avec un simple input TextField de Material UI pour specifié un nom:

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

Detaillons un peu ici:
  Controller ici utilise un certains nombre de props:
  - name qui corresponds à l'attribut name d'un input classique
  - defaultValue qui comme son nom l'indique à la valeur par defaut de notre input
  - control que l'on a vu plus haut
  - render qui à lui besoin d'un composant et qui servira à "rendre" correctement notre input

  Analysons render en detail:
   3 props vont etre passé à notre composant de rendu (ici on en utilise seulement 2):
   field qui est un object qui va contenir les proprietés et methodes du champs (onChange, onBlur, value, name, ref)
   fieldState qui est un object qui va contenir des proprieté qui definissent l'etat du champ (invalid, isTouched, isDirty, error)
   formState qui est la meme que celle renvoyé par le hook useForm

  Il n'est pas indispensable de forward la reference du champs a notre input mais c'est necessaire pour gerer le focus lorsqu'il y a une erreur par exemple.
  Par contre bind field.onChange à la proprieté onChange de l'input est indispensable pour que la valeur de l'input soit remonté correctement

  C'est tout pour cette premiere introducion au formulaire avec React Hook Form, dans le prochaine article on aborderas la gestion des erreurs et la validation du formulaire

