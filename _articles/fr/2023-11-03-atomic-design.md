---
contentType: article
lang: fr
date: 2023-11-03
slug: atomic-design
title: "Atomic Design : pour des interfaces modulaires et évolutives"
excerpt: Explorez l'approche de l'Atomic Design et ses bénéfices pour vos développements d'interfaces. Les principes de modularité, flexibilité et maintenabilité sont des éléments-clés pour vous guider vers le succès.
categories:
    - javascript
keywords:
    - design system
    - atomic design
    - modularité
    - react
    - frontend
authors:
    - iregaibi
---
Dans cet article, je vais vous présenter le concept d'Atomic Design en détaillant ses avantages et en fournissant des exemples concrets de cette approche. Je vais également aborder l'application de cette méthodologie en proposant des exemples d'utilisation, telle que pratiquée dans nos projets au sein du [Studio Eleven Labs](https://eleven-labs.com/conception-d-application), en utilisant la librairie Javascript React.

## Qu'est-ce que l'Atomic Design ?
Créé par Brad Frost en 2013, l'Atomic Design est tout d'abord une approche de conception de systèmes d'interface utilisateur et de design d'interaction. Son application peut être dédiée à la création d'un [Design System]({BASE_URL}/fr/pourquoi-creer-design-system/) ou à l'organisation de l'interface utilisateur d'un projet quel qu'il soit.

## Hiérarchie des éléments
L'approche de l'Atomic Design consiste à fractionner l'interface utilisateur en éléments modulaires, organisés en une hiérarchie allant des plus simples aux plus complexes : **Atomes**, **Molécules**, **Organismes**, **Templates** et **Pages**. On peut également trouver des éléments plus petits que les atomes, appelés **Design Tokens**. Cette approche, qui s'inspire de la chimie, encourage à considérer l'interface comme un assemblage de modules réutilisables, offrant la possibilité de combiner ces éléments pour former des interfaces plus étendues. Ce processus favorise l'évolutivité, la flexibilité et l'uniformité dans la création et l'évolution des interfaces utilisateurs.

