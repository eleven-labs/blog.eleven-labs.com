---
lang: fr
date: '2018-09-12'
slug: c-oriente-objet
title: Faire du C orienté Objet
excerpt: Faisons du C comme s'il s'agissait d'un langage Objet
cover: /assets/2018-09-12-faire-du-c-oriente-objet/cover.jpg
authors:
  - thuchon
categories: []
keywords:
  - software
  - c
  - procédural
  - poo
  - structure
  - pointeurs
---

## Introduction

Salut les Astronautes, content de vous retrouver aujourd'hui après un petit moment sans avoir posté d'article.

L'article que je vous propose aujourd'hui change un peu de ceux que j'ai pu écrire par le passé. La volonté est ici de transmettre mes tips/bonnes pratiques à n'importe quel développeur motivé. C'est pourquoi on va aborder un sujet simple, mais sous un angle différent de d'habitude.

Allons maintenant dans le vif du sujet. Cet article se veut assez spécialisé, on va parler de **C**, oui, oui, j'ai bien dit **C**, vous savez ce langage procédural où l'on doit faire toutes les allocations à la mano et pareil pour la libération de la mémoire.<br/>
Il est super important ce langage, le Kernel de votre ordinateur est codé en **C**, même si c'est un peu galère on peut tout faire avec, et commencer par ce langage vous permettra d'être capable d'apprendre n'importe quel langage plus facilement.<br/>
C'est pourquoi mon école (ça ne me rajeunit pas tout ça), nous l'a fait apprendre en premier, et j'ai créé par mal de petits programmes avec. Le seul inconvénient à l'époque était que je n'avais pas encore le recul sur la programmation comme je peux l'avoir aujourd'hui. Je vous avoue que j'aurais bien aimé qu'à l'époque une âme bienveillante me guide pour ne pas faire les erreurs que j'ai pu faire.


C'est donc dans ce but que je fais cet article, pour vous donner un autre regard sur la programmation procédurale, on va donc ensemble essayer de pousser le langage et de "**L'objectiser**".


## Mise en situation

Vous êtes étudiant en première année, vous avez un petit programme à faire qui doit être capable de gérer plusieurs utilisateurs et vous vous dites, bah tiens, ce serait bien de ne pas se faire un code hyper compliqué à maintenir, sait-on jamais, peut-être que j'aurais des nouvelles données pour mes utilisateurs dans le futur comme le téléphone fixe ou le code postal (ce sont des exemples).

Vous avez la solution 1, qui est de faire du **C** en mode normal, donc besoin de modifier beaucoup de code dès qu'une modification arrive, ou alors vous pouvez vous poser 30 minutes, et vous dire, essayons de faire les choses différemment. C'est là que j'interviens ;)

On va penser en mode objet pour du code procédural.<br/>
Pour faire ceci, on va utiliser 4 éléments du langage **C** :

- **Les structures**
- **Les pointeurs**
- **Les listes chainées**
- **Les pointeurs sur fonctions**

### Les structures

Ce sont un peu les ancêtres des objets que vous connaissez, il n'y pas de notion de privé/publique, tout est en publique ; il n'y a pas de méthodes, elles peuvent juste contenir des **propriétés** qui sont soit des types primitifs soit des pointeurs.

### Les pointeurs

On utilise beaucoup des références en code maintenant, mais il existe aussi les pointeurs, c'est une variable qui pointe vers un endroit spécifique dans la mémoire. Très utile, et tout notre système va reposer sur ça.

### Les listes chainées

On va réutiliser les 2 notions vues précédémment. Une liste chainée est ensemble de structures qui sont liées ensemble par des pointeurs.

### Les pointeurs sur fonctions

Je pense que vous vous en doutez vu ce que je vous ai décrit au dessus, ce sont des pointeurs non pas pour accéder à des données, mais à des fonctions qui ont été déclarées en mémoire.

Bon, c'est pas mal tout ça, on a vu les grosses notions, vous savez ce que l'on veut réaliser.<br />
Et si on passait au concret ? :)

## Comment nous allons procéder :

Encore aujourd'hui, je vais vous fournir du Dummy code qui va se lancer, et réaliser une série d'opérations qui sera définie dans le code, donc pas vraiment d'interaction avec l'utilisateur. L'idée est de vous présenter le principe, à vous de l'utiliser dans des cas réels.

Ici mon objectif est d'être capable de créer des "utilisateurs" et de pouvoir en rajouter/supprimer facilement, au cas où mon code doive partir en run.

Pour ce faire, commencons par créer nos "modèles" de données.

```C
typedef struct list list;
struct list
{
    list *next;
    void *obj;
};
```

