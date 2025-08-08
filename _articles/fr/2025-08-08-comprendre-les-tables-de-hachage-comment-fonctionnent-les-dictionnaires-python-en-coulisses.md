---
contentType: article
lang: fr
date: 2025-08-08
slug: comprendre-les-tables-de-hachage-comment-fonctionnent-les-dictionnaires-python-en-coulisses
title: "Comprendre les tables de hachage: comment fonctionnent les dictionnaires Python en coulisses"
excerpt: Description of the article (Visible on the list pages)
cover:
    alt: Alt image
    path: /imgs/articles/2025-08-08-comprendre-les-tables-de-hachage-comment-fonctionnent-les-dictionnaires-python-en-coulisses/cover.jpg
categories:
    - python
authors:
    - quaxzse
---

Comprendre le fonctionnement interne des structures de données fondamentales de Python peut considérablement améliorer notre manière d’écrire et d’optimiser du code.
Aujourd’hui, nous plongeons au cœur des tables de hachage – en particulier, la manière dont les dictionnaires Python sont implémentés et pourquoi ils sont si efficaces.

## Qu’est-ce qu’une table de hachage ?
Ces structures de données puissantes permettent d’accéder, d’insérer et de supprimer des éléments en temps constant : O(1).

Une table de hachage (ou hash map, appelée dictionnaire en Python) est une structure de données abstraite qui stocke une collection de paires clé-valeur, où chaque clé est associée à une valeur spécifique.
Par exemple, en Python :

```python
fruits = {'apple': 5, 'banana': 6}
```
Ici, les clés 'apple' et 'banana' sont associées respectivement aux valeurs 5 et 6.

## Comment fonctionnent les tables de hachage
Voyons les éléments fondamentaux qui rendent les tables de hachage si efficaces :

### La fonction de hachage
Une fonction de hachage convertit la clé en un entier qui sera utilisé comme index dans un tableau (array). Les hash maps sont généralement implémentées sous forme de tableaux.

Python utilise une fonction de hachage sophistiquée dont le principe est similaire à ces méthodes classiques :

**Méthode de division (hachage modulo)**
L’une des méthodes les plus simples : la clé est divisée par un nombre premier, et le reste est utilisé comme index.
La formule est h(k) = k mod m où k est la clé et m est la taille de la table (souvent un nombre premier).

**Méthode multiplicative**
La fonction multiplie la clé par une constante A, prend la partie fractionnaire, puis multiplie le résultat par la taille de la table.
La formule est h(k) = ⌊m(kA mod 1)⌋ où A est une constante réelle non entière (souvent le nombre d’or, comme le recommande Donald Knuth) et m est la taille de la table.

En Python, la fonction de hachage dépend du type d’objet :
```python
print(hash('apple'))  # Hachage d'une chaîne
print(hash(42))       # Hachage d'un entier
print(hash((1, 2)))   # Hachage d'un tuple

# Les objets mutables (liste, dictionnaire…) ne sont pas hachables
try:
    print(hash([1, 2, 3]))
except TypeError as e:
    print(f"Erreur : {e}")
```

### Gérer les collisions
Une collision se produit lorsque deux clés différentes ont le même index. C’est inévitable dans une table de hachage, et la façon de les gérer influence fortement les performances.

Les dictionnaires Python utilisent l’adressage ouvert (open addressing) avec une variante du sondage linéaire (linear probing).
En adressage ouvert, lorsqu’une collision survient, l’algorithme cherche un autre emplacement libre selon un schéma de sondage.

## Implémentation des dictionnaires Python
Les dictionnaires Python sont basés sur des tables de hachage.
Les tables de hachage doivent permettre la gestion des collisions, c’est-à-dire que même si deux clés distinctes possèdent la même valeur de hachage, l’implémentation doit disposer d’une stratégie pour insérer et récupérer les paires clé-valeur de manière non ambiguë.

L’implémentation de Python a évolué, avec des changements importants dans Python 3.6 :

Python 3.6 a introduit une version améliorée des dictionnaires qui utilise 20 à 25 % de mémoire en moins par rapport à Python 3.5 ou aux versions antérieures.
Cette implémentation rend également les dictionnaires plus compacts et permet une itération plus rapide.

## Organisation mémoire

Avant Python 3.6, les dictionnaires étaient implémentés avec une structure de table clairsemée (sparse table) :

L’organisation mémoire des dictionnaires dans les versions antérieures était inutilement inefficace.
Elle se composait d’une table clairsemée d’entrées de 24 octets, chacune stockant la valeur de hachage, un pointeur vers la clé et un pointeur vers la valeur.

La nouvelle implémentation, introduite à partir de Python 3.6+, est plus efficace. Les données sont désormais organisées dans une table dense, référencée par une table clairsemée d’indices.

