---
lang: fr
date: 2023-10-25
slug: atomic-design
title: Atomic Design
categories:
    - javascript | design-system
authors:
    - iregaibi
---
Dans cet article, je vais vous présenter le concept d'Atomic Design en détaillant ses avantages et en fournissant des exemples concrets de cette approche. Je vais également aborder l'application de cette méthodologie en proposant des exemples d'utilisation.

## Qu'est ce que l'Atomic Design
Créée par Brad Frost en 2013, L'Atomic Design est tout d'abord une approche de conception de systemes d'interface utilisateur et de design d'interaction, plus communement appellés Design Systems.

L'approche de l'Atomic Design consiste à fractionner l'interface utilisateur en éléments modulaires, organisés en une hiérarchie allant des plus simples aux plus complexes: Atomes, Molécules, Organimes, Templates et Pages. Cette approche, qui s'inspire de la chimie, encourage à considérer l'interface comme un assemblage de modules réutilisables, offrant la possibilité de combiner ces éléments pour former des interfaces plus étendues. Ce processus favorise l'évolutivité, la flexibilité et l'uniformité dans la création et l'évolution des interfaces utilisateurs.

## Hierarchie des éléments
#### Atomes
Ici, nous allons classer les éléments les plus petits et indivisibles. Il s'agit généralement d'éléments HTML tels que des liens, des boutons, des champs de texte, des images, etc. On créera un composant distinct pour chacun de ces éléments atomiques. Les atomes sont par essence des composants abstraits et ne possèdent pas intrinsèquement une grande utilité.

Dans une approche purement axée sur l'interface utilisateur, on crée un atome distinct pour chaque spécificité. Ainsi, un bouton bleu est considéré comme un atome distinct de celui d'un bouton rouge. Cependant, dans une perspective de programmation, il est plus courant de créer un atome unique qui prend en compte des arguments pour faire évoluer ses attributs en fonction des besoins.

```jsx
// Atom - Button.tsx
const Button = ({ label, color, handleClick }) => (
  <button style={{ backgroundColor: color }} onClick={handleClick} >{label}</button>
);

export default Button;
```

#### Molécules
Comme en chimie, une molécule est composée d'un ensemble d'atomes qui forment les éléments de base de l'interface utilisateur. Par exemple, un composant SearchBar est composé de l'atome `Input` et de l'atome `Button`.

Si vous vous trouvez dans une situation où vous devez inclure un élément HTML dans une molécule, cela indique qu'un atome distinct doit être créé pour cet élément.

```jsx
// Molecule - SearchBar.tsx
import Button from './Atoms/Button';
import Input from './Atoms/Input';
import Label from './Atoms/Label';

const SearchBar = ({ searchBarLabel, searchBarInputPlaceholder, searchBarButtonProps }) => {

  // ❌ NOT TO DO
  /*return (
    <div>
      <Label content="Search in site" />
      <Input type="text" placeholder="Type your search" />
      <Button label="Search"  />
    </div>
  );*/

  // ✅ TO DO
  return (
    <div>
      <Label content={searchBarLabel} />
      <Input type="text" placeholder={searchBarInputPlaceholder} />
      <Button { ...searchBarButtonProps} />
    </div>
  );
}

export default SearchBar;
```

Dans cet exemple, le composant `SearchBar` prend en argument les propriétés `searchBarLabel`, `searchBarInputPlaceholder`, `searchBarButtonProps`, qu'il transmet respectivement aux atomes `Label`, `Input` et `Button`. L'erreur serait de fournir ces informations depuis ce niveau, car notre objectif est de maintenir nos composants aussi génériques que possible, sans inclure des spécificités à ce stade.

#### Organimes
Nous allons classer en tant qu'organisme des éléments complexes résultant de l'agrégation de plusieurs molécules, et éventuellement des atomes, formant ainsi des sections ou des fonctionnalités de l'interface.
Un organisme tel que `Header`, par exemple, peut typiquement contenir un atome `Logo`, une molécule `LinkList` qui génère une liste de liens, ainsi qu'une molécule `SearchBar`.

```jsx
// Organism - Header.tsx
import Logo from './Atoms/Logo';
import LinkList from './Molecules/Link';
import SearchBar from './Molecules/SearchBar';

// ✅ TO DO
const Header = ({ headerLinks, searchBarProps }) => {

  // ❌ NOT TO DO
  //const headerLinks = ['/home', '/about', '/contact'];

  return (
    <div>
      <Logo />
      <LinkList links={headerLinks} />
      <SearchBar {...searchBarProps} />
    </div>
  );
}

export default Header;
```

