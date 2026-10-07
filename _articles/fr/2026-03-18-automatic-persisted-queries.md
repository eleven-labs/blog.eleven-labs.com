---
contentType: article
lang: fr
date: 2026-03-18
slug: automatic-persisted-queries
title: "Automatic Persisted Queries: Optimiser vos requêtes sans sacrifier la flexibilité"
excerpt: Voyons comment, tout en silence, les Automatic Persisted Queries peuvent vous aider à résoudre l'un des problémes les plus discrets de vos APIs GraphQL
cover:
    alt: Automatic Persisted Queries
    path: /imgs/articles/2026-03-18-automatic-persisted-queries/cover.jpg
categories:
    - javascript
keywords:
    - graphql
    - optimisation
    - réseaux
    - flexibilité
    - api
authors:
    - iregaibi
seo:
    title: "Optimiser vos requêtes avec les Automatic Persisted Queries"
    description: Voyons comment, tout en silence, les Automatic Persisted Queries peuvent vous aider à résoudre l'un des problémes les plus discrets de vos APIs GraphQL
---
GraphQL a un problème connu de tous ses utilisateurs : les requêtes peuvent être très volumineuses. Une query avec plusieurs fragments, des variables imbriquées, des filtres, ça peut facilement peser plusieurs centaines d'octets, et ce pour chaque appel et chaque utilisateur. La bande passante peut rapidement devenir un sujet sérieux.

## La problématique

GraphQL envoie le texte complet de la query dans chaque requête HTTP — c'est le prix de sa flexibilité. Cependant, cela représente un réel coût réseau.

Prenons l'exemple d'une requête GetUser avec une variable `id` et deux sous-objets : `avatar` et `favoriteArticles`.

```graphql
query GetUser($id: ID!) {
 user(id: $id) {
  id
  name
  email
  avatar {
   url
   width
   height
  }
  favoriteArticles(limit: 5) {
   id
   status
  }
 }
}
```

Cette requête, envoyée en POST, envoie à chaque appel le texte complet de la query en clair.

Sur des appareils mobiles ou des connexions dégradées, cela peut représenter un réel problème. Plus une requête contient de champs et plus son arbre est profond, plus sa taille est grande — et plus cela a un impact sur la rapidité de l'appel réseau.

## Les Persisted Queries

Une première approche serait de mettre en place des **Persisted Queries**, des requêtes pré-enregistrées côté serveur au moment du build.
Ça permet au client d'éviter d'envoyer toute la query, et de simplement envoyer un identifiant, un hash ou bien un ID arbitraire, que le serveur fait correspondre à la query visée.

Donc au lieu de ça :
```json
{ "query": "query GetUser($id: ID!) { ... }" }
```


Le client envoie juste :
```json
{ "id": "abc123", "variables": { "id": "42" } }
```

C'est une solution qui a beaucoup d'avantages :
- **Sécurité** : le serveur ne répond favorablement qu'aux requêtes qu'il connaît
- **Poids de la requête** : seul l'identifiant est envoyé vers le serveur, donc une requête beaucoup plus légère

Mais c'est contraignant puisqu'une synchronisation entre le serveur et le front est nécessaire. Implique un développement moins rapide et une flexibilité réduite.

## Les Automatic Persisted Queries
Pour faire simple, c'est tout pareil, sans l'obligation de synchronisation, sans coordination nécessaire entre le serveur et le front.

### Comment ça fonctionne ?
#### Premier appel - On tente notre chance

Le client calcule le hash SHA-256 de la query à la volée, c'est-à-dire au moment de l'appel API, et l'envoie à la place de la query.

```json
{
 "extensions": {
  "persistedQuery": {
   "version": 1,
   "sha256Hash": "9a0c2345b1815db67d5308c9f86ea2ae04e5ce5337592d14ca5e046871d32922"
  }
 },
 "variables": { "id": "42" }
}
```

Dans le cas où le serveur ne connaît pas ce hash, une erreur est renvoyée.

```json
{
 "errors": [{ "message": "PersistedQueryNotFound" }]
}
```

#### Deuxième appel - Enregistrement de la query
Après un premier échec, le client doit envoyer le hash ainsi que le texte complet de la query. Le serveur fait donc l'association entre les deux et enregistre le tout dans son cache.
Il exécute ensuite la query et renvoie la réponse.

```json
{
 "query": "query GetUser($id: ID!) {...}",
 "extensions": {
  "persistedQuery": {
   "version": 1,
   "sha256Hash": "9a0c2345b1815db67d5308c9f86ea2ae04e5ce5337592d14ca5e046871d32922"
  }
 },
 "variables": { "id": "42" }
}
```

#### Le régime de croisière
Une fois cette première valse effectuée, **tous les appels suivants** n'envoient que le hash et le texte complet de la query n'est plus transité entre le client et le serveur, comme lors du premier appel vu plus haut.

