---
lang: fr
date: '2020-09-08'
slug: gerer-son-organisation-github-avec-terraform
title: |
  Gérer son organisation Github avec Terraform
excerpt: >
  Apprenons ensemble à scaler la gestion d'une organisation Github avec
  Terraform
authors:
  - VEBERArnaud
categories:
  - architecture
keywords:
  - devops
  - github
  - terraform
---

## Un peu de contexte
Avec l'augmentation du nombre de projets et de contributeurs sur notre [organisation Github](https://github.com/eleven-labs)
ont émergé des sujets d'onboarding / outboarding et de gouvernance.
Jusque là, les dépôts et les contributeurs étaient créés manuellement par un administrateur de l'organisation,
mais le manque de disponibilité de ces administrateurs ne permettait pas une gestion optimale.
Il devenait évident qu'une autre solution devait être envisagée.

## Comment scaler la gestion d'une organisation Github
Comme expliqué précédemment, notre obstacle sur le chemin d'une gestion optimale se trouve au niveau des actions
manuelles réalisables par un ensemble restreint de personnes.

Pour outrepasser cet obstacle, deux solutions s'offraient à nous
- Augmenter le nombre d'administrateurs et donc la probabilité d'en trouver un de disponible à un instant *t*,
- Automatiser ces actions à l'aide d'un projet collaboratif accessible par tout le monde.

La première solution, consistant à augmenter le nombre d'administrateurs, a très vite été abandonnée.
Elle soulevait plus de questions qu'elle apportait de réponses (sécurité, gouvernance, perte de l'information).

La deuxième solution, au contraire, s'est très vite révélée être la solution dont nous avions besoin.

