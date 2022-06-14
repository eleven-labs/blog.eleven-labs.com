---
layout: post
title: Analyse du coût de l'électricité en fonction du tarif choisi
excerpt: "Lors de la souscription chez un fournisseur d'électricité, il est possible de choisir entre différents tarif.
Il existe un tarif moins cher durant les périodes creuses. Est-ce vraiment intéressant ? Nous allons en faire l'analyse
dans cet article."
lang: fr
permalink: /fr/analyse-du-cout-de-l-electricite-en-fonction-du-tarif-choisi/
authors:
- tthuon
categories:
- python
---

Lors de l'acquisition d'un bien immobilier, il faut se souscrire à un fournisseur d'électricité. Une fois le fournisseur
d'électricité
sélectionné, il existe deux types d'offres généralement : tarif de base ou tarif heure creuse / heure pleine (
généralement abbrégé HC-HP). En plus de ces offres,
il existe des déclinaisons pour les véhicules électriques, ou avec de l'électricité produite à partir de sources
renouvelable.

La tarification heure creuse propose un prix assez bas du kilowatt-heure inférieure. En contre-partie, l'abonnement et
le prix du kilowatt-heure
en heure pleine est plus cher. Les périodes d'heure creuse/pleine sont déterminées par le gestionnaire du réseau Enedis.
Ces périodes correspondent à des moments de faible charge du réseau.

Avec tous ces tarifs, il n'est pas évident de s'y retrouver. Quand le bien immobilier à son chauffage au gaz, il est en
général conseillé
de prendre le tarif de base. Si le chauffage est électrique et qu'il y un chauffe-eau électrique à accumulation, il est
alors conseillé
de prendre le tarif HC-HP. Cela permet de chauffer l'eau durant les périodes creuses pour économiser de l'argent.

En choisissant un tarif HC-HP, il est possible de faire baisser ses coûts en consommation électrique. Cependant, il faut
veiller à
consommer le plus possible durant la période creuse. Cela signifie par exemple, lancer le lave-linge et le lave-vaisselle
à ces moments.

La question que l'on peut se poser : **est-ce que la tarification HC-HP est vraiment avantageuse ?**

