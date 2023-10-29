---
contentType: article
lang: fr
date: '2019-05-16'
slug: prise-en-main-vim-php
title: Prise en main de VIM configuré pour PHP
excerpt: Prenez en main cet éditeur de texte universel et léger pour votre projet web !
categories:
  - php
authors:
  - pvermeil
keywords:
  - linux
  - macos
  - vim
---

 ![]({BASE_URL}/imgs/articles/2019-05-06-prise-en-main-vim-php/vim-logo-en.png)

## Vim, c'est quoi ?

Vim, derrière ce nom obscur se cache un éditeur de texte puissant en mode terminal. Pas besoin d'environnement graphique pour s'en servir.

Vim est un ancêtre parmi les éditeurs de texte. Il dérive de Vi, un éditeur écrit à l'époque où les systèmes d'exploitations graphiques n'existaient pas. Il s'est progressivement étoffé avec la coloration syntaxique et un langage qui lui est propre, VimScript, qui permet de le personnaliser pour en faire un vrai IDE.

## Quel intérêt en 2019 ?

Il y en a plusieurs :
* **Vim est très léger :** il n'a pas besoin d'environnement graphique et n'indexe pas tout votre projet au lancement. Il peut tourner sur une vieille machine.
* **Vim est partout :** sur tous les systèmes UNIX-like (distros Linux, MacOS, BSD), Vim est disponible. Il y a aussi une version Windows. Cela signifie qu'il est présent sur la plupart des serveurs distants pour vos manipulations.
* **Vim est productif** , dans un premier temps cependant, l'apprentissage demande un peu de persévérance. Il permet de lancer des commandes sur votre shell sans même changer de fenêtre, et sans la lourdeur des IDE. Une idée clé de Vim est de développer sans toucher la souris.

## Guide rapide des modes de Vim

 ![]({BASE_URL}/imgs/articles/2019-05-06-prise-en-main-vim-php/vim-modes.png)

Vous avez ouvert Vim sans terminer ce tuto et vous aimeriez savoir comment commencer à naviguer ? Voici quelques commandes.

Touches | Action
--- | ---
:q | Quitter
:w | Write (sauver)
:[command]! | Forcer la commande [command]
[I] | mode Insert
[Esc] | revenir au mode Normal
[V] | mode Visuel (sélection de texte)
/[expression] | rechercher [Expression] dans le fichier. Suivant [N], précédent [Maj]+[N].
:![cmd] | passer la commande [cmd] au shell
H / J / K / L | gauche / bas / haut / droite

Les commandes sont à lancer depuis le mode Normal. Il est possible de combiner des commandes, comme :
```
:wq!
```
Pour écrire le fichier puis forcer Vim à se fermer. Pour approfondir les commandes de bases et savoir comment éditer, remplacer, etc vous pouvez installer et lancer vimtutor :
```
sudo apt install vimtutor
```

## Configuration de base

### .vimrc minimal pour gens pressés

Ce .vimrc activera la coloration syntaxique, les numéros de ligne, activera la souris, le retour automatique à la ligne et une indentation correcte. .vimrc est situé dans ~ (votre dossier personnel). C'est un fichier caché. Ouvrez-le avec vim :

```
sudo vi ~/.vimrc
```

Ajoutez-y ces lignes :

```
set nocompatible
syntax on
filetype plugin indent on
set mouse=a
set number
set laststatus=2 ignorecase smartcase hlsearch incsearch

" show existing tab with 4 spaces width
set tabstop=4
" soft tab width
set softtabstop=4
set shiftwidth=4
" 4 spaces tab
set expandtab

autocmd BufNewFile,BufRead *.ezt set filetype=html

" Vanilla key remapping PREVIOUS - NEXT
:nnoremap <C-n> :bnext<CR>
:nnoremap <C-p> :bprevious<CR>

" indentation made from visual mode
set smartindent
```

### Le gestionnaire de plugins Pathogen

Installez Pathogen à l'aide de la commande suivante :
```
mkdir -p ~/.vim/autoload ~/.vim/bundle && curl -LSso ~/.vim/autoload/pathogen.vim https://tpo.pe/pathogen.vim
```