## Le projet
#### Nos besoins:
- Un projet déclaratif versionné pouvant interagir avec l'api Github (pour éviter la perte d'information),
- Un projet accessible à tout le monde (pour faciliter l'onboarding / outboarding),
- Un workflow de validation simplifié et collaboratif (pour la gouvernance & la sécurité),
- Un projet permettant l'intégration et le déploiement continus (pour automatiser les changements),

#### Notre solution
Avec cet ensemble de besoins identifiés, j'ai tout de suite vu une nouvelle occasion d'utiliser un de mes outils
favoris [Terraform](https://www.terraform.io/).

Terraform nous permet d'avoir un projet déclaratif et open source versionné sur Github (*Githubception*) pour favoriser
la collaboration, simplifier le process de validation et déclencher automatiquement des actions au merge d'une pull
request.

## Passons à la pratique
### Configuration du provider Github
Commençons par la configuration du provider Github pour Terraform.

> La documentation du provider Github pour Terraform est disponible sur le
> [site officiel Terraform](https://www.terraform.io/docs/providers/github/index.html).

Pour cela vous allez avoir besoin :
- du nom de l'organisation Github, par exemple `your_organisation_name`
- d'un [token Github](https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token)
permettant l'administration de l'organisation, par exemple `ff34885...`

Créons à la racine de notre projet un fichier `terraform.tf` qui contiendra la configuration du provider
```hcl
# ./terraform.tf

provider "github" {
  organization = "your_organization_name"
  token        = "ff34885..."
}
```

Vous pouvez maintenant initialiser le projet avec la commande
```sh
terraform init
```

Notre projet Terraform étant initialisé et prêt à communiquer avec l'API de Github, voyons comment créer et récupérer les
différentes resources et data sources dont nous avons besoin.

### Repository
#### Resource github_repository
Commençons par un exemple simplifié de gestion de repository avec la resource `github_repository`

> Nous verrons [plus tard](#module-repository) un exemple plus complet

La resource `github_repository` requiert comme argument
- le nom du repository, par exemple `my_awesome_repo`

Créons à la racine du projet un fichier `repository.tf` qui contiendra la déclaration de notre repository
```hcl
# ./repository.tf

resource "github_repository" "example" {
  name = "my_awesome_repo"
}
```

Vous pouvez maintenant vérifier les changements que Terraform apportera à votre organisation avec la commande
```sh
terraform plan
```

Puis appliquez ces changements avec la commande
```sh
terraform apply
```

Votre nouveau repository est maintenant disponible dans votre organisation Github

### Utilisateur
Intéressons-nous maintenant à la partie utilisateur.

Pour les utilisateurs, notre but n'est pas de créer de nouveaux utilisateurs Github mais de récupérer les utilisateurs
qui nous intéressent pour ensuite les ajouter à notre organisation.
Pour cette raison nous utilisons la data source `github_user` pour récupérer les utilisateurs et la resource
`github_membership` afin de les ajouter à l'organisation.

#### Data source github_user
La data source `github_user` requiert en argument
- le username de l'utilisateur que l'on souhaite récupérer, par exemple `VEBERAranud`

Créons à la racine du projet un fichier `user.tf`
```hcl
# ./user.tf

data "github_user" "example" {
  username = "VEBERArnaud"
}
```

#### github_membership
La resource `github_membership` requiert en arguments
- le username de l'utilisateur à ajouter à l'organisation. Nous utilisons ici une interpolation depuis notre data
source `github_user`.
- le rôle de cet utilisateur dans l'organisation. Deux choix sont possibles `member` ou `admin` en fonction des
permissions que vous souhaitez lui attribuer.

Ajoutons au fichier `user.tf`
```hcl
# ./user.tf

# ... (github_user data source)

resource "github_membership" "example" {
  username = data.github_user.example.login
  role     = "admin"
}
```

Vous pouvez maintenant faire un plan et un apply de vos changements, avec les commandes

```sh
terraform plan
terraform apply
```

L'utilisateur reçoit alors un mail de Github l'invitant à rejoindre votre organisation.

### Team
Le dernier domaine que nous verrons dans cet article concerne les teams, incluant la création, l'ajout
d'utilisateurs et l'attribution de repositories à ces teams.

Pour cela nous utiliserons les resources `github_team` pour la création de teams, `github_team_membership` pour l'ajout
d'utilisateurs aux teams et `github_team_repository` pour l'attribution de repositories aux teams.

#### github_team
La resource `github_team` requiert en argument
- le nom de la team, par exemple `BackEnd`

Créons à la racine du projet un fichier `team.tf`
```hcl
# ./team.tf

resource "github_team" "example" {
  name = "BackEnd"
}
```

#### github_team_membership
La resource `github_team_membership` requiert en arguments
- l'id de la team, récupérée par interpolation depuis la resource `github_team`
- le username de l'utilisateur à ajouter à la team, récupérée par interpolation depuis la data source `github_user`
- le rôle de cet utilisateur dans la team, au choix entre `member` et `maintainer`

Ajoutons au fichier `team.tf`
```hcl
# ./team.tf

# ... (github_team resource)

resource "github_team_membership" "example" {
  team_id  = github_team.example.id
  username = data.github_user.example.login
  role     = "maintainer"
}
```

#### github_team_repository
La resource `github_team_repository` requiert en arguments
- l'id de la team, récupérée par interpolation depuis la resource `github_team`
- le nom du repository à attribuer à la team, récupérée par interpolation depuis la resource `github_repository`
- les permissions de la team sur ce repository, au choix parmi `pull`, `triage`, `push`, `maintain` or `admin`

Ajoutons au fichier `team.tf`
```hcl
# ./team.tf

# ... (github_team resource)

# ... (github_team_membership resource)

resource "github_team_repository" "example" {
  team_id    = github_team.example.id
  repository = github_repository.example.name
  permission = "admin"
}
```

Vous pouvez maintenant faire un plan et un apply de vos changements, avec les commandes
```sh
terraform plan
terraform apply
```

Votre nouvelle team devrait maintenant exister, contenir votre utilisateur et avoir les droits admin sur votre nouveau
repository.

### Modules
Maintenant que nous savons gérer les repositories, les utilisateurs et les teams, voyons comment créer des modules
réutilisables pour abstraire une partie de la complexité.

Nous en profiterons pour ajouter de nouvelles resources à ces modules afin d'ajouter les arguments optionnels sur les
resources ainsi que la création des resources de protection de branches et des webhooks sur les repositories.

![Github model]({{site.baseurl}}/assets/2020-09-08-gerer-son-organisation-github-avec-terraform/github_model.png)

#### Module repository
Le premier module que nous allons réaliser est le module de gestion de repository que nous nommerons `repository`.

Ce module est composé des fichiers
- `./module/repository/variables.tf` pour regrouper les différentes variables du module
- `./module/repository/main.tf` pour la déclaration du repository
- `./module/repository/branch_protection.tf` pour la déclaration des branches protégées du repository
- `./module/repository/webhook.tf` pour la déclaration des webhooks du repository
- `./module/repository/outputs.tf` pour l'exposition d'attributs à l'extérieur du module

```hcl
# ./module/repository/variables.tf

variable "repository-name" {
  type = string
}

variable "repository-description" {
  type = string

  default = null
}

variable "repository-homepage_url" {
  type = string

  default = null
}

variable "repository-topics" {
  type = list(string)

  default = []
}

variable "repository-private" {
  type = bool

  default = true
}

variable "repository-has_issues" {
  type = bool

  default = true
}

variable "repository-has_projects" {
  type = bool

  default = true
}

variable "repository-has_wiki" {
  type = bool

  default = true
}

variable "repository-has_downloads" {
  type = bool

  default = true
}

variable "repository-allow_merge_commit" {
  type = bool

  default = true
}

variable "repository-allow_squash_merge" {
  type = bool

  default = true
}

variable "repository-allow_rebase_merge" {
  type = bool

  default = true
}

variable "repository-auto_init" {
  type = bool

  default = false
}

variable "repository-gitignore_template" {
  type = string

  default = null
}

variable "repository-license_template" {
  type = string

  default = null
}

variable "repository-default_branch" {
  type = string

  default = null
}

variable "repository-archived" {
  type = bool

  default = false
}

variable "branches_protection" {
  type = list(
    object({
      branch                                     = string,
      enforce_admins                             = bool,
      require_signed_commits                     = bool,
      status_check-strict                        = bool,
      status_check-contexts                      = list(string),
      pr_reviews-required_approving_review_count = number
      pr_reviews-require_code_owner_reviews      = bool,
      pr_reviews-dismiss_stale_reviews           = bool,
      pr_reviews-dismissal_users                 = list(string),
      pr_reviews-dismissal_teams                 = list(string),
      restrictions-users                         = list(string),
      restrictions-teams                         = list(string)
    })
  )

  default = []
}

variable "webhooks" {
  type = list(
    object({
      url          = string,
      secret       = string,
      content_type = string,
      insecure_ssl = bool,
      active       = bool,
      events       = list(string)
    })
  )

  default = []
}
```

```hcl
# ./module/repository/main.tf

resource "github_repository" "main" {
  name         = var.repository-name
  description  = var.repository-description
  homepage_url = var.repository-homepage_url
  topics       = var.repository-topics

  private = var.repository-private

  has_issues    = var.repository-has_issues
  has_projects  = var.repository-has_projects
  has_wiki      = var.repository-has_wiki
  has_downloads = var.repository-has_downloads

  allow_merge_commit = var.repository-allow_merge_commit
  allow_squash_merge = var.repository-allow_squash_merge
  allow_rebase_merge = var.repository-allow_rebase_merge

  auto_init = var.repository-auto_init

  gitignore_template = var.repository-gitignore_template
  license_template   = var.repository-license_template

  default_branch = (var.repository-default_branch != "master" ? var.repository-default_branch : null)

  archived = var.repository-archived

  lifecycle {
    prevent_destroy = true
  }
}
```

```hcl
# ./module/repository/branch_protection.tf

resource "github_branch_protection" "main" {
  count = length(var.branches_protection)

  repository = github_repository.main.name
  branch     = var.branches_protection[count.index].branch

  enforce_admins = var.branches_protection[count.index].enforce_admins

  require_signed_commits = var.branches_protection[count.index].require_signed_commits

  required_status_checks {
    strict   = var.branches_protection[count.index].status_check-strict
    contexts = var.branches_protection[count.index].status_check-contexts
  }

  required_pull_request_reviews {
    required_approving_review_count = var.branches_protection[count.index].pr_reviews-required_approving_review_count
    dismiss_stale_reviews           = var.branches_protection[count.index].pr_reviews-dismiss_stale_reviews
    dismissal_users                 = var.branches_protection[count.index].pr_reviews-dismissal_users
    dismissal_teams                 = var.branches_protection[count.index].pr_reviews-dismissal_teams
    require_code_owner_reviews      = var.branches_protection[count.index].pr_reviews-require_code_owner_reviews
  }

  restrictions {
    users = var.branches_protection[count.index].restrictions-users
    teams = var.branches_protection[count.index].restrictions-teams
  }
}
```

```hcl
# ./module/repository/webhook.tf

resource "github_repository_webhook" "main" {
  count = length(var.webhooks)

  repository = github_repository.main.name

  configuration {
    url          = var.webhooks[count.index].url
    content_type = var.webhooks[count.index].content_type
    insecure_ssl = var.webhooks[count.index].insecure_ssl
    secret       = var.webhooks[count.index].secret
  }

  active = var.webhooks[count.index].active

  events = var.webhooks[count.index].events
}
```

```hcl
# ./module/repository/outputs.tf

output "name" {
  value = github_repository.main.name
}

output "full_name" {
  value = github_repository.main.full_name
}

output "html_url" {
  value = github_repository.main.html_url
}

output "ssh_clone_url" {
  value = github_repository.main.ssh_clone_url
}

output "http_clone_url" {
  value = github_repository.main.http_clone_url
}

output "svn_url" {
  value = github_repository.main.svn_url
}
```

Pour utiliser ce module, éditons le fichier `./repository.tf` et remplaçons son contenu par
```hcl
# ./repository.tf

module "my_awesome_blog" {
  source = "./module/repository/"

  # repository
  repository-name         = "my_awesome_blog"
  repository-description  = "My Awesome Blog"
  repository-homepage_url = "https://my-awesome-blog.com"
  repository-topics       = ["blog", "tech", "awesome"]

  repository-private = false

  repository-has_projects = false

  repository-auto_init      = false
  repository-default_branch = "master"

  # branches protection
  branches_protection = [
    {
      branch                                     = "master"
      enforce_admins                             = false
      require_signed_commits                     = false
      status_check-strict                        = true
      status_check-contexts                      = ["continuous-integration/travis-ci"]
      pr_reviews-required_approving_review_count = 1
      pr_reviews-require_code_owner_reviews      = false
      pr_reviews-dismiss_stale_reviews           = false
      pr_reviews-dismissal_users                 = []
      pr_reviews-dismissal_teams                 = []
      restrictions-users                         = []
      restrictions-teams                         = []
    }
  ]

  # webhooks
  webhooks = [
    {
      url          = "https://notify.travis-ci.com"
      secret       = null
      content_type = "form"
      insecure_ssl = false
      active       = true
      events       = ["create", "delete", "issue_comment", "member", "public", "pull_request", "push", "repository"]
    }
  ]
}
```

#### Module utilisateur
Intéressons-nous maintenant au module de gestion d'utilisateurs que nous nommerons `user`.

Ce module est composé des fichiers
- `./module/user/variables.tf` pour regrouper les différentes variables du module
- `./module/user/main.tf` pour la déclaration des utilisateurs
- `./module/user/membership.tf` pour l'attribution des utilisateurs à l'organisation
- `./module/user/outputs.tf` pour l'exposition d'attributs à l'extérieur du module

```hcl
# ./module/user/variables.tf

variable "user-name" {
  type = string
}

variable "user-role" {
  type = string

  default = "member"
}
```

```hcl
# ./module/user/main.tf

data "github_user" "main" {
  username = var.user-name
}
```

```hcl
# ./module/user/membership.tf

resource "github_membership" "main" {
  username = data.github_user.main.login
  role     = var.user-role
}
```

```hcl
# ./module/user/outputs.tf

output "login" {
  value = data.github_user.main.login
}

output "avatar_url" {
  value = data.github_user.main.avatar_url
}

output "gravatar_id" {
  value = data.github_user.main.gravatar_id
}

output "site_admin" {
  value = data.github_user.main.site_admin
}

output "name" {
  value = data.github_user.main.name
}

output "company" {
  value = data.github_user.main.company
}

output "blog" {
  value = data.github_user.main.blog
}

output "location" {
  value = data.github_user.main.location
}

output "email" {
  value = data.github_user.main.email
}

output "gpg_keys" {
  value = data.github_user.main.gpg_keys
}

output "ssh_keys" {
  value = data.github_user.main.ssh_keys
}

output "bio" {
  value = data.github_user.main.bio
}

output "public_repos" {
  value = data.github_user.main.public_repos
}

output "public_gists" {
  value = data.github_user.main.public_gists
}

output "followers" {
  value = data.github_user.main.followers
}

output "following" {
  value = data.github_user.main.following
}

output "created_at" {
  value = data.github_user.main.created_at
}

output "updated_at" {
  value = data.github_user.main.updated_at
}
```

Pour utiliser ce module, éditons le fichier `./user.tf` et remplaçons son contenu par
```hcl
# ./user.tf

module "VEBERArnaud" {
  source = "./module/user/"

  user-name = "VEBERArnaud"
  user-role = "admin"
}
```

#### Module team
Pour finir avec les modules, regardons la gestion des teams dans un module nommé `team`.

Ce module est composé des fichiers
- `./module/team/variables.tf` pour regrouper les différentes variables du module
- `./module/team/main.tf` pour la déclaration de la team
- `./module/team/team_membership.tf` pour l'ajout des utilisateurs à la team
- `./module/team/team_repository.tf` pour l'ajout des repositories à la team
- `./module/team/outputs.tf` pour l'exposition d'attributs à l'extérieur du module

```hcl
# ./module/team/variables.tf

variable "team-name" {
  type = string
}

variable "team-description" {
  type = string

  default = null
}

variable "team-privacy" {
  type = string

  default = "secret"
}

variable "team-parent_team_id" {
  type = string

  default = null
}

variable "team-ldap_dn" {
  type = string

  default = null
}

variable "team-members" {
  type = list(string)

  default = []
}

variable "team-members_role" {
  type = map

  default = {}
}

variable "team-repositories" {
  type = list(string)

  default = []
}

variable "team-repositories_permission" {
  type = map

  default = {}
}
```

```hcl
# ./module/team/main.tf

resource "github_team" "main" {
  name           = var.team-name
  description    = var.team-description
  privacy        = var.team-privacy
  parent_team_id = var.team-parent_team_id
  ldap_dn        = var.team-ldap_dn
}
```

``` hcl
# ./module/team/team_membership.tf

resource "github_team_membership" "members" {
  for_each = toset(var.team-members)

  team_id  = github_team.main.id
  username = each.value
  role     = var.team-members_role[each.value]
}
```

```hcl
# ./module/team/team_repository.tf

resource "github_team_repository" "repositories" {
  for_each = toset(var.team-repositories)

  team_id    = github_team.main.id
  repository = each.value
  permission = var.team-repositories_permission[each.value]
}
```

```hcl
# ./module/team/outputs.tf

output "id" {
  value = github_team.main.id
}

output "slug" {
  value = github_team.main.slug
}
```

Pour utiliser ce module, éditons le fichier `./team.tf` et remplaçons son contenu par
```hcl
# ./team.tf
module "core" {
  source = "./module/team/"

  team-name        = "FrontEnd"
  team-description = "FrontEnd Developers"
  team-privacy     = "secret"

  team-members = [
    module.VEBERArnaud.login,
  ]

  team-members_role = {
    (module.VEBERArnaud.login) = "maintainer",
  }

  team-repositories = [
    module.my_awesome_blog.name,
  ]

  team-repositories_permission = {
    (module.my_awesome_blog.name) = "admin",
  }
}
```

Utilisons maintenant nos commandes Terraform pour vérifier les changements qui vont être apportés à notre organisation
Github et les appliquer.
```sh
terraform plan
terraforn apply
```

## Pour aller plus loin
### Terraform remote state & lock
Afin de favoriser la collaboration, il est important de partager le state Terraform entre les différentes exécutions et
garantir qu'une seule exécution se fait à un instant *t*

Pour cela, il est possible de configurer le stockage distant des fichiers de state Terraform, plusieurs types de backend
sont disponible en fonction de vos préférences.

La documentation pour ces fonctionnalités est disponible sur la
[documentation Terraform](https://www.terraform.io/docs/backends/types/index.html).

### Intégration / déploiement continue
La dernière étape pour que notre projet corresponde aux besoins de départ est la mise en place d'une pipeline de CI/CD.

> Pour l'exemple nous utiliserons [travis-ci](https://travis-ci.com/) mais vous pouvez utiliser la techno de votre choix.

Notre pipeline se chargera à chaque run
- d'initialiser notre projet Terraform sur le runner
- de valider la syntaxe de nos déclarations
- de vérifier le formatage de nos fichiers Terraform
- d'exécuter un plan des changements à apporter
- d'appliquer les changements

> L'application des changements ne devant être exécutée que dans le cas d'un merge sur la branche master.

Pour cela nous utilisons la configuration travis suivante

> Pensez à mettre à jour la version de Terraform dans la variable d'env globale `TERRAFORM_VERSION` en fonction de votre
> installation

```yml
language: generic
os: linux
version: ~> 1.0

env:
  global:
    - TERRAFORM_VERSION=0.12.24
    - TERRAFORM_PATH=$HOME/bin

before_install:
  - wget "https://releases.hashicorp.com/terraform/${TERRAFORM_VERSION}/terraform_${TERRAFORM_VERSION}_linux_amd64.zip" -O /tmp/terraform.zip

install:
  - unzip -d "${TERRAFORM_PATH}" /tmp/terraform.zip

before_script:
  - terraform init -input=false

script:
  - terraform validate
  - terraform fmt -check=true -diff
  - terraform plan -input=false -out=.terraform/tfplan

deploy:
  provider: script
  edge: true
  script: terraform apply -input=false .terraform/tfplan
  on:
    branch: master
```

## Conclusion
Vous avez maintenant toutes les clés pour gérer votre organisation Github en collaboratif et scalable, s'adaptant à la
taille de votre organisation. Un exemple de première Pull Request pour vos nouveaux collaborateurs pourrait être de
leurs faire gérer leur propre onboarding dans l'organisation.

Vous pouvez jeter un oeil à notre [repository](https://github.com/eleven-labs/github) pour voir un "real world example".