![Hiérarchie Atomic Design]({BASE_URL}/imgs/articles/2023-11-03-atomic-design/atomic-design-hierarchie.png)
Figure: *Brad Frost - [Extending atomic design](https://bradfrost.com/blog/post/extending-atomic-design/)*

Les composants de la conception atomique peuvent être divisés en deux catégories distinctes. Les éléments les plus abstraits sont classés comme des éléments du "**Système**". Tandis que les éléments plus complexes, capables de contenir du contenu réel, sont qualifiés d'éléments du "**Produit**".

![System vs Product Atomic Design]({BASE_URL}/imgs/articles/2023-11-03-atomic-design/atomic-design-system-product.png)
Figure: *Brad Frost - [Extending atomic design](https://bradfrost.com/blog/post/extending-atomic-design/)*

### Les éléments du Système
Les éléments du système sont des composants abstraits qui n'ont aucune connaissance du contenu spécifique des applications. Par conséquent, ils peuvent être utilisés dans n'importe quel projet ou plateforme, ce qui les rend modulaires et réutilisables. C'est typiquement la catégorie de composants que l'on retouve dans un **[Design System]({BASE_URL}/fr/pourquoi-creer-design-system/)**.

<div class="admonition note" markdown="1"><p  class="admonition-title">Note</p>

Chaque composant du Système, décrit ci-dessous, doit être "**pur**" : sans aucune information associée au contenu réel, que ce soit dans son nom, qui doit être générique, ou dans sa capacité à gérer toutes les données reçues.
</div>

#### Design Tokens
Les Design Tokens sont les éléments visuels fondamentaux pour la création de n'importe quel composant. Ils incluent les couleurs, les tailles de police, les espacements, etc., stockés dans des variables et utilisés au sein des atomes ou des composants plus complexes. Un élément du Design Token n'a pas de fonctionnalité en soi, mais sert de base pour construire les composants, assurant ainsi une identité visuelle claire.

```tsx
// Design Tokens - color.tokens.ts

const colorTokens = {
  primary: "#285ADD",
  secondary: "#59B9F5",
  red: "#C64117",
  green: "#17864A",
};
```
`colorTokens` est définie comme une variable constante contenant les couleurs principales. Cette variable peut être utilisée de manière cohérente à travers différents composants pour assurer une uniformité dans l'apparence visuelle de l'interface.

```tsx
const MySection: React.FC = () => (
  <div style={{ backgroundColor: colorTokens.primary }}>
    lorem ipseum content
  </div>
);

export default MySection;
```

Pour approfondir le sujet, je vous invite à consulter notre article qui traite des [Design Tokens, leur utilisation et leur avantages]({BASE_URL}/fr/un-pont-entre-les-mondes-comment-les-design-tokens-facilitent-la-cooperation-entre-developpeurs-et-designers/).

#### Atomes
Ici, nous allons classer les éléments les plus petits et indivisibles. Il s'agit généralement d'éléments HTML tels que des liens, des boutons, des champs de texte, des images, etc. Un composant distinct sera créé pour chacun de ces éléments atomiques. Les atomes sont, par essence, des composants abstraits, véritablement utiles lorsqu'ils sont composés et assemblés à d'autres au sein d'un composant plus complexe.

Dans une approche purement axée sur l'interface utilisateur, on crée un atome distinct pour chaque spécificité. Ainsi, un bouton bleu est considéré comme un atome distinct de celui d'un bouton rouge. Cependant, dans une perspective de programmation, il est plus courant de créer un atome unique qui prend en compte des arguments pour faire évoluer ses attributs en fonction des besoins.

```tsx
// Atom - Button.tsx
export interface ButtonProps {
  label: string;
  color: 'primary' | 'secondary';
  handleClick: MouseEventHandler<HTMLButtonElement>;
}

const Button: React.FC<ButtonProps> = ({ label, color, handleClick }) => (
  <button style={{ backgroundColor: colorTokens.color }} onClick={handleClick} >{label}</button>
);

export default Button;
```

#### Molécules
Comme en chimie, une molécule est composée d'un ensemble d'atomes qui forment les éléments de base de l'interface utilisateur. Par exemple, un composant `SearchBar` est composé de l'atome `Input` et de l'atome `Button`.

```tsx
// Molecule - SearchBar.tsx
import Button, { ButtonProps } from './Atoms/Button';
import Input from './Atoms/Input';
import Label from './Atoms/Label';

export interface SearchBarProps {
  label: string;
  inputPlaceholder: string;
  buttonProps: ButtonProps;
}

const SearchBar: React.FC<SearchBarProps> = ({ label, inputPlaceholder, buttonProps }) => (
  <div>
    <Label content={label} />
    <Input type="text" placeholder={inputPlaceholder} />
    <Button { ...buttonProps} />
  </div>
);

export default SearchBar;
```
<div class="admonition danger" markdown="1"><p  class="admonition-title">Attention</p>

- Une molécule ne doit être composée que d'atomes.
- Si vous êtes confronté à la nécessité d'incorporer un élément HTML dans une molécule, cela indique qu'il est nécessaire de créer un atome distinct pour cet élément. Aucun élément HTML ne doit exister au-delà des atomes.
</div>

#### Organismes
Nous allons classer en tant qu'organisme les éléments complexes résultant de l'agrégation de plusieurs molécules, et éventuellement des atomes, formant ainsi des sections ou des fonctionnalités de l'interface.
Un organisme tel que `Header`, par exemple, peut typiquement contenir un atome `Logo`, une molécule `LinkList` qui génère une liste de liens, ainsi qu'une molécule `SearchBar`.

```tsx
// Organism - Header.tsx
import Logo from './Atoms/Logo';
import LinkList from './Molecules/Link';
import SearchBar, { SearchBarProps } from './Molecules/SearchBar';

export interface HeaderProps {
    headerLinks: string[];
    searchBarProps: SearchBarProps;
}

const Header: React.FC<HeaderProps> = ({ headerLinks, searchBarProps }) => (
  <div>
    <Logo />
    <LinkList links={headerLinks} />
    <SearchBar {...searchBarProps} />
  </div>
);

export default Header;
```

### Les éléments du Produit
Les éléments du Produit constituent la catégorie où l'on spécifie et alimente nos composants du Système avec des données réelles. C'est là que nous effectuons des manipulations de données pour ensuite les fournir en propriété des composants du Design System.

#### Templates
L'analogie chimique s'arrête ici. Un template est un modèle de page qui définit la mise en page globale de l'interface. Il peut intégrer tous les éléments mentionnés précédemment, cependant il est rare de retrouver des atomes à ce niveau-là. Il sert de structure de base ou de squelette pour une page donnée, donc, à ce niveau, il ne contient toujours pas de contenu réel. Cette étape permet aussi de tester l'adaptabilité de l'ensemble des éléments que contient le template sur différents supports d'affichage. Les templates apportent du contexte à tous ces organismes et molécules, qui sont relativement abstraits. Le template est au niveau des éléments du Produit, car la page est spécifique à une fonctionnalité, et cette fonctionnalité n'est plus globale et ne répond plus aux critères d'un élément du Système, qui se doit d'être générique et réutilisable.

```tsx
// Templates - HomeTemplate.tsx
import Header, { HeaderProps } from './Organisms/Header';
import Footer, { FooterProps } from './Organisms/Footer';
import SideBar, { SideBarProps } from './Organisms/SideBar';
import Banner, { BannerProps } from './Molecules/Banner';
import ArticlesList, { ArticlesListProps } from './Molecules/ArticlesList';

export interface HomePageProps {
    headerProps: HeaderProps;
    footerProps: FooterProps;
    sideBarProps: SideBarProps;
    bannerProps: BannerProps;
    articlesListProps: ArticlesListProps;
}

const HomeTemplate: React.FC<HomePageProps> = ({ headerProps, sideBarProps, articlesListProps, footerProps }) => (
    <div>
        <Header {...headerProps} />
        <SideBar {...sideBarProps} />
        <Banner {...bannerProps } />
        <ArticlesList {...articlesListProps} />
        <Footer {...footerProps} />
    </div>
);

export default HomeTemplate;
```

Il est également possible qu'un template soit composé d'autres templates. C'est souvent le cas pour des parties de l'interface présentes dans de nombreuses pages, telles que le Header, le Footer, le Menu, entre autres, qui composent un AppTemplate. Dans ce cas, il est commun de retrouver, à ce stade, des spécificités du produit final.

```tsx
// Templates - AppTemplate.tsx
import Header from './Organisms/Header';
import Footer from './Organisms/Footer';
import SideBar from './Organisms/SideBar';
import Banner from './Molecules/Banner';

const AppTemplate: React.FC = ({ children }) => {
    const headerLinks = ['/home', '/blog', '/contact'];
    const sideBarElements = {
      // Objet contenant les entrée de la navigation
    };
    const footerElements = {
        // Object contenant les éléments à afficher dans le footer
    }

    return (
        <div>
            <Header links={headerLinks} />
            <SideBar menus={sideBarElements} />
            {children}
            <Footer {...footerElements} />
        </div>
    );
}

export default AppTemplate;
```

```tsx
// Templates - ArticlesTemplate.tsx
import ArticlesList from './Molecules/ArticlesList';

export interface ArticleTemplateProps {
    articlesListProps: ArticlesListProps;
}

const ArticlesTemplate: React.FC<ArticleTemplateProps> = ({ articlesListProps }) => {
    return (
        <AppTemplate>
            <ArticlesList {...ArticlesListProps} />
        </AppTemplate>
    );
}

export default ArticlesTemplate;
```

<div class="admonition note" markdown="1"><p  class="admonition-title">Note</p>

Comme vous le voyez ci-dessus, un template peut être composé d'autres templates. En revanche, tous les autres composants définis précédemment ne peuvent pas être composés du même type de composant.
</div>

#### Pages
Nous nous trouvons au sommet de la hiérarchie atomique. Une page est en réalité un template rempli de contenu concret. C'est la représentation finale de l'interface pour une page spécifique. C'est à ce stade que nous pouvons évaluer et remettre en question la conception d'une page, puis éventuellement revenir sur les atomes, molécules, organismes et templates pour corriger ou améliorer des éléments.

<div class="admonition danger" markdown="1"><p  class="admonition-title">Attention</p>

Ce n'est qu'au niveau des Pages que les appels réseau peuvent être présents, et non pas au niveau des éléments évoqués précédemment.
</div>

```tsx
// Pages - Articles.tsx
import ArticlesTemplate from './Templates/ArticlesTemplate';
import ArticleType from './Types/Article';

const Articles: React.FC = () => {
    const getLastTenArticles = (): ArticleType[] => {
        // Fetch - Get last 10 articles from database;
    }

    return (
        <ArticlesTemplate articles={getLastTenArticles()} />
    );
}

export default Articles;
```

![Abstrait vers Concret Atomic Design]({BASE_URL}/imgs/articles/2023-11-03-atomic-design/atomic-design-abstract-concrete.png)
Figure: *Brad Frost - [Atomic Design Methodology - Chapter 2](https://atomicdesign.bradfrost.com/chapter-2)*

<div class="admonition summary" markdown="1"><p  class="admonition-title">En résumé</p>

La hiérarchie de l'Atomic Design repose sur la transition des petits composants abstraits vers la construction de composants plus complexes et concrets.
</div>

![Résumé Atomic Design]({BASE_URL}/imgs/articles/2023-11-03-atomic-design/atomic-design-final.png)
Figure: *Brad Frost - [Atomic Design Methodology - Chapter 2](https://atomicdesign.bradfrost.com/chapter-2)*

## Pourquoi utiliser l'Atomic Design
Cette méthodologie vient formaliser et structurer ce qui était déjà pratiqué de manière consciente ou inconsciente. L'Atomic Design propose une approche méthodique et organisée pour concevoir des interfaces utilisateur. Elle présente plusieurs aspects positifs et avantages, que nous allons détailler.

- **Réutilisabilité des composants**\
  En fractionnant l'interface en éléments modulaires, l'Atomic Design favorise la réutilisation de ces composants. Ces éléments sont conçus pour être autonomes et peuvent être utilisés de manière cohérente à travers diverses parties de l'interface utilisateur, voire dans différents projets. En fin de compte, cela simplifie le processus de développement en réduisant la duplication de code.


- **Scalabilité et évolutivité**\
  Lorsque de nouveaux besoins fonctionnels ou de design se présentent, il est simple d'ajouter de nouveaux composants ou de construire de nouvelles combinaisons, que ce soit avec les composants existants ou ceux nouvellement créés. Tout cela se fait sans avoir à reconstruire tout le système ou à modifier l'existant. Cela permet aussi de réduire les regressions au niveau des composants existants.


- **Facilité de maintenance**\
  La structuration atomique permet une meilleure maintenabilité, que ce soit en terme de code qu'en terme comportemental des composants et du design. Étant des composants totalement indépendants les uns des autres, la correction de ceux-ci est simplifiée et n'affecte pas le reste de l'application et de l'interface.


- **Tests et déboggage simplifié**\
  Les composants étant isolés, les tests unitaires et le deboggage sont beaucoup mieux ciblés et efficaces, puisque chacun des composants peut être testé séparément. Cela facilite l'identification des bugs et leur résolution.


- **Collaboration facilitée entre équipes**\
  L'Atomic Design crée un langage commun entre les designers et les développeurs. En utilisant les mêmes termes pour décrire les composants et leur hiérarchie, cela facilite et fluidifie la communication et la compréhension entre les équipes lors de la création et de l'implémentation du design.

## Conclusion
En adoptant le concept de l'Atomic Design, vous introduisez des principes fondamentaux tels que la modularité, la facilité de maintenance et la collaboration. Cela entraîne une nette amélioration de la productivité et de la rapidité dans la mise en place du design. Réduire les risques d'erreurs et assurer une évolution constante et cohérente des éléments sont d'autres avantages qui renforceront l'image de votre marque.

Au sein du [Studio Eleven Labs](https://eleven-labs.com/nos-publications/donnez-une-nouvelle-dimension-a-votre-equipe-produit), nous appliquons l'Atomic Design pour élaborer des [Design System]({BASE_URL}/fr/pourquoi-creer-design-system/) destinés à nos projets internes et à nos clients. Cette approche nous a permis de tirer parti de tous les bénéfices mentionnés dans cet article.
