---
contentType: article
lang: fr
date: '2020-05-20'
slug: vous-utilisez-mal-les-states-react
title: Vous utilisez mal les states React
excerpt: >-
  Vous n'utilisez peut-être pas les states React de manière optimale et je vais
  vous expliquer pourquoi
categories:
  - javascript
authors:
  - kcordier
keywords:
  - react
  - images
  - state
  - reducer
  - bonne pratique
---

Derrière ce titre à l’allure aguicheuse se cache un constat que je fais de plus en plus. Remettons-nous dans le contexte :
Vous êtes jeune et fou, vous venez de découvrir React et avez fait le tuto. Votre morpion est tout beau et vous vous lancez dans votre première one-page application. Votre code a plein d’**états** et quand vous cliquez sur des boutons ça bouge dans tous les sens comme un feu d’artifice. Je regarde votre code et je vous dis :

\- _À vrai dire… c’est pas comme ça que j’aurais fait._

Et c’est normal. C’est en faisant des erreurs que l’on apprend et cet article est là pour répertorier la plupart des erreurs de débutant que j’ai pu voir (et faire) de l’utilisation des **states** React.

## Définition

Un **état** (ou **state** dans la langue de Shakespeare) est un ensemble de variables qui définit un composant à un instant T. En React, le changement d’un **state** résulte automatiquement par le re-render du composant où a été déclaré l’**état**.

Maintenant que nous avons rappelé les bases, regardons maintenant ce qui est bien et ce qui ne l'est pas.

![]({BASE_URL}/imgs/articles/2020-05-20-vous-utilisez-mal-les-states/bien-pas-bien.gif)

## Tu ne muteras point ton état

Bon, comme expliqué dans l’introduction, si vous avez fait le tutoriel sur le site de React alors vous avez déjà entendu parler de l’**immutabilité**. Cette règle si importante est pourtant souvent oubliée par la plupart des développeurs, ce qui mène alors leurs projets vers les pires bugs imaginables.

L'**immutabilité** est par définition la capacité à ne pas être modifié. Et s'il y a bien une chose que les **états** de votre application doivent être, c’est **immutable**.

\- _Mais si on ne change pas l'**état** des composants, notre application n’est plus qu’un site statique sans saveur._

Ne me faites pas dire ce que je n’ai pas dit. Vous pouvez modifier les **states** de vos composant, mais pas directement. La bonne pratique est de créer un nouvel objet correspondant à votre prochain **état**.

Utiliser l’immutabilité permet de considérablement aider React à détecter les modifications d’**état** (ça marche aussi très bien avec les props, mais là n’est pas la question). Car qui dit nouvel objet dit nouvelle référence, et la différence de ref entre les **états** A et B est plus facile à comparer que toutes les propriétés une par une.

### Pas bien

```jsx
const UnComposant = () => {
  const [object, setObject] = useState({
    name: 'MacGuffin',
    click: 0,
  });

  const handleClick = () => {
    object.click = object.click + 1;
    setObject(object);
  };

  return <div onClick={handleClick}>{object.click}</div>;
};
```

### Bien

```jsx
const UnComposant = () => {
  const [object, setObject] = useState({
    name: 'MacGuffin',
    click: 0,
  });

  const handleClick = () => {
    setObject({ ...object, click: object.click + 1 });
  };

  return <div onClick={handleClick}>{object.click}</div>;
};
```

Ici on crée un nouvel objet grâce à la syntaxe ES2018, avant de l’envoyer au setObject.

## Tu changeras ton état

\- _Bon le mec dit tout et son contraire._

Oui mais si je vous dis ca, c’est pour vous rappeler qu’un **état** est par définition voué à évoluer. Donc si votre but est d’avoir des informations qui ne changent pas dans le temps alors utilisez plutôt des **constants**. C’est plus léger et facile à comprendre.

### Pas bien

```jsx
const UnComposant = () => {
  const [valeur, setValeur] = useState('Valeur qui ne changera pas');

  return <div>{valeur}</div>;
};
```

### Bien

```jsx
const UnComposant = () => {
  const valeur = 'Valeur qui ne changera pas';

  return <div>{valeur}</div>;
};
```

C’est peut être bête de le rappeler mais pour l’avoir vu, il fallait que j’en parle.

## Tu ne changeras qu’un état à la fois

Dans la vie il arrive que l’on ait plusieurs **états** au sein d’un même composant. En soi ce n’est pas une erreur, le problème vient surtout dans le cas où l’on doit mettre à jour 2 **states** en même temps. Comme revu dans la définition, chaque changement d’**état** re-render le composant et donc tout le life cycle. Vous comprenez donc qu’il ne faut pas corréler vos changements de **states**, sous peine d’avoir plusieurs renders en parallèle, et d'engendrer des bugs de synchronisation entre 2 **états**.

Pour résoudre ce souci, 2 solutions s'offrent à nous :

Tout rassembler dans un même **state**, c’est la manière rapide où l’on crée un objet fourre-tout avec la totalité des variables du composant. C’est pas esthétique, pas pratique et très lourd.

Ou... utiliser un **reducer**. Cela permet de gérer des transitions d’**états** complexes, en mappant les différentes actions à un identifiant de transition. Cela permet de mieux maîtriser les renders de vos composants et c’est en général conseillé quand on utilise des objets en **state**.

### Pas bien

```jsx
const UnComposant = () => {
  const [object, setObject] = useState({
    name: 'MacGuffin',
    click: 0,
  });
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);

    generateName().then((newName) => {
      setObject({ ...object, name: newName });
      setLoading(false);
    });
  };

  return loading? <Loader /> : <div onClick={handleClick}>{object.name}</div>;
};
```