Exemple :
```python
d = {'banana': 'yellow', 'grapes': 'green', 'apple': 'red'}
```
Avant 3.6 :
```python
entries = [
 ['--', '--', '--'],
 [-5850766811922200084, 'grapes', 'green'],
 ['--', '--', '--'],
 ...
 [2247849978273412954, 'banana', 'yellow'],
 ...
 [-2069363430498323624, 'apple', 'red']
]
```
- Une seule table pour tout stocker
- Beaucoup de cases vides
- Chaque entrée = 3 pointeurs (hachage, clé, valeur) → 24 octets
- Mémoire gaspillée + moins efficace pour le cache processeur

Depuis 3.6 :
```python
indices = [None, 1, None, None, None, 0, None, 2]
entries = [
 [2247849978273412954, 'banana', 'yellow'],
 [-5850766811922200084, 'grapes', 'green'],
 [-2069363430498323624, 'apple', 'red']
]
```
- Table d’indices : petite, contient juste des références vers la table dense
- Table dense : toutes les entrées sont stockées à la suite, sans trous
- Moins de mémoire utilisée (~ 20 à 25 % en moins)
- Parcours plus rapide car données compactes et proches en mémoire

## Gestion des collisions

Sous le capot, Python implémente les tables de hachage d’une manière totalement invisible pour le développeur.
La fonction de hachage de Python prend un objet hachable et le convertit en une valeur de hachage sur 32 ou 64 bits (selon l’architecture du système).

Lorsqu’une collision se produit, Python utilise une variante du sondage linéaire (linear probing) pour trouver la prochaine case disponible.

## Exemple d’implémentation simple
Voici une version simplifiée d’une hash map en Python :

```python
class SimpleHashMap:
    def __init__(self, size=8):
        self.size = size
        self.table = [None] * size
        self.count = 0
        self.load_factor_threshold = 2/3

    def _hash(self, key):
        return hash(key) % self.size

    def _probe(self, index):
        return (index + 1) % self.size

    def _resize(self):
        old_table = self.table
        self.size *= 2
        self.table = [None] * self.size
        self.count = 0
        for entry in old_table:
            if entry and entry != "DELETED":
                self.put(entry[0], entry[1])

    def put(self, key, value):
        if self.count >= self.size * self.load_factor_threshold:
            self._resize()
        index = self._hash(key)
        while self.table[index] and self.table[index] != "DELETED" and self.table[index][0] != key:
            index = self._probe(index)
        if not self.table[index] or self.table[index] == "DELETED":
            self.count += 1
        self.table[index] = (key, value)

    def get(self, key):
        index = self._hash(key)
        while self.table[index]:
            if self.table[index] != "DELETED" and self.table[index][0] == key:
                return self.table[index][1]
            index = self._probe(index)
            if index == self._hash(key):
                break
        return None

    def delete(self, key):
        index = self._hash(key)
        while self.table[index]:
            if self.table[index] != "DELETED" and self.table[index][0] == key:
                self.table[index] = "DELETED"
                self.count -= 1
                return
            index = self._probe(index)
            if index == self._hash(key):
                break
        raise KeyError(f"Clé '{key}' introuvable.")
```

Cette implémentation illustre :
- La fonction de hachage pour convertir les clés en indices
- La gestion des collisions par sondage linéaire
- Le redimensionnement dynamique
- La suppression avec marqueurs (tombstones)

## Optimisations réelles de Python

- Mise en page mémoire efficace (depuis 3.6, ordre d’insertion préservé)
- Fonctions de hachage robustes réduisant les collisions
- Conception adaptée au cache pour de meilleures performances
- Gestion du facteur de charge (table initiale de 8 cases)

## Performances

Les dictionnaires Python offrent d’excellentes performances :

Ils sont hautement optimisés et constituent la base de nombreuses parties du langage.
En moyenne, ils permettent d’effectuer les opérations de recherche, d’insertion, de mise à jour et de suppression en temps constant O(1).

# Quand utiliser un dictionnaire ?

- Recherches rapides par clé
- Associations uniques clé → valeur
- Comptage d’occurrences
- Mise en cache de résultats
- Données structurées de type JSON

## Limites

- Les clés doivent être hachables (types immuables)
- Surcoût mémoire pour de petits ensembles
- Pas d’ordre garanti avant Python 3.6

## Conclusion

Les tables de hachage sont au cœur des dictionnaires Python, offrant un stockage clé-valeur rapide et efficace.
Depuis Python 3.6, les dictionnaires sont plus économes en mémoire et conservent l’ordre d’insertion.
Comprendre leur fonctionnement permet de choisir les structures de données adaptées et d’apprécier le travail d’ingénierie derrière les performances des dictionnaires Python.
