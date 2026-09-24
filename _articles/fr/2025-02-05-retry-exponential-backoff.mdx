---
contentType: article
lang: fr
date: 2025-02-05
slug: retry-exponential-backoff
title: Recommencer une fonction avec un recul exponentiel
excerpt: Il arrive qu'une fonction ou action ne puisse pas être réalisée à un instant donné. Cela peut être dû à plusieurs facteurs qui ne sont pas maîtrisés. Il est alors possible d'effectuer une nouvelle tentative plus tard. Dans cet article, voyons comment le faire.
categories:
    - architecture
keywords:
    - python
cover:
    alt: "Comment recommencer une fonction avec un recul exponentiel ?"
    path: /imgs/articles/2025-02-05-retry-exponential-backoff/cover.jpg
authors:
    - tthuon
seo:
    title: "Nouvelles tentatives et backoff exponentiel : méthode"
    description: Découvrez la méthode de notre expert pour recommencer une fonction avec un recul exponentiel sans s'acharner.
---

Il arrive qu'une fonction ou action ne puisse pas être réalisée a un instant donné. Cela peut être dû à plusieurs facteurs qui ne sont pas maîtrisés. Il est alors possible d'effectuer une nouvelle tentative plus tard. Cependant, réessayer toutes les x secondes n'est pas souhaitable car il est possible que l'action appelée ne soit pas encore disponible. On veut alors donner plus de temps à chaque tentative, on définit alors un délai d'attente qui augmente de façon exponentielle (en anglais: _retries with exponential backoff_).

