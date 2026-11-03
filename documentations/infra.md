# Infrastructure et redirections

Le blog est un site statique : `pnpm prerender` génère `dist/public/`, que la CI synchronise dans un bucket S3 servi par CloudFront. Aucune configuration AWS n'est gérée par du code d'infrastructure (Terraform, CDK…). Ce document décrit ce qui a été mis en place à la main et comment le faire évoluer.

## Vue d'ensemble

| Environnement | Domaine | Environnement GitHub |
| --- | --- | --- |
| Production | `blog.eleven-labs.com` | `production` |
| Staging et PR | `blog.staging.eleven-labs.com` | un environnement par branche |

- Chaque distribution CloudFront a pour origine un bucket S3 nommé comme son domaine. Leurs identifiants ne sont volontairement pas écrits ici : ils sont dans les variables et secrets GitHub de la CI (`AWS_BUCKET_NAME`, `AWS_CLOUDFRONT_DISTRIBUTION_ID`) ou se retrouvent avec la commande ci-dessous.
- Les buckets S3 sont en **`eu-west-3`** (Paris).
- CloudFront lit le bucket par son **endpoint REST**, avec un Origin Access Control. Le bucket n'est pas public.
- Chaque pull request est déployée sur le staging sous un préfixe portant le nom de sa branche, par exemple `https://blog.staging.eleven-labs.com/feat/single-page-tutorials/`.

## Indexation : seule la production est indexée

Le staging et les environnements de PR servent des copies des pages de la production. Ils ne doivent pas être indexés, sous peine de faire concurrence à la production dans les résultats de recherche.

- **Côté build** : `IS_INDEXABLE` (`src/constants.ts`) n'est vrai que si `VITE_HOST_URL` a pour domaine `blog.eleven-labs.com`. Sinon, toutes les pages portent `<meta name="robots" content="noindex, nofollow">` : le layout (`useLayoutTemplateContainer`) comme les pages exclues de l'index en production (404, auteur, recherche), via `NOT_INDEXED_ROBOTS_CONTENT`. La CI vérifie la directive de `index.html` après le build : un déploiement de production en `noindex`, ou de staging en `index`, échoue avant d'arriver sur S3.
- **Côté CloudFront** : la distribution du staging ajoute l'en-tête `X-Robots-Tag: noindex, nofollow` à toutes ses réponses, avec la *response headers policy* `blog-staging-noindex`. L'en-tête couvre aussi ce que la meta ne couvre pas : les environnements déployés avant elle, les images, les PDF, le flux RSS, les sitemaps et la page 404.
- **Racine du staging** : aucun environnement n'y est déployé. CloudFront y répond avec sa page d'erreur, `/404.html` à la racine du bucket, qu'aucune CI ne met à jour. Pour la régénérer, construire le site pour la racine du staging, puis n'envoyer que la page et ce qu'elle charge (elle n'hydrate que l'en-tête et ne lit aucune donnée de `/data/`) :
  ```sh
  NODE_ENV=production BASE_URL=/ VITE_HOST_URL=https://blog.staging.eleven-labs.com \
    VITE_IS_DEBUG=false VITE_GTM_ID= VITE_GOOGLE_SITE_VERIFICATION= pnpm prerender
  mkdir -p /tmp/staging-root/imgs && cp -r dist/public/{404.html,assets,favicon.ico,web-app-manifest.json} /tmp/staging-root/ \
    && cp -r dist/public/imgs/icons /tmp/staging-root/imgs/
  aws s3 cp /tmp/staging-root/ s3://blog.staging.eleven-labs.com/ --recursive --profile <profil>
  aws cloudfront create-invalidation --profile <profil> --distribution-id "$DISTRIBUTION_ID" --paths "/*"
  ```
- **Ne pas** ajouter de `Disallow: /` dans un `robots.txt` du staging. Sans exploration, Google ne voit pas le `noindex`, et les URL déjà indexées le restent (« Indexée, mais bloquée par robots.txt »).

Pour la recréer (par exemple sur une nouvelle distribution) :
```sh
aws cloudfront create-response-headers-policy --profile <profil> --response-headers-policy-config '{
  "Name": "blog-staging-noindex",
  "Comment": "Keeps the staging out of the search engines",
  "CustomHeadersConfig": { "Quantity": 1, "Items": [
    { "Header": "X-Robots-Tag", "Value": "noindex, nofollow", "Override": true }
  ] }
}'
# Puis renseigner son Id dans DefaultCacheBehavior.ResponseHeadersPolicyId de la distribution du staging
# (même procédure get-distribution-config / update-distribution que l'étape 4 ci-dessous).
curl -sI https://blog.staging.eleven-labs.com/<branche>/ | grep -i x-robots-tag
```

