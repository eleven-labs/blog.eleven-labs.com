---
contentType: tutorial-step
tutorial: api-versioning-et-retrocompatibilite-avec-symfony
slug: configuration-des-fichiers-de-changement-par-version
title: Configuration des fichiers de changement par version
---

Nous allons donc avoir besoin de spécifier les changements de retrocompatibilité à appliquer lorsqu'une version précédente est demandée.

Il nous faut implémenter une liste des versions dans la configuration de Symfony avec, pour chaque version, le namespace complet du fichier qui contient les versions à appliquer.

### Spécifions les versions retrocompatibles

Editez le fichier `app/config/parameters.yml` de votre projet (ou `config/services.yaml` sous Symfony 4) et ajoutez l'entrée suivante, sous `parameters` :

```yaml
parameters:
    versions:
        1.1.0: Acme\VersionChanges\VersionChanges110
        1.0.0: Acme\VersionChanges\VersionChanges100
        0.9.0: Acme\VersionChanges\VersionChanges009
        0.8.0: Acme\VersionChanges\VersionChanges008
```

Nous spécifions une liste de la version la plus récente à la plus ancienne.

> **Note** : La version actuelle (1.2.0) n'apparaît pas dans cette liste, car il s'agit ici uniquement de la liste des versions sur lesquelles nous souhaitons appliquer une retrocompatibilité.

Les changements de retrocompatibilité seront alors appliqués dans ce même ordre.

Ainsi, dans le cas ou un client ajoute un header `X-Accept-Version: 0.9.0` dans ses requêtes, les changements de retrocompatibilité des versions seront joués respectivement dans l'ordre `1.1.0`, `1.0.0` puis `0.9.0`.

La version `0.8.0` ne devra pas être jouée, car elle correspond à un modèle encore plus ancien que celui demandé.

### Prochaine étape

Cette configuration doit ensuite être interprêtée par Symfony, et les changements nécessaires appliqués à la réponse de votre API en fonction de la version demandée.
