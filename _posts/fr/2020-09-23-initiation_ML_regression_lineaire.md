---
layout: post
title: "Initiation au Machine Learning - La Regréssion Linéaire"
excerpt: "Il existe plusieurs types de machine learning, comme l'apprentissage supervisé, l'apprentissage non-supervisé et l'apprentissage semi-supervisé. Chacun utilise des techniques différentes pour établir une prédiction, mais le choix d'une méthode dépendra surtout du format de la donnée. Aujourd'hui nous nous attarderons seulement sur l'apprentissage supervisé et sur un modèle en particulier: la Régression Linéaire."
lang: fr
permalink: /fr/initiation-machine-learning-regression-lineaire/
authors:
    - HugoDurand
date: '2020-09-23 10:42:47 +0100'
date_gmt: '2017-09-23 09:42:47 +0100'
---

Premièrement, prenons quelques instants pour faire une brève introduction sur ce qu'est le machine learning.

Partons de la définition de <a href="https://fr.wikipedia.org/wiki/Arthur_Samuel">Arthur Samuel</a> : "Field of study that gives computers the ability to learn without being explicitly programmed".

Traduction (by Google) : "Domaine d'études qui donne aux ordinateurs la possibilité d'apprendre sans être explicitement programmé"

En effet le machine learning, faisant partie du concept plus large d'intelligence artificielle, consiste à créer des algorithmes "auto-apprenants" en se basant sur de la donnée, ou une expérience.

Prenons les deux schémas ci-dessous :