Je créé déjà ma structure de liste chainée, l'idée de reproduire un **Array** comme il existe dans quasiment tous les langages.
On a donc un pointeur qui va pointer vers le prochain maillon de ma liste (next) et un pointeur de type void* pour contenir tout type d'objets car je veux être capable de pouvoir utiliser ma liste chainée pour tout type de choses (c'est plutôt pratique en vrai).

```C
typedef struct plop plop;
struct plop
{
    void (*hello)(plop*);
    char* name;
};
```

Ensuite voici le vrai "modèle" pour nos objets utilisateurs. Une structure de type plop qui contient deux attributs, **name** pour le nom de mon utilisateur et un pointeur sur fonction **hello** qui prend en paramètre un "objet" de type **plop**.

Alors, on a notre structure de données, c'est bien, mais qu'est-ce que l'on fait maintenant?
Et bien, on va coder nos "méthodes" de liste chainée pour reproduire les **new**, **add**, **remove**, **getObjectAtIndex** que l'on utilise tous les jours avec nos langages modernes.

Commençons par **New** :

```C
list* make_new_list() {
    list* ptr = malloc(sizeof(list*));
    return ptr;
}

plop* make_new_object(char *name) {
    plop* obj = malloc(sizeof(plop*));
    obj->name = name;
    obj->hello = hello;
    return obj;
}
```

**make_new_list** nous sert à créer une nouvelle liste, et **make_new_object** nous sert à créer un nouvel utilisateur. Pour le moment rien de bien compliqué, à part peut-être dans **make_new_object** qui assigne **hello** avec un **hello** qui n'existe pas dans le scope de la fonction, on y reviendra un peu plus tard.

Passons maintenant aux fonctions utilitaires de la liste chainée :

```C
void add_in_list(list* my_list, void* obj) {
    if (my_list->obj == NULL) {
        my_list->obj = obj;
        return;
    }
    list* list_ptr = my_list;
    while (list_ptr->next != NULL) {
        list_ptr = list_ptr->next;
    }
    list* tmp_list_obj = malloc(sizeof(list*));
    tmp_list_obj->obj = obj;
    tmp_list_obj->next = NULL;
    list_ptr->next = (void*)tmp_list_obj;
}

void remove_in_list(list* my_list, void* obj) {
    list* tmp = my_list;
    if (tmp->obj == obj) {
        my_list = tmp->next;
        return;
    }
    list* prev = NULL;
    while (tmp) {
        if (tmp->obj == obj) {
            prev->next = tmp->next;
            break;
        }
        prev = tmp;
        tmp = tmp->next;
    }
}

list* get_object_at_index(list* my_list, int index) {
    int i = 0;
    list* tmp = my_list;
    while (tmp) {
        if (i == index)
            return tmp;
        i++;
        tmp = tmp->next;
    }
    return NULL;
}
```

On crée la fonction **add_in_list** qui correspond au **Add**, la fonction **remove_in_list** qui correspond au **Remove** et la fonction **get_object_at_index** qui correspond au **GetObjectAtIndex**.<br/>
Veuillez bien noter que ces 3 méthodes prennent en paramètres des pointeurs qui ne sont pas typés ```C(void*)```, ce qui veut dire que vous pouvez réutiliser ces 3 fonctions dans tous vos projets, donc gardez les bien précieusement :)

- Bon bah, c'est pas mal tout ça, on a nos "modèles", nos fonctions pour jouer avec, on est parés non ?
- Bah euh non...
- Ah ? J'ai oublié un truc ?
- Bah t'avais pas parlé de la fonction **hello** au dessus ?
- Ah mais si bien-sûr, qu'est-ce que je ferais sans vous les astronautes ?

```C
void print_str(char* str) {
    write(1, str, strlen(str));
}

void hello(plop* obj) {
    print_str("Hello, my name is: ");
    print_str(obj->name);
    print_str("\n");
}

void print_list(list* my_list) {
    list* tmp = my_list;
    plop* obj = NULL;
    while (tmp) {
        obj = (plop*)(tmp->obj);
        obj->hello(obj);
        tmp = tmp->next;
    }
}
```

En fait, il nous manquait un peu plus que juste la fonction **hello**.<br />
On va rajouter ces 3 fonctions qui dans l'ordre font :
- Afficher une chaine de caractère
- Prendre un "objet" **plop** en paramètre et afficher son nom sur la console.
- Dérouler notre liste chainée et appeler la fonction **hello** sur chaque "objet".

On revient sur la fonction **hello**, cette fonction est maintenant déclarée dans notre code, et dans la fonction **make_new_object** on assigne le pointeur sur fonction de la structure fraîchement créée sur cette fonction qui a une adresse en mémoire. On doit juste passer "l'objet" en paramètre car on est pas capable d'appeler directement la méthode dessus. Cette idée m'est venue quand j'ai fait du **Python**, en effet, le self est automatiquement passé dans chaque méthode et on fait nos appels dessus.

