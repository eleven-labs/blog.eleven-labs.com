---
contentType: tutorial-step
tutorial: symfony-clean-architecture
slug: conclusion
title: Conclusion
---

## Conclusion

Notre boîte de Leitner a fait peau neuve, et fonctionnellement, rien a changé ! Enfin.. Notre application est devenue une API, pour le bien de ce tutoriel, mais dorénavant, rien ne nous empêche de brancher d'autres types de Controller dans notre Infrastructure. Que l'on renvoit du JSON, de l'HTML, ou même qu'on branche des Commands à notre application pour interagir avec via le terminal, une chose est sûre: notre Domain n'en saura jamais rien, car il reste agnostique de toutes les couches au dessus de lui. C'est l'avantage de dépendre d'abstractions (interfaces) plutôt que d'implémentations concrètes.

Cela nous permet d'adopter une nouvelle façon de développer et d'ajouter des fonctionnalités: **Toujours commencer par le Domain**. Ce qui se passe au dessus ne devrait jamais être un problème tant que nos règles de gestions et le comportement de notre Domain n'a pas été ajouté.
Puis on ajoute la couche **Application** pour orchestrer notre Domain. Si on a besoin de se connecter à la couche Infra pour une quelconque raison (base de donnée, envoit de mail, ...), alors on crée nos Interfaces dans le Domain, pour se concentrer sur ce que **je dois faire** plutôt que **comment** je le fais. Et je peux ajouter mes tests unitaires en isolation avec l'extérieur.

Enfin, quand tout cela est en place, je peux commencer à me demander **comment** j'implémente mes différentes interfaces, quel Mail Provider, quel type de base de donnée, quel Payment Provider, voire même quel **Framework** je veux brancher sur mon application.
Et tout cela, c'est mon Infrastructure qui s'en charge.

Et voilà ! Je trouve cela beaucoup plus sain de se concentrer sur notre *métier* avant tout le reste, car c'est là la raison d'être de nos applications.

J'espère que ce tutoriel vous a plu et vous aura appris des choses, n'oubliez pas qu'il n'y a jamais **une seule** manière de faire, donc adaptez toujours ce que vous lisez à votre situation, votre équipe, et votre sensibilité.

Merci d'avoir suivi jusqu'ici et à très bientôt sur le blog d'Eleven Labs 👋
