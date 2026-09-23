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
2. **Anciennes URL d'étape de tutoriel** : `/<lang>/<tutoriel>/<étape>/` → 301 vers `/<lang>/<tutoriel>/#<étape>`.
   - Depuis que chaque tutoriel tient sur une seule page (#1247), une étape est une section de la page du tutoriel, dont l'`id` est le slug de l'étape.
   - La règle est générique : seule une étape de tutoriel a une URL à trois segments sous une langue (`fr` ou `en`). Les pages `authors/` et `categories/` sont exclues, et les segments contenant un point (fichiers) ne sont pas concernés. Aucune liste de tutoriels n'est à tenir à jour.
   - Le préfixe d'une PR est conservé : `/feat/x/fr/<tutoriel>/<étape>/` → `/feat/x/fr/<tutoriel>/#<étape>`.
3. **Fichiers** (URI avec extension) : transmis tels quels à S3.
4. **Slash final manquant** : 301 vers la même URL suivie de `/`.
5. **Réécriture** : `/<chemin>/` → `/<chemin>/index.html`.

> Une nouvelle route à trois segments sous une langue (par exemple `/fr/tags/<tag>/`) serait redirigée par la règle 2 : il faut alors l'ajouter à l'exclusion `(?!authors\/|categories\/)`.

### Filet de sécurité côté build

Pour chaque ancienne URL d'étape, le prérendu génère aussi une page `index.html` (`src/helpers/prerenderHelper/generateRedirectFiles.ts`). Elle contient un `meta refresh` immédiat, un `location.replace` et une canonique vers le tutoriel. Elle n'est servie que si la Lambda ne redirige pas, par exemple lors d'un rollback de la fonction.

En local, `pnpm start:dev` répond aussi par une 301 (`src/middlewares/tutorialStepRedirectMiddleware.ts`).

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
