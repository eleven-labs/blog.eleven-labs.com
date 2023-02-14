---
layout: post
lang: en
date: '2020-02-12'
categories: []
authors:
  - thuchon
cover: /assets/2018-09-12-faire-du-c-oriente-objet/cover.jpg
excerpt: Let's write some C as an oriented programming language
title: Write C as oriented programming language
slug: c-oriented-programming-language
oldCategoriesAndTags:
  - software
  - c
  - procedural
  - oop
  - structure
  - pointers
permalink: /en/c-oriented-programming-language/
---

## Introduction

Hi Astronauts, happy to see you again on this day, after a while without publishing any article.

This article changes a bit from the previous ones. My goal here is to share my tips/good practices to any developer a bit motivated. This is why we are going to see a pretty simple subject, but from another point of view.

Let's not waste time, and dive directly into the subject. We are going to talk about **C**, yes, yes, I really said **C**, you know this procedural language where you need to do all the allocations and frees by yourself.<br/>
This language is really important, the kernel of your computer is coded in **C**, and even if it's a bit difficult, you can actually do anything with it. Starting with this language will allow you to learn any other language really easily.<br/>
This is why my school (damn, I feel old) teaches it as a first language, and to be frank I created a lot of softwares with it. The main issue at the time was that I didn't have the experience with programming that I have now. I have to admit that I wish I had someone to guide me and not the do the rookie mistakes I did.


## A little setup

You are a first year student and you need to code a little software that is able to handle many users. So you tell yourself: "actually that would be good to do some code not too complex to maintain in the future, you never know, you can have some new fields for your users in some time, like the phone number, the zip code, etc..." (those are examples).

You have the first solution, that is coding in regular **C**, so it means a lot of code maintenance when some modifications happen, or you can take 30 minutes, and tell yourself, ok let's try to do things from a different angle. This is where I step in ;)

We need to think oriented programming even if it's procedural code.<br/>
In order to do this, we will use 4 components of the **C** language :

- **Structures**
- **Pointers**
- **Chained lists**
- **Function pointers**

### Structures

We can associate them to the ancestors of the classes, there is no notion of private/public, everything is public inside of it, there are no methods, they just contain **properties** that are either primitive types, or pointers.

### Pointers

Lately, we use a lot of references when coding, but you also have pointers, it's a variable that points to a specific address in memory. Really useful, and a whole system is going to depend on this.

### Chained lists

We will use again the 2 previous notions. A chained list is a collection of structures linked to each other by some pointers.

### Function pointers

I think that you might have an idea of what it's based on, function pointers are not meant to access data, but to access some functions declared in memory.

So we just covered the big notions, now you know what we're going to realize.<br />
Let's dig into it.

## How to proceed:

As always, I will give you some dummy code that will run and realize a serie of tasks that will be defined in the code, so no real interactions with the user. The idea is to show you the overall idea, then it's your responsibility to use it in the real world :)

Here my objective is to be able to create "users" and to be able to add/remove them easily, in case my code has to go in run.

In order to do so, first let's create our data models.

```C
typedef struct list list;
struct list
{
    list *next;
    void *obj;
};
```

I create the structure for my chained list, the idea here is to reproduce an **Array** as you can find them in almost all languages.
So, as we can see, we have a pointer that points to the next link of my list (next in the structure) and a pointer of type void* that can point to any type of "object", because I want to be able to use this chained list for any type of structure I want to store (that's pretty convenient).

```C
typedef struct plop plop;
struct plop
{
    void (*hello)(plop*);
    char* name;
};
```

Then, here comes the real "model" for our user objects. A structure of type **plop** that contains two attributes, **name** for the name of the user and a function pointer **hello** that takes an "object" of type **plop**.

So, we have our data stucture, that's cool, but what do we do now?
We are going to code our "methods" for the chained list in order to reproduce the **new**, **add**, **remove**, **getObjectAtIndex** that we use on a daily basis in our modern languages.

Let's start with the **New** :

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

**make_new_list** creates a new list, and **make_new_object** creates a new user. Nothing difficult for now, except perhaps in **make_new_object** which assigns **hello** with a **hello** that does not exist in the function's scope. We'll get back to it later.

Let's now go to the toolkit functions for our chained lists:

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

We create the function **add_in_list** that reproduces the **Add**, the function **remove_in_list** that reproduces **Remove** and the function **get_object_at_index** that reproduces **GetObjectAtIndex**.<br/>
Please do notice that those 3 methods take as parameters pointers that do not have a type ```C(void*)```, it means that you can use again these 3 functions in all your projects, so keep them somewhere :)

- So far so good, we have our "models", our functions to play with. We're are all set I think, isn't it?
- Hum, I don't think so pal...
- What? Did I forget something?
- Yeah, I think you said something about the **hello** function above...
- Oh yes, my bad, my bad. Glad that you are there, what would I do without you?

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

So actually, it was missing a bit more than the **hello** function.<br/>
Let's add these 3 functions that by order:
- Write a string on the output console.
- Take a **plop** "object" as a parameter and display it on the console log.
- Loop on our chained list and call the function **hello** on every "object".

Let's come back on the **hello** function. This function is now declared in our code, and in the function **make_new_object** we assign the function pointer of the structure newly created on this function that already has an address in the memory. We just need to pass the "object" as a parameter because we are not able to call the function straight on it. This idea came to me when I did some **Python**, actually in **Python** the **self** is automatically given as a parameter in every method and then we can do the calls on **self**.

## The final look

As I told you before, this code is meant to be a demo in order to let you think about this way of coding, it does not really interact with the user. I will then dump all the code at once, so like that nothing more easy for you, you just have to test it (for exemple on ideone](https://ideone.com/){:rel="nofollow noreferrer"})

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

So everything is setup, you just have to run the code.
Here not much glamorous stuff, just 3 small outputs:

```Shell
Hello, my name is: Pierre
Hello, my name is: Paul
Hello, my name is: Jacques
```

Pretty cool isn't it? :)

- Hold on, we did all this code just for this result?
- Yes
- But hum, where is the magic?
- Magic is not always visual guys, sometimes it's how it's done behind the curtains. As developers you need to challenge yourselves to do stuff in many different ways, explore new horizons.

## But why do all this?

You are probably asking yourself, but why do all this?<br/>
For many reasons.<br/>
The first one is that it's really really fun. Imagine that you show this code to your dev partner, and you tell him, hey for once, let's do things like that.<br/>
Then when you arrive to present your project, with such an architecture, the guy in charge of the review will probably say: Damn Son Where'd Yyou find this???!!! Then he will see with you how to push it further and even give you some advices for your future projects.<br/>
Also, it makes the code way more easy to read in my opinion, you just have a few complex functions, and then everything else is easy to understand.
It also teaches you how to split your code and architecture your project with way less depedencies.

Here we are, as I told you at the beginning, this article is different from the previous ones, it is meant for the news developers. I hope you liked it. Please give me your feedback in the comments section.

See you space cowboys :)