Sans rentrer dans les détails mathématiques, soit _x_ la tentative en cours, alors nous avons _e<sup>x</sup>_ le nombre de secondes à attendre avant la prochaine tentative. _e_ étant [le nombre d'Euler](https://www.nagwa.com/fr/explainers/656149079142/) élevé à la puissance _x_. Par simplification, le nombre d'Euler peut valoir environ ~2.718281. 

Python permet d'effectuer ce calcul via la bibliothèque standard `math` avec la fonction [`exp()`](https://docs.python.org/3/library/math.html#math.exp).

Ecrivons la fonction de base qui permet d'attendre _e<sup>x</sup>_ secondes. Cette fonction peut s'écrire de façon procédurale ou récursive. Nous allons opter pour une fonction récursive. Il faudra définir une condition d'arrêt : quand le nombre de tentatives atteint le nombre maximal de tentatives attendues.

```python
import math
import time

def retry_with_backoff(count_retry: int = 0, max_retry: int = 5):
    if count_retry >= max_retry:
        print("Limite de réessaye atteint")
        return

    wait_seconds = math.exp(count_retry)
    print(f"Tentative {count_retry}, attendre {wait_seconds:.4f} secondes")
    time.sleep(wait_seconds)

    return retry_with_backoff(count_retry + 1, max_retry)
```

Cela donne

```shell
Tentative 0, attendre 1.0000 secondes
Tentative 1, attendre 2.7183 secondes
Tentative 2, attendre 7.3891 secondes
Tentative 3, attendre 20.0855 secondes
Tentative 4, attendre 54.5982 secondes
Limite de réessaye atteint
```

Ensuite, modifions cette fonction pour qu'elle accepte n'importe quelle fonction. Pour que la fonction effectue une nouvelle tentative, il faut que la fonction appelée lève une exception. Nous allons également ajouter un `logger` pour surveiller les tentatives. Enfin, dans le cas où le nombre de tentatives maximales a été atteint, alors il faut lever une exception dédiée `MaxRetryReachedException` afin que les couches supérieures de l'application soient notifiées.

```python
import math
import time
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger()


class UnavailableException(Exception):
    pass


class MaxRetryReachedException(Exception):
    pass


def retry_with_backoff(fn, fn_args: dict, count_retry: int = 0, max_retry: int = 5):
    try:
        return fn(**fn_args)
    except UnavailableException as exc:
        if count_retry >= max_retry:
            print("Limite de réessaye atteint")
            raise MaxRetryReachedException from exc

        wait_seconds = math.exp(count_retry)
        print(
            f"Tentative {count_retry} échoué, attendre {wait_seconds:.4f} secondes pour la prochaine tentative."
        )
        time.sleep(wait_seconds)

    return retry_with_backoff(fn, fn_args, count_retry + 1, max_retry)


if __name__ == "__main__":

    def my_func():
        raise UnavailableException()

    retry_with_backoff(my_func, {}, max_retry=2)

```

Cela donne

```shell
#python3 demo.py 
WARNING:root:Tentative 0 échoué, attendre 1.0000 secondes pour la prochaine tentative.
WARNING:root:Tentative 1 échoué, attendre 2.7183 secondes pour la prochaine tentative.
ERROR:root:Limite de réessaye atteint
Traceback (most recent call last):
  File "demo.py", line 19, in retry_with_backoff
    return fn(**fn_args)
           ^^^^^^^^^^^^^
  File "demo.py", line 37, in my_func
    raise UnavailableException()
UnavailableException

The above exception was the direct cause of the following exception:

Traceback (most recent call last):
  File "demo.py", line 39, in <module>
    retry_with_backoff(my_func, {}, max_retry=2)
  File "demo.py", line 31, in retry_with_backoff
    return retry_with_backoff(fn, fn_args, count_retry + 1, max_retry)
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "demo.py", line 31, in retry_with_backoff
    return retry_with_backoff(fn, fn_args, count_retry + 1, max_retry)
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "demo.py", line 23, in retry_with_backoff
    raise MaxRetryReachedException from exc
MaxRetryReachedException

Process finished with exit code 1
```

Dans nos logs, nous avons bien nos deux warnings, ainsi que le log error lorsque la limite a été atteinte. Vous noterez que la trace d'erreur est détaillée. Le fait d'ajouter `from exc` à `raise MaxRetryReachedException` permet de faire une liaison de cause à effet. Cela est indiqué par le message suivant `The above exception was the direct cause of the following exception`. L'avantage est qu'il permet de déboguer plus facilement l'application.

Ajoutons un test unitaire avec PyTest pour s'assurer du fonctionnement.

```python
import logging
import pytest


def test_retry_with_backoff(caplog):
    def write_failed():
        raise UnavailableException()

    with pytest.raises(MaxRetryReachedException):
        retry_with_backoff(write_failed, {}, max_retry=2)

    assert len(caplog.records) == 3
    assert caplog.record_tuples[0][1] == logging.WARNING
    assert (
        "Tentative 0 échoué, attendre 1.0000 secondes pour la prochaine tentative."
        in caplog.record_tuples[0][2]
    )
    assert caplog.record_tuples[1][1] == logging.WARNING
    assert (
        "Tentative 1 échoué, attendre 2.7183 secondes pour la prochaine tentative."
        in caplog.record_tuples[1][2]
    )
    assert caplog.record_tuples[2][1] == logging.ERROR
    assert "Limite de réessaye atteint" in caplog.record_tuples[2][2]


def test_retry_with_backoff_success(caplog):
    def write_failed():
        return "ok"

    assert len(caplog.records) == 0
    assert retry_with_backoff(write_failed, {}, max_retry=2) == "ok"
```

Résultat,

```shell
============================= test session starts ==============================
collecting ... collected 2 items

demo.py::test_retry_with_backoff PASSED                                  [ 50%]
demo.py::test_retry_with_backoff_success PASSED                          [100%]

======================== 2 passed, 2 warnings in 3.73s =========================
```

Vous avec désormais une fonction qui permet de rééssayer une action avec un temps d'attente exponentiel. Ce mécanisme est généralement présent dans les bibliothèques qui permettent de faire des appels à des ressources externes non maitrisés.