Dans ce cas pratique, en tant qu'analyste de données (ou en anglais "Data Analyst"), je vais faire l'analyse du problème
et y répondre.
Je vais m'appuyer sur des outils tel que [Pandas](https://pandas.pydata.org/about/) pour la manipulation des données
et [plotly](https://plotly.com/python/) pour la création de visualisation de données. Tout cela en Python et dans un
[notebook Jupyter]({{ site.baseurl }}/fr/decouverte-ipython-un-shell-interactif-avance-pour-python/).

Il est tout à fait possible d'utiliser une feuille de calcul tel que LibreOffice Calc ou Microsoft Excel, mais le
but de ce cas d'étude est d'utiliser des outils spéciques à la manipulation des données en Python
(et parce que nous sommes des dev :D).

## Trouver les sources de données

### Les tarifs de l'électricités

Pour effectuer mon analyse, j'ai besoin de données. Dans un premier temps, il me faut les données sur les différents
tarifs.
Pour faire simple, je vais sélectionner EDF comme fournisseur d'électricité. Il est tout à fait possible d'en ajouter d'
avantage pour comparer.

Généralement, l'information sur la tarification n'est pas accessible du premier coup sur le site internet. Il faut
fouiller un peu. Quand la page est trouvé, la tarification est dans un document pdf.

- [https://particulier.edf.fr/fr/accueil/electricite-gaz/offres-electricite/tarif-bleu.html](https://particulier.edf.fr/fr/accueil/electricite-gaz/offres-electricite/tarif-bleu.html)
- [https://particulier.edf.fr/fr/accueil/electricite-gaz/offres-electricite/offres-marche.html](https://particulier.edf.fr/fr/accueil/electricite-gaz/offres-electricite/offres-marche.html)

J'ai sélectionné 4 tarifs

* tarif bleu base
* tarif vert base
* tarif vert weekend
* tarif vert weekend HC-HP

Note : Par soucis de rigueur, je ne peux pas sélectionner le tarif bleu HC-HP car je n'ai pas de données sur ma
consommation en HC-HP durant le weekend.

J'ai copié chaque valeur dans un tableau et sauvegardé dans un fichier OpenDocument (.ods). Le choix du format n'a pas
d'importance.
Cependant, pour faciliter leurs ingestions il faut garder une uniformité dans le format et la structure des données.

| kva | abonnement | heure pleine | heure creuse | heure weekend |
| --- | ---------- | ------------ | ------------ | ------------- |
| 6   | 11,8       | 22,35        | 15,21        | 15,21         |
| 9   | 15,3       | 22,35        | 15,21        | 15,21         |
| 12  | 18,48      | 22,35        | 15,21        | 15,21         |
| 15  | 21,58      | 22,35        | 15,21        | 15,21         |
| 18  | 24,52      | 22,35        | 15,21        | 15,21         |

Point d'attention sur les unités : il est important de veiller à leur uniformité et être vigilant. La tarification est
donnée en centimes d'euros par kilowatt-heure.
Par ailleurs, lors de l'analyse, il est nécessaire de tenir compte du coût de l'abonnement. Il est mensuel.

### Les données de consommations

Avec le déploiement des compteurs Linky, la consommation (et la production) d'électricité est remonté quotidiennement
chez le gestionnaire
de réseau Enedis. Les fournisseurs d'électricité demande à Enedis la consommation électrique de chaque Point De
Livraison (PDL) pour ainsi
facturer au client final.

Enedis permet au client de consulter ses données quotidiennes. Il est possible d'activer une option pour consulter sa
consommation par tranche de 30 minutes.

Je vous renvoi vers un article Enedis pour récupérer les données de
consommation [https://www.enedis.fr/jaccede-mes-donnees-de-consommation-et-de-production-delectricite](https://www.enedis.fr/jaccede-mes-donnees-de-consommation-et-de-production-delectricite)
.

Pour notre étude, j'ai pris 1 mois.

## Nettoyage des données

Ci-dessous un extrait du fichier fournis par Enedis.

```text
Identifiant PRM;Type de donnees;Date de debut;Date de fin;Grandeur physique;Grandeur metier;Etape metier;Unite
00000000000000;Index;12/04/2021;18/04/2021;Energie active;Consommation;Comptage Brut;Wh
Horodate;Type de releve;EAS F1;EAS F2;EAS F3;EAS F4;EAS F5;EAS F6;EAS F7;EAS F8;EAS F9;EAS F10;EAS D1;EAS D2;EAS D3;EAS D4;EAS T
2021-04-01T01:00:00+02:00;Arrêté quotidien;11538434;12944147;3668104;;;;;;;;19416294;2543931;2686684;3503776;28150685
Periode;Identifiant calendrier fournisseur;Libelle calendrier fournisseur;Identifiant classe temporelle 1;Libelle classe temporelle 1;Cadran classe temporelle 1;
Du 2021-04-12T00:00:00+01:00 au;AA000000;Option Heures Creuses + Week-End;HC;Heures Creuses;EAS F1;HP;Heures Pleines;
```

Les données de consommation ont une structure spécifique. Les deux premières lignes sont des en-tête qui décrivent la
nature
des données. Un élément doit attirer notre attention : la consommation est en watt-heure et c'est du cumulatif
(comme un compteur kilométrique d'une voiture).

La troisième ligne ce sont les noms de colonnes. Ces noms sont des index de colonnes. Les labels plus détails sont dans
les 2 dernières lignes du tableau.

Par exemple, pour la colonne `EAS F1` j'ai la valeur `11538434`. En regardant les deux dernière lignes du tableau, je
vois

```text
Identifiant classe temporelle 1;Libelle classe temporelle 1;Cadran classe temporelle 1
EAS F1                         ;HP                         ;Heures Pleines
```

Donc la colonne `EAS F1` correspond à la consommation en `Heures Pleines`.

Au final, ce sont les colonnes `EAS F1`, `EAS F2`, `EAS F3` qui correspondent à la consommation en heures pleines,
heures creuses et weekend.

Dans un premier temps je supprimes les lignes qui ne m'intéressent pas.

```python
BASE_PATH = "datalake/"
RAW_DATA_FILENAME = "sample.csv"
RAW_DATA_CLEANED_FILENAME = "enedis_conso_clean.csv"
CLEANED_DATA_FILENAME = "enedis-data-ready-to-work.parquet"

with open(f"{BASE_PATH}{RAW_DATA_FILENAME}", "r+") as fp:
    lines = fp.readlines()
    with open(f"{BASE_PATH}{RAW_DATA_CLEANED_FILENAME}", "w+") as fpclean:
        fpclean.writelines(lines[2: len(lines) - 2])
```

Je relis le fichier avec Pandas. Je vais effectuer quelques calcul de bases comme le différentiel par jour et la
consommation totale de la journée.

Avec Pandas, le travail sur les données s'effectue en colonne et non en ligne. Ce fonctionnement est un peu déroutant
lorsque l'on utilise
courament des bases de données tel que MySQL ou PostgreSQL.

```python
import pandas as pd

df = pd.read_csv(f"{BASE_PATH}{RAW_DATA_CLEANED_FILENAME}", sep=";")

# Calcul de la consommation totale de la journée
df["Total Consommation"] = df["EAS F2"] + df["EAS F1"] + df["EAS F3"]

# Renommage des colonnes
df_work = df[["Horodate", "EAS F1", "EAS F2", "EAS F3", "Total Consommation"]].copy()
df_work.columns = [
    "Horodate",
    "Quantité Heure Creuse en wh",
    "Quantité Heure Pleine en wh",
    "Quantité Weekend en wh",
    "Total Consommation",
]

# Calcul de la différence par rapport à la journée précédente pour chaque colonne.
df_work["Différence journalier Total Consommation"] = df_work["Total Consommation"].diff()
df_work["Différence journalier Heure Creuse"] = df_work["Quantité Heure Creuse en wh"].diff()
df_work["Différence journalier Heure Pleine"] = df_work["Quantité Heure Pleine en wh"].diff()
df_work["Différence journalier Weekend"] = df_work["Quantité Weekend en wh"].diff()

# Sauvegarde du traitement dans un fichier Apache Parquet
df_work.to_parquet(f"{BASE_PATH}{CLEANED_DATA_FILENAME}")
```

J'ai choisi de stocker le résultat dans un format Apache Parquet car je voulais essayer ce format. Ce format est adapté
aux données de type colonne
et permet un stockage efficace (compression).

Nos données sont prêtes pour l'analyse.

## Analyse des données

### Répartition de la consommation

Dans un premier temps, je vais regarder la répartition de la consommation entre les différentes périodes. Quelle est la
part d'heures creuse, d'heures pleine et weekend.

```python
import pandas as pd

df = pd.read_parquet("datalake/enedis-data-ready-to-work.parquet")
repartition_consommation = pd.DataFrame(
    {
        "Consommation par periode en kWh": [
            df["Différence journalier Heure Pleine"].sum() / 1000,
            df["Différence journalier Heure Creuse"].sum() / 1000,
            df["Différence journalier Weekend"].sum() / 1000,
        ],
        "Périodes": ["Heure Pleine", "Heure Creuse", "Weekend"],
    }
)
repartition_consommation
```

Cela me donne le tableau suivant.

| Consommation par periode en kWh | Périodes     |
|---------------------------------|--------------|
| 132.935                         | Heure Pleine |
| 158.837                         | Heure Creuse |
| 136.113                         | Weekend      |

La lecture du tableau ne permet pas de se rendre compte de cette répartition. Ajoutons un graphique en camembert.

<div style="text-align: center;">
    <img src="{{ site.baseurl }}/assets/2022-06-30-analyse-cout-electricite/repartition-consommation.png" alt="répartition de la consommation entre les différentes périodes" style="display: block; margin: auto;"/>
</div>

C'est mieux :)

### Calcul du coût en fonction du tarif

Ensuite je fais l'analyse avec les tarifs. Dans la grille tarifaire, chaque ligne correspond à une puissance
électrique apparente maximale mesuré en kilovoltampère (kVA). Je vous renvoi à Wikipédia pour plus
d'explication [https://fr.wikipedia.org/wiki/Voltamp%C3%A8re](https://fr.wikipedia.org/wiki/Voltamp%C3%A8re).

Pour notre cas, ça sera 9 kVA.

Ci-dessous j'expose le code du calcul pour le tarif vert weekend hc-hp

```python
# Je charge le fichier de tarification et je sélectionne la ligne avec 9 kVA
df_tarif_vert_weekend_hp_hc = pd.read_excel("datalake/tarif-vert-weekend-hc-hp.ods")
selected_df_tarif_vert_weekend_hp_hc = df_tarif_vert_weekend_hp_hc.loc[df_tarif_vert_weekend_hp_hc["kva"] == 9]
selected_df_tarif_vert_weekend_hp_hc.reset_index(drop=True, inplace=True)  # Remise à zéro de l'index du tableau

# Je créé un nouveau tableau avec le calcul de consommation multiplié avec le tarif du kWh. Attention aux unités.
cout_tarif_vert_weekend_hp_hc = pd.DataFrame(columns=["cout heure creuse", "cout heure pleine", "cout weekend"])
cout_tarif_vert_weekend_hp_hc["cout heure creuse"] = (df["Différence journalier Heure Creuse"] / 1000) * (selected_df_tarif_vert_weekend_hp_hc["heure creuse"].values[0] / 100)
cout_tarif_vert_weekend_hp_hc["cout heure pleine"] = (df["Différence journalier Heure Pleine"] / 1000) * (selected_df_tarif_vert_weekend_hp_hc["heure pleine"].values[0] / 100)
cout_tarif_vert_weekend_hp_hc["cout weekend"] = (df["Différence journalier Weekend"] / 1000) * (selected_df_tarif_vert_weekend_hp_hc["heure weekend"].values[0] / 100)
cout_tarif_vert_weekend_hp_hc["total"] = cout_tarif_vert_weekend_hp_hc["cout weekend"] + cout_tarif_vert_weekend_hp_hc["cout heure pleine"] + cout_tarif_vert_weekend_hp_hc["cout heure creuse"]

# j'ajoute le coût de l'abonnement au total
calculated_cout_tarif_vert_weekend_hp_hc = cout_tarif_vert_weekend_hp_hc["total"].sum() + selected_df_tarif_vert_weekend_hp_hc["abonnement"].values[0]
```

Je répète cette opération pour tous les tarifs que j'ai sélectionné.

Cela me permet de tracer ce graphique avec plotly.

<div style="text-align: center;">
    <img src="{{ site.baseurl }}/assets/2022-06-30-analyse-cout-electricite/calcul-cout-electricite.png" alt="coût de l'électricité en fonction du tarif" style="display: block; margin: auto;"/>
</div>

## Interprétation

En comparant le tarif vert de base et tarif vert weekend HC-HP, il y a bien une différence de 2,25 euros (soit une différence de 2,44%).
Cela représente 27 euros par an.

Donc pour répondre à la question initiale : **oui**, la tarification HC-HP est avantageuse par rapport à une tarification de base.

Cependant, cette interprétation est à nuancer.
- L'analyse est effectué pour une répartition de la consommation. Si la répartition est différente, le résultat pourrait être différent.
- Si je compare la tarification vert weekend HC-HP et le tarif bleu de base, la réponse à la question est inversée.
Mais la comparaison n'est pas rigoureuse car le coût de production de l'électricité dite "verte" est supérieure à celle du tarif bleu.

## Conclusion

Le code n'est pas très jolie, il y a beaucoup de répétition. En tant qu'analyste de données, je chercher avant tout le
résultat et à donner du sens aux données.

L'étape suivant consiste à automatiser ce processus via d'autres outils tel qu'Apache Workflow et Apache Spark.
Ce travaille est effectué par un ingénieur en données (en anglais Data Engineer).
Il pourra s'aider d'un Data Ops pour la mise en place d'une infrastructure robuste.

Enfin, le Data Analyst pourra s'appuyer d'un scientifique en données (en anglais Data Scientist) pour prédire la proportion d'heure creuse et d'heure pleine durant la période du weekend.
Ainsi il sera possible d'exploiter le tarif bleu hc-hp.

## Ressources

* [https://www.enedis.fr/faq/gerer-sa-consommation-delectricite/loption-heures-creuses-comment-ca-marche](https://www.enedis.fr/faq/gerer-sa-consommation-delectricite/loption-heures-creuses-comment-ca-marche)
* [https://particuliers.engie.fr/electricite/conseils-electricite/conseils-tarifs-electricite/tarif-reglemente.html](https://particuliers.engie.fr/electricite/conseils-electricite/conseils-tarifs-electricite/tarif-reglemente.html)
* [https://particulier.edf.fr/fr/accueil/electricite-gaz/offres-electricite/tarif-bleu.html](https://particulier.edf.fr/fr/accueil/electricite-gaz/offres-electricite/tarif-bleu.html)
* [https://particulier.edf.fr/fr/accueil/electricite-gaz/offres-electricite/offres-marche.html](https://particulier.edf.fr/fr/accueil/electricite-gaz/offres-electricite/offres-marche.html)
* [https://www.enedis.fr/jaccede-mes-donnees-de-consommation-et-de-production-delectricite](https://www.enedis.fr/jaccede-mes-donnees-de-consommation-et-de-production-delectricite)
* [https://fr.wikipedia.org/wiki/Voltamp%C3%A8re](https://fr.wikipedia.org/wiki/Voltamp%C3%A8re)
* [Code de l'analyse]({{ site.baseurl }}/assets/2022-06-30-analyse-cout-electricite/code.zip)