Pour retirer rapidement de Google les URL du staging déjà indexées : dans Search Console, sur une propriété couvrant `blog.staging.eleven-labs.com` (la propriété de domaine `eleven-labs.com` suffit), outil **Suppressions** → **Supprimer toutes les URL avec ce préfixe** → `https://blog.staging.eleven-labs.com/`. La suppression dure environ six mois. Le `noindex` la rend définitive, à mesure que Google repasse sur les pages.

> ⚠️ Avec l'endpoint REST, S3 ne sert pas de page d'index et ignore les redirections S3 (`x-amz-website-redirect-location`, règles de redirection du mode « website »). Toutes les redirections passent donc par les Lambda@Edge ci-dessous.

## Lambda@Edge

Chaque distribution a les siennes, avec le runtime `nodejs20.x`.

> Contrairement aux buckets (`eu-west-3`), les Lambda@Edge sont en **`us-east-1`**. AWS l'impose pour toute fonction associée à une distribution CloudFront, qui la réplique ensuite sur ses points de présence, Paris compris. Les commandes `aws lambda` de ce document prennent donc `--region us-east-1`, et CloudFront est un service global, sans région.

| Événement | Fonction | Rôle |
| --- | --- | --- |
| `viewer-request` | `blog-<env>-viewer-request-lambda` | Redirige en 301, avec `x-robots-tag: noindex`, les accès par le domaine `*.cloudfront.net` vers le domaine du blog. |
| `origin-request` | `blog-<env>-origin-request-lambda` | Porte les redirections du site et la réécriture vers `index.html` (voir ci-dessous). |

Une CloudFront Function ne peut pas s'ajouter sur un événement déjà occupé par une Lambda@Edge. Toute nouvelle règle va donc dans l'une de ces deux fonctions.

### `origin-request` : ordre des règles

Source versionnée : [`infra/lambda-edge/origin-request/index.mjs`](../infra/lambda-edge/origin-request/index.mjs), identique pour la production et le staging.

La fonction ne s'exécute que sur un défaut de cache. Ses réponses, 301 comprises, sont mises en cache par CloudFront.