![]({{ site.baseurl }}/assets/2020-09-23-initiation_ML_regression_lineaire/schema-process.png" alt="SCHEMA-PROCESS" width="800">

Un algorithme répond le plus souvent à une problématique grâce à une suite d'instructions/règles qu'on lui donne.
Le machine learning définit donc la capacité d'une machine à répondre à une problématique sans qu'on ne définisse les règles.
Le résultat sera une prédiction obtenue grâce à un modèle basé sur des données et qui aura aussi la capacité de s'améliorer avec l'expérience.

Comme l'a défini <a href="https://fr.wikipedia.org/wiki/Tom_M._Mitchell">Tom Mitchell</a> : "A computer program is said to learn from experience E with respect to some task T and some performance measure P, if its performance on T, as measured by P, improves with experience E."

Traduction : " Un programme informatique est censé apprendre d'une expérience E par rapport à une tâche T et une certaine mesure de performance P, si ses performances sur T, mesurées par P, s'améliorent avec expérience E."

<br/>

Partant de cette introduction, il existe plusieurs types de machine learning comme l'apprentissage supervisé, l'apprentissage non-supervisé et l'apprentissage semi-supervisé.

Chacun utilise des techniques différentes pour établir une prédiction, mais le choix d'une méthode dépendra surtout du format de la donnée.

Aujourd'hui, dans le cadre de cette initiation, nous nous attarderons seulement sur l'apprentissage supervisé et sur un modèle en particulier : la Régression Linéaire.

On parle d'apprentissage supervisé lorsque la donnée utilisée est labellisée.
Les variables de sorties, c'est à dire les réponses possibles, sont déjà définies et l'algorithme apportera "la bonne réponse".
Le but est de trouver une fonction qui fait le lien entre les variables d'entrée X et la variable à prédire Y tel que Y = f(X)

On appelle cela un modèle de prédiction.

La variable de sortie Y peut être de deux types, continue ou discrète.
Discrète, c'est à dire une valeur finie que l'on peut énumérer (1,2,3, Vrai, Faux).
Continue, c'est à dire qui prend n'importe quelle valeur qui est définie dans un intervalle (entre 0 et 300 secondes ou entre 10 et 20 euros, etc.).
La prédiction de variables continues concerne le plus souvent les modèles de régression, par exemple pour prédire le prix d'une maison, le poids d'un humain, la taille, etc. Pour les variables discrètes, elles relèvent plus de la classification, qui est un autre type d'apprentissage supervisé dont le but est de prédire si la donnée d'entrée appartient à une catégorie.

# La régression Linéaire

Il existe plusieurs types de régression. Il y a la régression linéaire, la polynomiale, support vector, decision tree, random forest, etc.

Dans le cadre d'un exemple simple nous resterons sur la régression linéaire.

Mais dans un premier temps, voyons comment il est possible de faire une prédiction.

Le but sera de donner une estimation sur une nouvelle donnée qui n'est pas encore connue par l'algorithme.

Mettons que nous voulons prédire le prix d'un appartement basé sur une variable qui est sa taille, et que nous avons déjà quelques données existantes et exactes sur lesquelles s'appuyer pour faire cette prédiction

N.B. : Afin d'illustrer l'exemple, nous allons commencer par la représentation graphique d'une fonction linéaire.

Ce graphique n'est pas forcément exact, mais il illustrera parfaitement ce que l'on veut expliquer dans notre cas. Le but dans un premier temps est d'en comprendre la logique globale, nous expliquerons le calcul par la suite.

Nous avons donc ce graphique :

![]({{ site.baseurl }}/assets/2020-09-23-initiation_ML_regression_lineaire/graphique-vide.png" alt="GRAPHIQUE-VIDE" width="800">

sur lequel nous allons pouvoir placer nos données d'exemple qui correspondent aux prix d'autres appartements par rapport à leur taille.

![]({{ site.baseurl }}/assets/2020-09-23-initiation_ML_regression_lineaire/graphique-donnees.png" alt="GRAPHIQUE-DONNEES" width="800">

Pour faire nos prédictions nous allons modéliser le prix au m2 avec une fonction linéaire.

Définition :

Une fonction linéaire est une fonction qui traduit une situation de proportionnalité. Soit ***a*** un nombre réel quelconque. La fonction linéaire de coefficient ***a*** est la fonction qui associe à tout nombre réel *x* le produit *a* × *x*.

![]({{ site.baseurl }}/assets/2020-09-23-initiation_ML_regression_lineaire/calcul-f-lineaire.png" alt="CALCUL-F-LINEAIRE" width="150">


Elle est représentée sur le schéma par une droite qui passe au milieu de ces points de manière à ce que la distance entre chaque point et la droite soit la plus faible possible.

![]({{ site.baseurl }}/assets/2020-09-23-initiation_ML_regression_lineaire/graphique-lineaire.png" alt="GRAPHIQUE-LINEAIRE" width="800">

Avec cette hypothèse, nous pouvons donc prédire - visuellement tout du moins - qu'un appartement de **40m²** couterait un peu moins de **250k**€

![]({{ site.baseurl }}/assets/2020-09-23-initiation_ML_regression_lineaire/graphique-prediction.png" alt="GRAPHIQUE-PREDICTION" width="800">

Mais comme dit précédemment ce n'est que la représentation graphique du modèle de prédiction, et cela ne nous explique pas réellement comment on peut prédire le prix d'un appartement de 40m2.

D'un point de vue un peu plus "mathématique", notre modèle de prédiction aura deux paramètres &theta;<sub>0</sub> et &theta;<sub>1</sub>.

Par convention, la lettre Grecque θ (thêta) est fréquemment utilisée pour représenter un paramètre du modèle.

C'est en changeant ces paramètres que nous pouvons ajuster notre fonction linéaire.

Le premier représente la valeur sur laquelle la droite croise l'axe des abscisses, soit **0** dans notre cas, et le deuxième représente le **slope**, c'est à dire le coefficient avec lequel la droite est influée par la première valeur.

Pour calculer le coefficient de cette droite, nous pouvons prendre deux points sur la courbe et faire le calcul :

![]({{ site.baseurl }}/assets/2020-09-23-initiation_ML_regression_lineaire/calcul-slope.png" alt="CALCUL-SLOPE" width="180">

prenons ces deux points :

![]({{ site.baseurl }}/assets/2020-09-23-initiation_ML_regression_lineaire/graphique-slope.png" alt="GRAPHIQUE-SLOPE" width="800">

nous avons un premier point avec **10** en abscisse et **50** en ordonnée (environ) et un deuxième en **40** et **250**.

le slope est donc égal à :

![]({{ site.baseurl }}/assets/2020-09-23-initiation_ML_regression_lineaire/detail-calcul-slope.png" alt="DETAIL-CALCUL-SLOPE" width="180">

Nous pouvons maintenant calculer une prédiction.

L'hypothèse (qui se note  h<sub>&theta;</sub>(x)) pour prédire une nouvelle valeur se base donc sur ces deux paramètres tels que :

![]({{ site.baseurl }}/assets/2020-09-23-initiation_ML_regression_lineaire/calcul-prediction.png" alt="CALCUL-PREDICTION" width="230">

soit :

![]({{ site.baseurl }}/assets/2020-09-23-initiation_ML_regression_lineaire/detail-calcul-prediction.png" alt="DETAIL-CALCUL-PREDICTION" width="230">

Selon notre modèle de prédiction, un appartement de **40m2** coûterait donc **264k€**.
Ce qui n'est pas très loin de ce que nous avions observé à l'oeil sur la droite, mais pas exact non plus.

À noter que dans notre cas la droite part de zéro, mais ce n'est pas toujours le cas.

Nous aurions très bien pu avoir des données disposées différemment et donc une droite avec une position différente :

<![]({{ site.baseurl }}/assets/2020-09-23-initiation_ML_regression_lineaire/graphique-f-lineaire-2.png" alt="GRAPHIQUE-F-LINEAIRE-2" width="800">

Dans ce cas &theta; aurait été égal à **90** et non pas **0**.

À noter que le coefficient n'aurait pas été le même non plus.

Je vous invite à recommencer l'exercice avec cet exemple.

La question qu'on peut se poser maintenant est comment fait-on sans graphique ?

Comment la machine fait pour connaître les coefficients sans placer visuellement deux points sur la courbe ?

Justement c'est là qu'on en revient à la régression linéaire. Son but n'est pas seulement la prédiction finale, mais de trouver et ajuster les paramètres qui permettront à la fonction linéaire de correspondre au mieux à nos données et de faire les meilleures prédictions.

Pour cela nous avons besoin de deux choses, une fonction de coût et une descente de gradient.

**Fonction de coût**
-------------------

Premièrement nous avons besoin de mesurer la performance de notre modèle en utilisant une fonction de coût.

La fonction de coût nous indique la marge d'erreur par rapport à nos données existantes.

Il en existe plusieurs mais aujourd'hui nous allons utiliser Root Mean Square Error (RMSE), qui permet de mesurer l'écart **quadratique** (élevé au carré) moyen entre les valeurs prédites et les valeurs observées.

On part donc du set de données X tel que :

| € Taille (𝑥) | K Prix (𝑦) |
|--------------|:----------:|
|      10      |     50     |
|      15      |     100    |
|      28      |     210    |
|      34      |     150    |
|      43      |     250    |
|      ...     |     ...    |

les **𝑥** sont les variables d'entrée.

les **𝑦** sont les variables de sortie.

**m** est la taille du set de données.

**(i)** représente l'index courant de l'élément tel que, d'après notre set de données : <img src="/assets/2020-09-23-initiation_ML_regression_lineaire/set-donnees-x2.png" alt="SET-DONNEES-x2" width="100">

Le but est de mesurer l'écart entre une hypothèse **ŷ** et le vrai résultat **y** par rapport a **x**.

Si l'on prend un exemple concret, nous avons dans notre set de données en <img src="/assets/2020-09-23-initiation_ML_regression_lineaire/x1.png" alt="x1" width="30"> de **10m2** et un prix de **50k**.

Si on utilise notre modèle de prédiction pour prédire le prix d'un appartement de **10m2**, plus le résultat sera proche de **50**, plus le modèle sera performant.

Nous voulons donc que la valeur **h<sub>&theta;</sub>(x) - 𝑦** soit la plus faible possible.

Cependant, nous ne pouvons pas seulement nous appuyer sur une seule valeur. Notre set de données comporte plusieurs entrées, et ce qui est vrai pour le **30m2** n'est pas forcément vrai pour le **37** et notre but est de trouver un modèle qui conviendra le mieux aux deux.

Cela s'appelle la **Généralisation**.

Nous allons donc utiliser tout notre set de données et utiliser la notation avec l'index décrit plus haut et somme ∑.

Voici le calcul du RMSE, que nous allons expliquer:

![]({{ site.baseurl }}/assets/2020-09-23-initiation_ML_regression_lineaire/calcul-rmse.png" alt="CALCUL-RMSE" width="250">

À la manière d'une boucle for en programmation, qui exécute plusieurs fois des instructions tant que l'index n'est pas égal à une autre valeur, ici on définit **i** à **1** et on fait la somme des carrés des écarts correspondants à l'index courant tant que **i** n'est pas égal a **m**.

Un peu plus haut nous avions calculé le coefficient de la droite pour faire une prédiction d'un appartement de **40m2**.

Reprenons cette valeur de **6,6** pour exemple et voyons quelle est la marge d'erreur sur notre set de données.

Nous allons donc faire ce même calcul avec nos 5 premières données du set que nous avons plus haut.

Nous aurons donc nos prédictions avec notre modèle actuel, et les vraies valeur du set.

Par exemple pour le **10m2**, **y = 50**, et notre prédiction est **66**.

On aura donc:

![]({{ site.baseurl }}/assets/2020-09-23-initiation_ML_regression_lineaire/detail-calcul-rmse.png" alt="DETAIL-CALCUL-RMSE" width="800">

Nous pouvons visualiser ce résultat en l'affichant sur un graphique qui le placerait par rapport au coefficient.

![]({{ site.baseurl }}/assets/2020-09-23-initiation_ML_regression_lineaire/graphique-err-coef.png" alt="GRAPHIQUE-ERR-COEF" width="800">

Le problème ici, est qu'on ne sait pas si l'erreur est importante ou pas car nous n'avons aucune comparaison.

Nous avons pris le coefficient **6,6** car rappelons le, nous sommes directement partis d'une estimation visuelle sur le graphique, ce qui était plus simple pour comprendre le fonctionnement mais ce qui est loin d'être exact.

Il conviendra donc d'essayer avec plusieurs paramètres qui peuvent être 5, 6 , 7 ou n'importe quel autre nombre.

![]({{ site.baseurl }}/assets/2020-09-23-initiation_ML_regression_lineaire/graphique-err-coef-comp.png" alt="GRAPHIQUE-ERR-COEF-COMP" width="800">

La valeur la plus exacte est donc celle avec l'erreur la plus basse.

Après calcul, le meilleur paramètre pour notre prédiction d'appartement est donc en réalité de **6**.

Si nous reprenons le calcul de notre prédiction avec notre nouveau paramètre, un appartement de **40m2** devrait coûter **240K** **€ :**

![]({{ site.baseurl }}/assets/2020-09-23-initiation_ML_regression_lineaire/calcul-prediction-new-coeff.png" alt="CALCUL-PREDICTION-NEW-COEF" width="250">

La fonction de coût est ce qu'on appelle une fonction convexe. Trouver le minimum de la courbe, c'est trouver le meilleur paramètre.

![]({{ site.baseurl }}/assets/2020-09-23-initiation_ML_regression_lineaire/graphique-convexe.png" alt="GRAPHIQUE-CONVEXE" width="800">

Ici nous avons fait plusieurs essais en calculant manuellement, mais il existe des outils qui nous permettent de trouver cette valeur.

On en vient donc à la dernière partie de cet article, la descente de gradient.

**Descente de Gradient**
-------------------

La descente de gradient est un algorithme d'optimisation.

C'est un processus itératif, dont le but est de trouver le minimum d'une
fonction convexe.

Le but de la descente de gradient est de minimiser la fonction de coût,
et donc d'avoir le meilleur modèle.

![]({{ site.baseurl }}/assets/2020-09-23-initiation_ML_regression_lineaire/graphique-target-minimum.png" alt="GRAPHIQUE-TARGET-MINIMUM" width="600">

Plus haut nous avons essayé avec plusieurs valeurs qui étaient 5, 6 , 7.

Nous avons donc fait des sauts de 1.

Nous aurions pu faire des sauts plus petits de 0,5 et calculer avec 5,
5.5, 6, 6.5 etc

En réalité, nous allons utiliser un autre paramètre qui définit la
taille du pas effectué à chaque itération : le Learning Rate, il se note
⍶.

C'est ce qu'on appelle un hyper-paramètre, car il s'applique au modèle
lui même.

Et pour trouver le bon Learning rate, il conviendra d'essayer plusieurs
fois avec des valeurs différentes et d'y aller à tâton.

Pour que l'algorithme de la descente de gradient trouve le minimum de la
fonction convexe, il va devoir calculer la pente de cette fonction. Et
pour calculer la pente d'une fonction, on calcule sa dérivée.

Nous ne rentrerons pas en profondeur dans ces calculs, mais pour
information, voici la formule du gradient :

![]({{ site.baseurl }}/assets/2020-09-23-initiation_ML_regression_lineaire/calcul-gradient.png" alt="CALCUL-GRADIENT" width="350">

Dans notre cas, le paramètre **a** est notre coefficient, donc le gradient de notre prochain coeff est égal au : coeff actuel moins le learning rate multiplié par la dérivée de la fonction. Ce calcul est fait pour trouver la convergence de la courbe. Donc, et c'est ce qu'il faut retenir, nous nous dirigeons toujours vers le point le plus bas peu importe où nous sommes.

Attention donc à utiliser un bon learning rate. En effet, s'il est trop grand, alors il risque de ne jamais passer par la valeur minimum. S'il est trop petit, il prendra trop longtemps à l'atteindre.

![]({{ site.baseurl }}/assets/2020-09-23-initiation_ML_regression_lineaire/learning-rate.png" alt="LEARNING-RATE" width="800">

Même si nous ne sommes pas rentrés dans tous les détails, nous avons
déjà un bon aperçu de comment fonctionne un modèle machine Learning.

À noter que nous avons pris un exemple simple avec un seul paramètre,
mais tout cela peut vite devenir encore plus complexe.

Heureusement pour nous, on ne calcule jamais tout ça par nous même, nous avons tous les outils nécessaires en programmation comme par exemple <a href="https://scikit-learn.org/stable/">Scikit-Learn</a> ou <a href="https://www.tensorflow.org/?hl=fr">TensorFlow</a> en Python

Il existe encore plein d'autres parties du machine learning à découvrir comme la classification par exemple, ou bien des modèles d'apprentissage non-supervisés comme la clusterisation ou la réduction dimensionnelle. Ce qui pourra faire l'objet d'autres articles :)

<br/>

Credits :

Intro to data science - Steve Brunton - Washington University

Machine Learning - Andrew Ng - Stanford University

Hands on Machine Learning - Aurélien Guéron