#### Templates
L'analogie chimique s'arrête ici. Un template est un modèle de page qui définit la mise en page globale de l'interface. Il peut intégrer tous les éléments mentionnés précédemment, cependant il est rare de retrouver des atomes à ce niveau là. Il sert de structure de base ou de squelette pour une page donnée, donc, à ce niveau, il ne contient toujours pas de contenu réel. Cette étape permet aussi de tester la résponsivité de l'ensemble des éléments que contient le template, et ce selon différents support d'affichage. Les templates apportent du contexte à tous ces organismes et molécules, qui sont relativement abstraits.

```jsx
// Templates - Home.tsx
import Header from './Organisms/Header';
import Footer from './Organisms/Footer';
import SideBar from './Organisms/SideBar';
import Banner from './Molecules/Banner';
import ArticlesList from './Molecules/ArticlesList';

const Home = ({ HeaderProps, SideBarProps, ArticlesListProps, FooterProps }) => {
    return (
      <div>
        <Header {...HeaderProps} />
        <SideBar {...SideBarProps} />
        <Banner />
        <ArticlesList {...ArticlesListProps} />
        <Footer {...FooterProps} />
      </div>
    );
}

export default Home;
```

D'un point de vue programmatique, il est également possible de créer un template générique capable d'inclure d'autres templates. C'est souvent le cas pour des parties d'interface présentes dans de nombreuses pages, telles que le Header, le Footer, le Menu, entre autres, qui composent un `AppTemplate`.

```jsx
// Templates - AppTemplate.tsx
import Header from './Organisms/Header';
import Footer from './Organisms/Footer';
import SideBar from './Organisms/SideBar';
import Banner from './Molecules/Banner';

const AppTemplate = ({ HeaderProps, SideBarProps, FooterProps, children }) => {
    return (
      <div>
        <Header {...HeaderProps} />
        <SideBar {...SideBarProps} />
        <Banner />
        {children}
        <Footer {...FooterProps} />
      </div>
    );
}

export default AppTemplate;
```

```jsx
// Templates - ArticlesTemplate.tsx
import ArticlesList from './Molecules/ArticlesList';

const ArticlesTemplate = ({ ArticlesListProps }) => {
    return (
      <AppTemplate>
          <ArticlesList {...ArticlesListProps} />
      </AppTemplate>
    );
}

export default ArticlesTemplate;
```

#### Pages
Nous nous trouvons au sommet de la hiérarchie atomique. Une page est en réalité un template rempli de contenu concret ; c'est la représentation finale de l'interface pour une page spécifique. C'est à ce stade que nous pouvons évaluer et remettre en question la conception d'une page, puis éventuellement revenir sur les atomes, molécules, organismes et templates pour corriger ou améliorer des éléments.

Un design system est conçu pour être dépourvu de contenu réel. Il est composé d'un ensemble de composants génériques et réutilisables, c'est pourquoi le stade de la page n'est généralement pas inclus dans ce système. À la place, cette étape est développée dans le projet qui utilise ce design system. C'est là que l'on peut rencontrer des appels réseau, des manipulations de données, ainsi que la construction des propriétés des composants créés précédemment.

```jsx
// Pages - Articles.tsx
import ArticlesTemplate from './Templates/ArticlesTemplate';
import ArticleType from './Types/Article';

const Articles = () => {
  const getLastTenArticles = (): ArticleType[] => {
    // Fetch - Get last 10 articles from database;
  }

  return (
    <ArticlesTemplate articles={getLastTenArticles()} />
  );
}

export default Articles;
```

## Pourquoi utiliser l'Atomic Design
Cette méthodologie vient formaliser et structurer ce qui était déjà pratiqué de manière consciente ou inconsciente. L'Atomic Design propose une approche méthodique et organisée pour concevoir des interfaces utilisateur. Elle présente plusieurs aspects positifs et avantages, que nous allons détailler.

- **Réutilisabilité des composants**
En fractionnant l'interface en éléments modulaires, l'Atomic design favorise la réutilisation de ces composants. Ces éléments sont concus pour être autonome et peuvent être utilisés de maniére cohérente à travers diverses parties de l'interface utilisateur, voire dans différents projets. En fin de compte, cela simplifie le processus de développement en réduisant la duplication de code.