## Le rendu final

Comme je vous ai dit, ce code a pour vocation de vous donner des idées et n'interagit pas vraiment avec l'utilisateur. Je vais donc vous dumper tout le code d'un coup, comme ça rien de plus simple pour vous, vous avez juste à le tester (par exemple sur [ideone](https://ideone.com/){:rel="nofollow noreferrer"})

```C
#include <stdlib.h>
#include <unistd.h>
#include <string.h>

typedef struct plop plop;
struct plop
{
    void (*hello)(plop*);
    char* name;
};

typedef struct list list;
struct list
{
    list *next;
    void *obj;
};

plop* make_new_object(char *);
list* make_new_list();
void print_str(char* str);
void hello(plop* obj);
void add_in_list(list* my_list, void* obj);
void remove_in_list(list* my_list, void* obj);
list* get_object_at_index(list* my_list, int index);
void print_list(list* my_list);

int main(int ac, char **av) {
    list* my_list = make_new_list();
    add_in_list(my_list, make_new_object("Pierre"));
    add_in_list(my_list, make_new_object("Paul"));
    add_in_list(my_list, make_new_object("Jacques"));
    print_list(my_list);
    return 0;
}

list* make_new_list() {
    list* ptr = malloc(sizeof(list*));
    return ptr;
}

plop* make_new_object(char *name) {
    plop* obj = malloc(sizeof(plop*));
    obj->name = name;
    obj->hello = hello;
    return obj;
}

void print_str(char* str) {
    write(1, str, strlen(str));
}

void hello(plop* obj) {
    print_str("Hello, my name is: ");
    print_str(obj->name);
    print_str("\n");
}

void add_in_list(list* my_list, void* obj) {
    if (my_list->obj == NULL) {
        my_list->obj = obj;
        return;
    }
    list* list_ptr = my_list;
    while (list_ptr->next != NULL) {
        list_ptr = list_ptr->next;
    }
    list* tmp_list_obj = malloc(sizeof(list*));
    tmp_list_obj->obj = obj;
    tmp_list_obj->next = NULL;
    list_ptr->next = (void*)tmp_list_obj;
}

void remove_in_list(list* my_list, void* obj) {
    list* tmp = my_list;
    if (tmp->obj == obj) {
        my_list = tmp->next;
        return;
    }
    list* prev = NULL;
    while (tmp) {
        if (tmp->obj == obj) {
            prev->next = tmp->next;
            break;
        }
        prev = tmp;
        tmp = tmp->next;
    }
}

list* get_object_at_index(list* my_list, int index) {
    int i = 0;
    list* tmp = my_list;
    while (tmp) {
        if (i == index)
            return tmp;
        i++;
        tmp = tmp->next;
    }
    return NULL;
}

void print_list(list* my_list) {
    list* tmp = my_list;
    plop* obj = NULL;
    while (tmp) {
        obj = (plop*)(tmp->obj);
        obj->hello(obj);
        tmp = tmp->next;
    }
}
```

## It's time to run the code

Bon, on a enfin tout en place, il suffit juste de runner notre bout de code.
Ici, pas de paillettes et de strass, juste 3 petites sorties console :

```Shell
Hello, my name is: Pierre
Hello, my name is: Paul
Hello, my name is: Jacques
```

Plutôt cool non ? :)

- Attends, on a pondu toutes ces lignes de code juste pour ça ?
- Oui
- Mais hum, elle est où la magie ?
- La magie n'est pas tout le temps visuelle, parfois c'est juste comment c'est fait derrière. En tant que développeurs vous devez vous challenger pour ne pas faire les choses d'une seule et même manière, varier les plaisirs.

## Mais pourquoi faire tout ça ?

Vous devez vous dire, mais pourquoi faire tout ça ?<br/>
Pour différentes raisons.<br/>
La première étant que c'est très, très fun. Imaginez montrer ce code à votre binôme de travail, et lui dire, tiens si on faisait le projet comme ça ?<br/>
Aussi, vous arrivez en soutenance avec une telle structure de code, le correcteur va se dire, ah tiens, ça sort de l'ordinaire, est-ce que l'on pourrait pousser encore plus loin et vous donner des vrais conseils pour la suite de vos projets.<br/>
Cela rend le code beaucoup plus lisible à mon goût aussi, on a quelques fonctions complexes et le reste est très facilement compréhensible.
Cela va vous apprendre à mieux découper votre code aussi et architecturer vos projets avec beaucoup moins de dépendance.

Voilà, comme je l'ai dit au début, cet article est différent des autres, il est plus réservé à des gens qui débutent dans la programmation. J'espère que cela vous aura plu. N'hésitez surtout pas à me faire des retours dans les commentaires.

Allez, salut les astronautes :)