### NERDtree, voir l'arborescence du dossier

 ![]({BASE_URL}/imgs/articles/2019-05-06-prise-en-main-vim-php/nerdtree.png)

Si vous ne deviez installer qu'un plugin, ce serait celui-là ! A tout moment vous saurez où vous vous situez. Installation :

```
cd ~/.vim/bundles
git clone https://github.com/scrooloose/nerdtree.git ~/.vim/bundle/nerdtree
```

Rendez-vous ensuite dans votre .vimrc, situé sous ~/.vimrc (Debian / Ubuntu), et ajoutez :

```
"NERDtree auto refresh on file save
autocmd BufWritePost * NERDTreeFocus | execute 'normal R' | wincmd p
let NERDTreeShowHidden=1

" Close NERDtree if last buffer
autocmd bufenter * if (winnr("$") == 1 && exists("b:NERDTree")) | q | endif
```

Relancez Vim et admirez ! Pour passer de l'éditeur à NERDtree et vice-versa, il suffit de presser deux fois [W] en mode Normal. Lorsque votre curseur est sur un dossier ou fichier, appuyez sur [M] pour voir les actions disponibles.

### YouCompleteMe, l'autocomplétion

 ![]({BASE_URL}/imgs/articles/2019-05-06-prise-en-main-vim-php/ycm.jpg)

Ce plugin fournit une autocomplétion basique s'appuyant sur ce que vous avez déjà saisi. Avant d'éditer .vimrc, lancez :

```
sudo apt-get install vim-gui-common
sudo apt-get install vim-runtime

# Install YCM
sudo apt install build-essential cmake python3-dev python2.7-dev
cd ~/.vim/bundle && git clone https://github.com/Valloric/YouCompleteMe

cd ~/.vim/bundle/YouCompleteMe
git submodule update --init --recursive
python3 install.py
```

Ensuite éditez le .vimrc avec ces lignes :

Pour plus d'informations sur YCM, regardez <a href="https://github.com/Valloric/YouCompleteMe">la doc de son créateur !</a>

### Améliorer la status bar avec Lightline

 ![]({BASE_URL}/imgs/articles/2019-05-06-prise-en-main-vim-php/powerline.png)

Dans votre shell :
```
git clone https://github.com/itchyny/lightline.vim ~/.vim/bundle/lightline.vim
```
Puis dans votre .vimrc, pour afficher la branche en cours :
```
" Display Git branch in status bar
let g:lightline = {
      \ 'active': {
      \   'left': [ [ 'mode', 'paste' ],
      \             [ 'gitbranch', 'readonly', 'filename', 'modified' ] ]
      \ },
      \ 'component_function': {
      \   'gitbranch': 'gitbranch#name'
      \ },
      \ }

```

## Aller plus loin : une conf pour PHP

### PHPComplete et CTags

Dans votre shell, occupez-vous d'abord de ctags :

```
curl -Ss http://vim-php.com/phpctags/install/phpctags.phar > phpctags
cd your-project-folder
php ./phpctags
ctags -R --fields=+aimlS --languages=php
```

Toujours dans votre shell, vous pouvez aussi installer Gutentags pour gérer l'indexation/complétion "intelligente" du projet :

```
cd ~/.vim/bundle
git clone https://github.com/ludovicchabant/vim-gutentags.git
```

Installez le plugin PhpComplete :

```
cd ~/.vim/bundle
git clone git://github.com/shawncplus/phpcomplete.vim.git
```

Puis éditer .vimrc :
```
set omnifunc=syntaxcomplete#Complete
autocmd FileType php setlocal omnifunc=phpcomplete#CompletePHP
" setup vim tag file
set tags=tags;/

augroup MyGutentagsStatusLineRefresher
    autocmd!
    autocmd User GutentagsUpdating call lightline#update()
    autocmd User GutentagsUpdated call lightline#update()
augroup END

```

### Support de twig

Dans votre shell, saisissez :
```
cd ~/.vim/bundle/
git clone https://github.com/evidens/vim-twig.git
```
Et c'est fait !

## Le mot de la fin

N'hésitez pas à parcourir le site <a href="https://vimawesome.com/">Vimawesome</a> qui est une référence pour trouver des plugins adaptés à votre contexte de travail. Ce tutoriel utilise Pathogen comme gestionnaire de plugins.
