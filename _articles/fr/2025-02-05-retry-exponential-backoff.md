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
import math
import time

def retry_with_backoff():
    print("Démarrage des nouvelles tentatives")
    for retry_count in range(0, 5):
        wait_seconds = math.exp(retry_count)
        print(f"Tentative {retry_count}, attendre {wait_seconds} secondes")
        time.sleep(wait_seconds)
    print("Fin")
```

Cela donne

```shell
Démarrage des nouvelles tentatives
Tentative 0, attendre 1.0 secondes
Tentative 1, attendre 2.718281828459045 secondes
Tentative 2, attendre 7.38905609893065 secondes
Tentative 3, attendre 20.085536923187668 secondes
Tentative 4, attendre 54.598150033144236 secondes
Fin
```

Ensuite, modifions cette fonction pour qu'elle accepte n'importe quelle fonction. Pour que la fonction effectue une nouvelle tentative, il faut que la fonction appelé lève une exception.

```python
import math
import time
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger()


class UnavailableException(Exception):
    pass


def retry_with_backoff(fn, fn_args: dict, max_retry: int = 5):
    for retry_count in range(0, max_retry + 1):
        try:
            return fn(**fn_args)
        except UnavailableException:
            if retry_count == max_retry:
                logger.error("Limite de réessaye atteinte. Exception levé.")
                raise
            wait_seconds = math.exp(retry_count)
            logger.warning(
                f"Nouvelle tentative {retry_count} dans {wait_seconds} secondes"
            )
            time.sleep(wait_seconds)


if __name__ == "__main__":
    def my_func():
        raise UnavailableException()

    retry_with_backoff(my_func, {}, 2)
```

Cela donne

```shell
WARNING:root:Nouvelle tentative 0 dans 1.0 secondes
WARNING:root:Nouvelle tentative 1 dans 2.718281828459045 secondes
ERROR:root:Limite de réessaye atteinte. Exception levé.
Traceback (most recent call last):
  File "demo.py", line 33, in <module>
    retry_with_backoff(my_func, {}, 2)
  File "demo.py", line 16, in retry_with_backoff
    return fn(**fn_args)
           ^^^^^^^^^^^^^
  File "demo.py", line 30, in my_func
    raise UnavailableException()
UnavailableException

Process finished with exit code 1
```
