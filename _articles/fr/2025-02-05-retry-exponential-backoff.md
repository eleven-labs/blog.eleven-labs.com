---
contentType: article
lang: fr
date: 2025-02-05
slug: retry-exponential-backoff
title: Recommencer une fonction avec un recul exponentiel
excerpt: Il arrive qu'une fonction ou action ne puisse pas être réalisé a un instant donnée. Cela peut être dû à plusieurs facteur qui ne sont pas maîtrisé. Il est alors possible d'effectuer une nouvelle tentative plus tard. Dans cet article, voyons comment le faire.
categories:
    - architecture
keywords: []
authors:
  - tthuon
seo:
  title: Recommencer une fonction avec un recul exponentiel
  description: Il arrive qu'une fonction ou action ne puisse pas être réalisé a un instant donnée. Il est alors possible d'effectuer une nouvelle tentative plus tard.
---

Il arrive qu'une fonction ou action ne puisse pas être réalisé a un instant donnée. Cela peut être dû à plusieurs facteur qui ne sont pas maîtrisé. Il est alors possible d'effectuer une nouvelle tentative plus tard. Cependant, réessayer toutes les x secondes n'est pas souhaitable car il est possible que l'action appelé ne soit pas encore disponible. On veut alors donner plus de temps à chaque tentative, on défini alors un délai d'attente qui augmente de façon exponentielle.

Sans rentrer dans les détails mathématique, soit _x_ la tentative en cours, alors nous avons _e<sup>x</sup>_ le nombre de secondes à attendre avant la prochaine tentative.

Pour être plus concrêt, si un appel HTTP renvoi un code de status 500, alors on vaudrait retenter de nouveau bien plus tard.

En Python, cela se traduit par le code suivant

```python
import time

def _retry_with_backoff():
  for retry_count in range(0, 5):
    response = requests.get("https://blog.eleven-labs.com")
    if response.status_code.ok:
      return response

    time.sleep(2**retry_count)
```