1. **Anciennes URL AMP** : `/amp/<chemin>` → 301 vers `/<chemin>`.
2. **Ancienne home de la langue par défaut** : `/fr`, `/fr/` et `/fr/index.html` → 301 vers `/`.
   - La home française est servie à la racine, seule URL indexée (#1234). `/fr/` n'est plus générée et répondait en 404 aux liens et redirections qui y pointent encore.
   - Le préfixe d'une PR est conservé (`/feat/x/fr/` → `/feat/x/`).
   - La query string serait conservée, mais les distributions ne la transmettent pas à l'origine (`ForwardedValues.QueryString: false`) : la Lambda ne la reçoit pas, et comme pour les autres redirections, elle est perdue.
   - Une branche dont le nom finit par `/fr` verrait sa home redirigée vers son préfixe parent : à éviter.
3. **Anciennes URL d'étape de tutoriel** : `/<lang>/<tutoriel>/<étape>/` → 301 vers `/<lang>/<tutoriel>/#<étape>`.
   - Depuis que chaque tutoriel tient sur une seule page (#1247), une étape est une section de la page du tutoriel, dont l'`id` est le slug de l'étape.
   - La règle est générique : seule une étape de tutoriel a une URL à trois segments sous une langue (`fr` ou `en`). Les pages `authors/` et `categories/` sont exclues, et les segments contenant un point (fichiers) ne sont pas concernés. Aucune liste de tutoriels n'est à tenir à jour.
   - Le préfixe d'une PR est conservé : `/feat/x/fr/<tutoriel>/<étape>/` → `/feat/x/fr/<tutoriel>/#<étape>`.
4. **Fichiers** (URI avec extension) : transmis tels quels à S3.
5. **Slash final manquant** : 301 vers la même URL suivie de `/`.
6. **Réécriture** : `/<chemin>/` → `/<chemin>/index.html`.

> Une nouvelle route à trois segments sous une langue (par exemple `/fr/tags/<tag>/`) serait redirigée par la règle 3 : il faut alors l'ajouter à l'exclusion `(?!authors\/|categories\/)`.

### Filet de sécurité côté build

Pour `/fr/` et pour chaque ancienne URL d'étape, le prérendu génère aussi une page `index.html` (`src/helpers/prerenderHelper/generateRedirectFiles.ts`). Elle contient un `meta refresh` immédiat, un `location.replace` et une canonique vers la cible (la racine, ou le tutoriel). Elle n'est servie que si la Lambda ne redirige pas, par exemple lors d'un rollback de la fonction.

En local, `pnpm start:dev` répond aussi par une 301 (`src/middlewares/defaultLanguageHomeRedirectMiddleware.ts` et `src/middlewares/tutorialStepRedirectMiddleware.ts`).

## Modifier une Lambda@Edge

Prérequis : AWS CLI configurée avec un utilisateur autorisé sur Lambda (`us-east-1`) et CloudFront. Dans les exemples, le profil s'appelle `<profil>`, l'environnement est le staging et `<n>` est le numéro de version publiée.

Retrouver l'identifiant de la distribution à partir de son domaine :
```sh
DISTRIBUTION_ID=$(aws cloudfront list-distributions --profile <profil> \
  --query "DistributionList.Items[?contains(Aliases.Items, 'blog.staging.eleven-labs.com')].Id" --output text)
```

1. Modifier `infra/lambda-edge/origin-request/index.mjs` et le faire relire dans une PR.
2. Vérifier que `$LATEST` ne contient pas de changements non publiés : son `CodeSha256` doit être celui de la version en service.
   ```sh
   aws lambda get-function-configuration --profile <profil> --region us-east-1 \
     --function-name blog-staging-origin-request-lambda --query CodeSha256
   ```
3. Envoyer le code et publier une version :
   ```sh
   (cd infra/lambda-edge/origin-request && zip -q /tmp/origin-request.zip index.mjs)
   aws lambda update-function-code --profile <profil> --region us-east-1 \
     --function-name blog-staging-origin-request-lambda --zip-file fileb:///tmp/origin-request.zip
   aws lambda wait function-updated --profile <profil> --region us-east-1 \
     --function-name blog-staging-origin-request-lambda
   aws lambda publish-version --profile <profil> --region us-east-1 \
     --function-name blog-staging-origin-request-lambda --description "<raison>"
   ```
4. Associer la nouvelle version à la distribution. Seul l'ARN versionné change dans la configuration :
   ```sh
   aws cloudfront get-distribution-config --profile <profil> --id "$DISTRIBUTION_ID" > /tmp/dist.json
   ETAG=$(jq -r .ETag /tmp/dist.json)
   jq .DistributionConfig /tmp/dist.json \
     | sed 's/blog-staging-origin-request-lambda:<ancienne>/blog-staging-origin-request-lambda:<n>/' > /tmp/dist-config.json
   aws cloudfront update-distribution --profile <profil> --id "$DISTRIBUTION_ID" \
     --if-match "$ETAG" --distribution-config file:///tmp/dist-config.json
   aws cloudfront wait distribution-deployed --profile <profil> --id "$DISTRIBUTION_ID"
   ```
5. Invalider le cache, puis vérifier :
   ```sh
   aws cloudfront create-invalidation --profile <profil> --distribution-id "$DISTRIBUTION_ID" --paths "/*"
   curl -sI https://blog.staging.eleven-labs.com/fr/symfony-clean-architecture/presentation-projet/
   # HTTP/2 301
   # location: https://blog.staging.eleven-labs.com/fr/symfony-clean-architecture/#presentation-projet
   ```
6. Une fois le staging validé, refaire les étapes 2 à 5 pour la production, avec `blog-prod-origin-request-lambda` et la distribution du domaine `blog.eleven-labs.com`.

**Rollback** : refaire l'étape 4 avec l'ARN de la version précédente, qui reste publiée.

## Historique des versions

| Date | Environnement | Fonction : version | Changement |
| --- | --- | --- | --- |
| 2024-10-28 | staging | `blog-staging-origin-request-lambda:5` | Redirections AMP, slash final, réécriture `index.html`. |
| — | production | `blog-prod-origin-request-lambda:3` | Idem. |
| 2026-09-23 | staging | `blog-staging-origin-request-lambda:6` | Redirection des anciennes URL d'étape de tutoriel (#1247). |
| 2026-09-23 | production | `blog-prod-origin-request-lambda:4` | Idem, déployée après le merge de #1256. Le cache des tutoriels (`/fr/<tutoriel>/*`) a été invalidé. |
| 2026-11-03 | staging | `blog-staging-origin-request-lambda:7` | Redirection de l'ancienne home `/fr/` vers `/` (#1266). |
| 2026-11-03 | production | `blog-prod-origin-request-lambda:5` | Idem. Le cache de `/fr`, `/fr/` et `/fr/index.html` a été invalidé. |

La version en service de chaque environnement est la dernière de ce tableau. Pour revenir en arrière, il suffit de réassocier la version précédente, qui reste publiée (voir **Rollback**).