### Bien

```jsx
function reducer(state, action) {
  switch (action.type) {
    case 'startGenerateName':
      return { ...state, loading: true };
    case 'endGenerateName':
      return { ...state, name: action.newName, loading: false };
    default:
      throw new Error();
  }
}

const UnComposant = () => {
  const [{ loading, name }, dispatch] = useReducer(reducer, {
    name: 'MacGuffin',
    click: 0,
    loading: false,
  });

  const handleClick = () => {
    dispatch({ type: 'startGenerateName' });

    generateName().then((newName) => {
      dispatch({ type: 'endGenerateName', newName });
    });
  };

  return loading? <Loader /> : <div onClick={handleClick}>{name}</div>;
};
```

Dans cet exemple le changement d'**état** est bien identifiable et assure qu'il y ait un seul render.

## Tu redistribueras tes états

Une erreur très répandue est de mal gérer où déclarer ses **états**. Par exemple, tout mettre sans réfléchir dans le parent afin d’avoir uniquement des pure components. Cela résulte souvent par un composant parent très lourd qui re-render toujours la totalité des composants enfants. Ici il n’y a pas de solution toute prête, le seul conseil est de faire remonter l’**état** partagé dans leur ancêtre **commun le plus proche** et de faire redescendre les données dans les composants enfants. Par contre il existe une manière plus élégante de passer les fonctions de callback de parent à enfant :

```jsx
function reducer(state, action) {
  switch (action.type) {
    case 'startGenerateName':
      return { ...state, loading: true };
    case 'endGenerateName':
      return { ...state, name: action.newName, loading: false };
    default:
      throw new Error();
  }
}

const ObjectDispatch = React.createContext(null);

const ComposantParent = () => {
  const [{ loading, name }, dispatch] = useReducer(reducer, {
    name: 'MacGuffin',
    click: 0,
    loading: false,
  });

  return (
    <ObjectDispatch.Provider value={dispatch}>
      <ComposantEnfant name={name} loading={loading} />
    </ObjectDispatch.Provider>
  );
};

const ComposantEnfant = ({ name, loading }) => {
  const dispatch = useContext(ObjectDispatch);

  const handleClick = () => {
    dispatch({ type: 'startGenerateName' });

    generateName().then((newName) => {
      dispatch({ type: 'endGenerateName', newName });
    });
  };

  return loading? <Loader /> : <div onClick={handleClick}>{name}</div>;
};
```

## Tu utiliseras les états quand il le faudra

La plus grosse erreur qu’il m'ait été donné de voir est celle de croire que les **states** sont la seule manière de garder en mémoire une donnée entre chaque changement d’**état**. Il existe un autre élément de React qui est persistant malgré les changement d’**états** et que peu de développeurs utilisent, c’est les **références**. Elles permettent en plus de garder en mémoire des variables que l’on souhaite modifier sans pour autant vouloir re-render le composant.

### Pas bien

```jsx
const UnComposant = () => {
  const [object, setObject] = useState({
    name: 'MacGuffin',
    click: 0,
  });

  const [nombreDeClique, setNombreDeClique] = useState(0);

  const handleClick = () => {
    if (nombreDeClique + 1 % 10 === 0) {
      generateName().then((newName) => {
        setObject({ ...object, name: newName });
      });
    }
    setNombreDeClique(nombreDeClique + 1);
  };

  return <div onClick={handleClick}>{object.name}</div>;
};
```

### Bien

```jsx
const UnComposant = () => {
  const [object, setObject] = useState({
    name: 'MacGuffin',
    click: 0,
  });
  const nombreDeClique = useRef(0);

  const handleClick = () => {
    nombreDeClique.current++;
    if (nombreDeClique.current % 10 === 0) {
      generateName().then((newName) => {
        setObject({ ...object, name: newName });
      });
    }
  };

  return <div onClick={handleClick}>{object.name}</div>;
};
```
Ici on souhaite réaliser une action tous les 10 clics, sans avoir render le composant tous les clics.

Un autre cas de mauvaise utilisation des **états** est son utilisation pour les animations. La plupart des animations peuvent être réalisées uniquement en CSS et ne demandent pas de calcul de position dans des setInterval comme j’ai pu le voir.

### Pas bien

```jsx
const UnComposant = () => {
  const [top, setTop] = useState(0);

  useEffect(() => {
    setInterval(() => {
      if (top < 1000) {
        setTop(top - 10);
      }
    }, 100);
  }, []);


  return <div style={{top: top+'px'}}>Je descend en bas</div>;
};
```

### Bien

```css
.div-qui-dessend {
   animation: 10s descendEnBas;

}
@keyframes descendEnBas {
  from { top: 0; }
  to   { top: 1000px; }
}
```
```jsx
const UnComposant = () => (<div className="div-qui-dessend">Je descend en bas</div>);
```
Dans cet exemple nous avons déchargé la responsabilité de l’animation au CSS, qui est beaucoup plus optimisé pour ce genre de travaux.

## Conclusion
Avec ces petits exemples, j'espère vous avoir appris quelques bonnes pratiques ou vous avoir ouvert les yeux sur des erreurs que vous avez pu faire.

La plupart des problèmes soulignés dans cet article sont pas mal répandus car ils ne sont pas traités directement dans la documentation de React, il n'y a donc aucune honte à commettre ce genre de maladresses ;)

Et n'oubliez pas que, faire ce type d’erreurs n’est pas tabou, et qu'on en viendra tous à bout !
