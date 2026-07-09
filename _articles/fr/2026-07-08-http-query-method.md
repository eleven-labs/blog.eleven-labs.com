---
contentType: article
lang: fr
date: 2026-07-08
slug: http-query-method
title: "Nouveau verbe HTTP : QUERY"
excerpt: "Vous étiez coincé pour vos recherches volumineuses entre un GET à rallonge ou détourner le POST dans vos APIs, QUERY est là pour répondre à ce besoin"
cover:
    alt: "Nouveau verbe HTTP : QUERY"
    path: /imgs/articles/2026-07-08-http-query-method/cover.jpg
    position: center
categories:
    - architecture
keywords:
    - api
    - http
authors:
    - marianne
seo:
    title: "Nouveau verbe HTTP : QUERY"
    description: "Vous étiez coincé pour vos recherches volumineuses entre un GET à rallonge ou détourner le POST dans vos APIs, QUERY est là pour répondre à ce besoin"
---

Depuis le 15 juin 2026, la [RFC 10008: The HTTP QUERY Method](https://www.rfc-editor.org/info/rfc10008/) est en *"Proposed Standard"* après [plus de 10 ans en draft](https://datatracker.ietf.org/doc/rfc10008/). Ce nouveau verbe HTTP va permettre de régler un souci régulier dans nos APIs : gérer les requêtes GET avec beaucoup de paramètres de filtrage.

## Historique d'une problématique

Dans de nombreux projets web, nous avons toujours des listes : produits, utilisateurs, articles, factures, etc. Quand cette liste est longue, nous avons envie d'y faire des recherches pour filtrer et d'y mettre une pagination.

Mais malheureusement, avec le verbe GET, nous n'avons parfois pas le choix d'avoir des URLs à rallonge.

```bash
?colors=Bleu&clothingSizes=FR+38&minPrice=16224&maxPrice=59945&sort=price_asc
```

Pour gagner en visibilité et en praticité (car il peut y avoir des règles sur le nombre de caractères que peut comporter une URL), il arrive de voir des routes de listing en GET transformées en POST. Or, ce verbe, également défini dans une [RFC](https://datatracker.ietf.org/doc/html/rfc7231#section-4.3.3), a cette définition chez [Mozilla - MDN Web Docs](https://developer.mozilla.org/fr/docs/Web/HTTP/Reference/Methods) :

> La méthode POST soumet une entité à la ressource spécifiée, provoquant souvent un changement d'état ou des effets secondaires sur le serveur.

Bref, on tord POST pour nos besoins.

## Comment utiliser QUERY ?

### Mini projet pour tester

Grâce à l'IA, j'ai pu créer rapidement un [mini projet](https://github.com/ElevenMarianne/my-little-api-query) pour tester le nouveau verbe HTTP (évidemment en PHP). Il s'agit d'une API permettant d'accéder à une liste de timbres. Elle possède des filtres tels qu'une fourchette d'années, le pays, le prix ou encore la couleur.

Symfony a déjà intégré le verbe QUERY dès sa [version 7.4](https://github.com/symfony/http-foundation/releases/tag/v7.4.0-BETA1), alors que la méthode n'était encore qu'un *Internet-Draft IETF* pour la release d'octobre 2025.

### Exemples d'utilisation

#### Filtre par pays et pagination

##### Request

```bash
curl -si -X QUERY 'http://localhost:8090/api/stamps' \
--header 'Content-Type: application/json' \
--data '{"countries":["France","Belgium"],"page":1,"limit":10}'
```

Comme vous pouvez le voir, dans l'appel curl, il suffit d'indiquer -X QUERY (-X permettant de spécifier le verbe HTTP avec GET par défaut).

Pour la déclaration des paramètres, c'est comme pour le POST : dans le --data/-d.

La prise en main de QUERY est facile.

Étudions la réponse.

##### Response headers

```bash
HTTP/1.1 200 OK
Server: nginx/1.27.5
Content-Type: application/json
Transfer-Encoding: chunked
Connection: keep-alive
X-Powered-By: PHP/8.4.23
Cache-Control: no-cache, private
Date: Wed, 08 Jul 2026 21:03:10 GMT
X-Cache: MISS
X-Robots-Tag: noindex
```

Vous pouvez voir ici que le header *X-Cache* est *MISS* car c'est la première fois que j'appelle la route avec ce filtre. Si j'appelle avec le même filtre dans les 60s, le header *X-Cache* sera *HIT*.

```php
[$result, $fromCache] = $cache->getOrCompute($request, $criteria);

$response = new JsonResponse($result);
$response->headers->set('X-Cache', $fromCache ? 'HIT' : 'MISS');
```

##### Response body
```json
{
   "items":[
      {
         "id":503,
         "name":"Chemin de fer touristique",
         "country":"Belgium",
         "year":1857,
         "price":212.69,
         "color":"green",
         "description":null
      },
      {
         "id":415,
         "name":"Locomotive \u00e0 vapeur",
         "country":"France",
         "year":1871,
         "price":343.35,
         "color":"green",
         "description":"Timbre autocollant \u00e9mis pour le carnet du centenaire."
      },
      [...]
   ],
   "pagination":{
      "page":1,
      "limit":10,
      "total":20,
      "pages":2
   }
}
```

#### Filtre par année minimum, maximum, pays, couleur et pagination

Passons un exemple plus complexe.

En passant par le GET, nous aurions eu une URL suivante :
```
http://localhost:8090/api/stamps?yearMin=1950&yearMax=2000&countries=France&countries=Belgium&color=black&page=1&limit=2
```

Mais grâce à QUERY, nous pouvons faire ceci :

```bash
curl -i -X QUERY http://localhost:8090/api/stamps \
  -H "Content-Type: application/json" \
  -d '{"yearMin":1950,"yearMax":2000,"countries":["France","Belgium"],"color":"black","page":1,"limit":2}'
```

```json
{
   "items":[
      {
         "id":483,
         "name":"Mus\u00e9e du Louvre",
         "country":"France",
         "year":1952,
         "price":450.16,
         "color":"black",
         "description":null
      },
      {
         "id":508,
         "name":"Phare breton",
         "country":"Belgium",
         "year":1957,
         "price":329.26,
         "color":"black",
         "description":null
      }
   ],
   "pagination":{
      "page":1,
      "limit":2,
      "total":4,
      "pages":2
   }
}
```

### Le cache

Dans la classe [StampQueryCacheService](https://github.com/ElevenMarianne/my-little-api-query/blob/master/src/Service/StampQueryCacheService.php), la clé du cache est construite avec :
- la méthode (QUERY)
- le chemin (/api/stamps)
- le Content-Type
- le body de la requête, canonicalisé (*ksortRecursive($body)* trie récursivement les clés du JSON pour que *{"color":"blue","page":1} et {"page":1,"color":"blue"}* donnent la même clé malgré l'ordre différent)

Le tout est haché en SHA-256 pour former la clé finale (stamps_query_*\<hash\>*).

Cela permet de retrouver le même contenu dans le cache, avec les mêmes filtres.

```php
/**
 * @return array{0: array, 1: bool}
 */
public function getOrCompute(Request $request, StampSearchCriteria $criteria): array
{
    $key = $this->buildCacheKey($request);
    $item = $this->pool->getItem($key);
    $fromCache = $item->isHit();

    if (!$fromCache) {
        $item->set($this->computeResult($criteria));
        $this->pool->save($item);
    }

    return [$item->get(), $fromCache];
}

private function buildCacheKey(Request $request): string
{
    $body = json_decode($request->getContent(), true) ?? [];
    $this->ksortRecursive($body);

    $payload = [
        'method' => $request->getMethod(),
        'path' => $request->getPathInfo(),
        'contentType' => $request->headers->get('Content-Type'),
        'body' => $body,
    ];

    return 'stamps_query_' . hash('sha256', (string) json_encode($payload));
}
```
*Cette solution m'a été proposée par mon ami Claude.*

## Conclusion

Maintenant que ce verbe est en *"Proposed Standard"*, il n'y a plus qu'à espérer que l'infra soit rapidement mise à jour (s'il y avait des restrictions) pour pouvoir l'utiliser. Il est déjà possible de saisir le verbe HTTP qu'on veut dans Postman si vous souhaitez tester.

![Screenshot Postman avec QUERY]({BASE_URL}/imgs/articles/2026-07-08-http-query-method/postman-verbe-query.png)

## Sources
- [RFC Editor](https://www.rfc-editor.org/info/rfc10008/)
- [DataTracker](https://datatracker.ietf.org/doc/rfc10008/)
- Repository du projet [ElevenMarianne/my-little-api-query](https://github.com/ElevenMarianne/my-little-api-query)
