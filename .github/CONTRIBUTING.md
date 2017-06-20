CREATION D'UNE ISSUE
---------------------------------
Un template de l'issue est déjà prêt lors de la création de cette dernière.
Il faut alors expliquer le besoin fonctionnel de votre issue ainsi que la façon de valider le développement.

Si votre issue permet la correction d'un bug, il faut ajouter le label `fix` à votre issue.
Si votre issue permet de mettre en place une nouvelle fonctionnalité , il faut ajouter le label `feat`à votre issue.

Si vous ne pouvez pas remplir la partie spécification technique, il faut ajouter le label `to be specified`.
Une fois le cadrage technique validé l'issue devra être complétée, elle est alors validée et envoyée dans dans le projet suivant https://github.com/orgs/eleven-labs/projects/1.

------------------------------------------------------------
DEVELOPPER UNE ISSUE
------------------------------

Si vous souhaitez développer une issue, rien de plus simple allez sur l'url suivante https://github.com/orgs/eleven-labs/projects/1 et déplace l'issue dans `Doing`.
Vous pouvez ensuite développer, une fois le développement terminer vous devez faire une pull request.

** ATTENTION** le naming de votre branche est important.
Pour un `fix` la branche doit se nommer.
```sh
git checkout -b fix/NUMERO-D-ISSUE-TITRE
```

Ensuite faites votre pull request avec les labels `fix`et `to be validated` .

Pour un `feat` la branche doit se nommer.
```sh
git checkout -b feat/NUMERO-D-ISSUE-TITRE
```

Ensuite faite votre pull request avec les labels `feat`et `to be validated` .

Il faut ensuite déplacer votre issue dans le projet https://github.com/orgs/eleven-labs/projects/1 dans la colonne `Review`.

----------------------------------------
CODE REVIEW
-------------------
Tout le monde peut faire des codes review, la pull request doit être validé par minimum deux personnes.
Après la seconde code review valide, il faut mettre le label `mergeable`.

La pull request sera ensuite mergé par un admin et mise en production.
