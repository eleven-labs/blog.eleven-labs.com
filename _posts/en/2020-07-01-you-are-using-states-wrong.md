---
lang: en
date: '2020-07-01'
slug: you-are-using-react-states-wrong
title: You are using React states wrong
excerpt: You may not be using the React states optimally and I'll explain why
authors:
  - marishka
categories:
  - javascript
keywords:
  - react
  - images
  - state
  - reducer
  - best practice
---

Behind this seductive-looking title hides an observation that I have been making more and more. Let's put things into context:
You are young and crazy, you just discovered React and did the tutorial. Your tic-tac-toe is all beautiful and you are beginning to work on your first single page application. Your code has lots of **states** and when you click on buttons things move all over the place like fireworks. I look at your code and I am telling you:

\- _Truth be told... that's not how I would have done it._

And that’s normal. It is by making mistakes that you learn and this article is here to list most of the beginner mistakes that I have seen (and made) when using React **states**.

## Definition

A **state** is a set of variables which defines a component at a given time. In React, the change of a **state** results automatically by the re-render of the component where the **state** was declared.

Now that we've gone over the basics, let's take a look at what's good and what's not.

![]({{ site.baseurl }}/assets/2020-05-20-vous-utilisez-mal-les-states/bien-pas-bien.gif)

## You will not mutate your state

Okay, as explained in the introduction, if you did the tutorial on the React site then you've already heard of **immutability**. This important rule is however often forgotten by most developers, which then leads their projects to the worst bugs imaginable.

**Immutability** is by definition the ability to remain unchanged. And if there is one thing that the **states** of your application should be, it is **immutable**.

\- _But if we do not change the **state** of the components, our application is nothing more than a static site without flavor._

Don't make me say what I didn't say. You can modify the **states** of your components, but not directly. It is good practice to create a new object corresponding to your next **state**.

Using immutability can greatly help React to detect **state** changes (it also works great with props, but that's not the issue). Because who says new object says new reference, and the difference in ref between **states** A and B is easier to compare than all the properties one by one.

### Not good

```jsx
const AComponent = () => {
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

### Good

```jsx
const AComponent = () => {
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

Here we create a new object using the ES2018 syntax, before sending it to `setObject`.

## You will change your state

\- _Well the guy says everything and its opposite._

Yes but if I tell you that, it is to remind you that a **state** is by definition designed to evolve. So if your goal is to have information that does not change over time, then use **constants** instead. It's lighter and easier to understand.

### Not good

```jsx
const AComponent = () => {
  const [value, setValue] = useState('Value that will not change');

  return <div>{value}</div>;
};
```

### Good

```jsx
const AComponent = () => {
  const value = 'Value that will not change';

  return <div>{value}</div>;
};
```

It may be silly to remind you of this, but I have seen it and I had to mention it.

## You will only change one state at a time

In life it sometimes happens that there are several **states** within the same component. In itself this is not an error, the problem comes especially in the case where one must update 2 **states** at the same time. As reviewed in the definition, each change of **state** re-renders the component and therefore the entire life cycle. You therefore understand that you should not correlate your **states** changes, otherwise you will have several re-renders in parallel, and generate synchronization bugs between 2 **states**.

To solve this issue, 2 solutions are available to us:

Putting it all together in one **state** is the quick way to create a catch-all object with all of the component's variables. It’s not aesthetic, not practical and very heavy.

Or... use a **reducer**. This makes it possible to manage transitions of complex **states**, by mapping the different actions to a transition identifier. This allows you to better control the renders of your components and it is generally recommended when using objects in a **state**.

### Not good

```jsx
const AComponent = () => {
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

### Good

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

const AComponent = () => {
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

In this example the change of **state** is clearly identifiable and ensures that there is only one render.

## You will redistribute your states

A very common mistake is to mismanage where to declare your **states**. For example, putting everything without thinking in the parent in order to have only pure components. This often results in a very heavy parent component which always re-renders all of the child components. Here there is no ready-made solution, the only advice is to trace back the shared **state** to their **closest common ancestor** and to bring the data down into the child components. However, there is a more elegant way of passing the callback functions from parent to child:

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

const ParentComponent = () => {
  const [{ loading, name }, dispatch] = useReducer(reducer, {
    name: 'MacGuffin',
    click: 0,
    loading: false,
  });

  return (
    <ObjectDispatch.Provider value={dispatch}>
      <ChildComponent name={name} loading={loading} />
    </ObjectDispatch.Provider>
  );
};

const ChildComponent = ({ name, loading }) => {
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

## You will use the states when necessary

The biggest mistake I've ever seen is to believe that **states** are the only way to keep data in memory between each **state** change. There is another element of React that is persistent despite the change of **states** and that few developers use, it is the **references**. They also allow you to keep in memory variables that you want to modify without wanting to re-render the component.

### Not good

```jsx
const AComponent = () => {
  const [object, setObject] = useState({
    name: 'MacGuffin',
    click: 0,
  });

  const [numberOfClics, setNumberOfClics] = useState(0);

  const handleClick = () => {
    if (numberOfClics + 1 % 10 === 0) {
      generateName().then((newName) => {
        setObject({ ...object, name: newName });
      });
    }
    setNumberOfClics(numberOfClics + 1);
  };

  return <div onClick={handleClick}>{object.name}</div>;
};
```

### Good

```jsx
const AComponent = () => {
  const [object, setObject] = useState({
    name: 'MacGuffin',
    click: 0,
  });
  const numberOfClics = useRef(0);

  const handleClick = () => {
    numberOfClics.current++;
    if (numberOfClics.current % 10 === 0) {
      generateName().then((newName) => {
        setObject({ ...object, name: newName });
      });
    }
  };

  return <div onClick={handleClick}>{object.name}</div>;
};
```
Here we want to perform an action every 10 clicks, without having to re-render the component on every click.

Another case of misuse of **states** is its use for animations. Most animations can be done with just some CSS and do not require position calculation in `setInterval` as I have seen.

### Not good

{% raw %}
```jsx
const AComponent = () => {
  const [top, setTop] = useState(0);

  useEffect(() => {
    setInterval(() => {
      if (top < 1000) {
        setTop(top - 10);
      }
    }, 100);
  }, []);


  return <div style={{top: top+'px'}}>I am scrolling down</div>;
};
```
{% endraw %}

### Good

```css
.div-scroll-down {
   animation: 10s scrollDown;
}
@keyframes scrollDown {
  from { top: 0; }
  to   { top: 1000px; }
}
```
```jsx
const AComponent = () => (<div className="div-scroll-down">I am scrolling down</div>);
```
In this example we have transferred the responsibility of animation to CSS, which is much more optimized for this kind of work.

## Conclusion
With these small examples, I hope I have taught you some good practices or opened your eyes to mistakes you may have made.

Most of the issues highlighted in this article are pretty widespread as they are not dealt with directly in the React documentation, so there is no shame in committing this kind of blunder ;)