<div class="admonition summary" markdown="1"><p  class="admonition-title">En résumé</p>

Le client commence par envoyer uniquement le hash de la query, et ce n'est qu'en cas d'échec qu'il envoie la query complète, une seule et unique fois, pour que le serveur l'enregistre et s'en souvienne.
</div>

[![](https://mermaid.ink/img/pako:eNqtUstOwzAQ_BVrryRVkpJHfeilgDghoDeUi-VsG4vEDo5dtVT9H_iO_hhO0lZFgOCAT_bszOxo11vgqkCg0OKLRcnxSrClZnUuiTsN00Zw0TBpyKwSKM1XfI56hVbncigNNH86PeCU3LK2JC3aCuuTwZ0ySNQKNflME5IrKe1AOpR8Zza4UnKttUOIT-5Rt6I1DnywqDfO70ZZWfyS4oL0bMJV3VT7N4M_ppkbxZ-RVEhKJ_Snvc4juN6_c3vUfRPwcf_eKNkikUrXrML_GUs_lK47ds1JITRyc6b7QxDwYKlFAXTBqhY9qNHB3Ru2nUcOpnSGOVB3LXDBbGVyyOXO6dyan5SqgRptnVIruyxPPrYpmDn-mhOqURaoZ24lBmgYxb0J0C2sgUZxOoqjSTKOL7M0CcKJBxugaTrKkiyJwiAaj5N0svPgtW8ajLI0Ds5OuPsAApjpQQ)](https://mermaid.live/edit#pako:eNqtUstOwzAQ_BVrryRVkpJHfeilgDghoDeUi-VsG4vEDo5dtVT9H_iO_hhO0lZFgOCAT_bszOxo11vgqkCg0OKLRcnxSrClZnUuiTsN00Zw0TBpyKwSKM1XfI56hVbncigNNH86PeCU3LK2JC3aCuuTwZ0ySNQKNflME5IrKe1AOpR8Zza4UnKttUOIT-5Rt6I1DnywqDfO70ZZWfyS4oL0bMJV3VT7N4M_ppkbxZ-RVEhKJ_Snvc4juN6_c3vUfRPwcf_eKNkikUrXrML_GUs_lK47ds1JITRyc6b7QxDwYKlFAXTBqhY9qNHB3Ru2nUcOpnSGOVB3LXDBbGVyyOXO6dyan5SqgRptnVIruyxPPrYpmDn-mhOqURaoZ24lBmgYxb0J0C2sgUZxOoqjSTKOL7M0CcKJBxugaTrKkiyJwiAaj5N0svPgtW8ajLI0Ds5OuPsAApjpQQ)

## Qu'est-ce que ça apporte ?

### Réduction de la taille des requêtes
Une fois la query persistée et enregistrée par le serveur, seul le hash de la query est envoyé dans l'appel. On peut passer d'une requête de plusieurs centaines d'octets à seulement un hash. Plus la query est longue, plus le gain est significatif.

### Compatibilité avec le cache HTTP
Avec un hash, qui sera toujours le même, pour tous les utilisateurs et quel que soit le moment de l'appel, il devient possible de transformer les requêtes POST en requêtes GET.
Les réponses peuvent facilement être mises en cache via un CDN par exemple.

### Aucune coordination nécessaire
L'avantage par rapport aux Persisted Queries est que cela ne requiert pas un enregistrement manuel dans le serveur. Les hash sont générés à la volée lors de l'appel, et cela fonctionne de façon autonome et automatique.


## Les limites des APQ
### Le premier aller-retour
Chaque nouvelle query sera requêtée deux fois, car c'est ainsi que le système fonctionne. On peut en déduire que les applications à requêtes très dynamiques ne sont pas les meilleures candidates pour la mise en place des APQ.
C'est une solution qui vise surtout les queries stables et répétées, ce qui répond à la majorité des cas.

### Sécurité du hash
Le hash identifie la query, mais il ne l'authentifie pas. Quelqu'un qui connaît un hash peut l'utiliser. Les APQ ne remplacent pas une vraie stratégie de sécurité.

### Cache
Si un cache mémoire par défaut est utilisé, un redémarrage efface les queries persistées. Pour contrer ce problème, on peut s'orienter vers un cache distribué comme Redis, partagé entre toutes les instances du serveur. Les queries persistées survivent aux redémarrages et restent disponibles en cas d'évolution.

## Conclusion
Les APQ ne révolutionnent pas GraphQL ni votre façon de coder, mais c'est une optimisation discrète qui peut rapporter gros. C'est typiquement le genre de chose qu'on met en place une fois, qu'on oublie aussitôt, et qui continue de faire son travail en silence avec des effets bien réels sur la bande passante et l'expérience utilisateur.
