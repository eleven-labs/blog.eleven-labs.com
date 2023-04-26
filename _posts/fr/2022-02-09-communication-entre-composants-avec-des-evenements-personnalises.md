---
lang: fr
date: '2022-02-09'
slug: communication-entre-composants-avec-des-evenements-personnalises
title: Communication entre composants avec des événements personnalisés
excerpt: >-
  Besoin de travailler avec différents Framework JS et donc de faire communiquer
  l'ensemble des composants d'une application ?
authors:
  - fpasquet
categories:
  - javascript
keywords: []
---

Besoin de travailler avec différents Framework JS et donc de faire communiquer l'ensemble des composants d'une application ?
Une des solutions qui s'offre à vous est de faire appel aux événements personnalisés, natifs aux navigateurs. À découvrir dans cet article.

---

## Événements personnalisés, kesako ?

Ils sont identiques aux événements classiques tels que `click`, `submit`, `focus`..., sauf qu'ils sont créés manuellement.
Il existe deux possibilités pour créer un événement personnalisé, soit en utilisant [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent) (si besoin de passer des données) soit en faisant simplement appel à `Event`.

Dans l'exemple ci-dessous, la fonction permet de créer l'événement personnalisé :
```ts
const createCustomEvent = function <TData = { [key: string]: string }>(
  eventName: string,
  data?: TData
): Event | CustomEvent<TData> {
  if (data) {
    return new CustomEvent<TData>(eventName, { detail: data });
  }

  return new Event(eventName);
};
```

À présent, il suffit simplement d'envoyer les événements personnalisés:
```ts
const customEvenOpen = createCustomEvent("open");
const customEventCount = createCustomEvent<{ count: number }>("count", {
  count: 1
});
if (customEvenOpen) {
  document.dispatchEvent(customEvenOpen);
}
if (customEventCount) {
  document.dispatchEvent(customEventCount);
}
```

> `document` est utilisé comme gestionnaire d'événements unique pour tous les événements personnalisés, car il centralise toutes les méthodes d'événement et dissocie les événements personnalisés des nœuds spécifiques de la page.

Et dernière étape, il faudra écouter ces événements et implémenter la logique :
```tsx
const open = () => {};
const count = ({ detail: { count } }: CustomEvent<{ count: number }>): void => {};
document.addEventListener("open", open);
document.addEventListener("count", count as EventListener);
```

Il faut bien penser à nettoyer et supprimer les écouteurs d'événements quand cela est nécessaire, voir exemple ci-dessous :
```ts
document.removeEventListener("open", open);
document.removeEventListener("count", count as EventListener);
```

Par ailleurs, une façon de s'assurer que les écouteurs d'événements sont bien présents et qu'ils n'ont pas été attachés plusieurs fois à la page web est de vérifier cela à l'aide des outils de développement Chrome. Voici à quoi cela peut ressembler :

![Outils de développement pour événements personnalisé sur Chrome]({{ site.baseurl }}/assets/2022-02-09-communication-entre-composants-avec-des-evenements-personnalises/event-listeners-on-chrome.png)

Pour aller plus loin, il existe un troisième argument pour la méthode [`addEventListener`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener) qui n'a pas été évoqué précédemment. Il s'agit de l'argument `once`, qui peut s'avérer être utile pour que l'écouteur d'événement ne soit exécuté qu'une seule fois et qu'il soit détruit automatiquement après son invocation.
```ts
document.addEventListener("open", open, { once: true });
```

---

## Un exemple avec React

L'application a été créée avec `Create React App` et `Chakra UI`. Elle représente un parcours classique sur un ecommerce, c'est-à-dire, ajouter un produit au panier, afficher le montant total du panier et afficher le panier complété.

![Application React - Liste des produits]({{ site.baseurl }}/assets/2022-02-09-communication-entre-composants-avec-des-evenements-personnalises/application-react-product-list.png)

![Application React - Panier]({{ site.baseurl }}/assets/2022-02-09-communication-entre-composants-avec-des-evenements-personnalises/application-react-cart.png)

Voici le conteneur de l'application. Dans celui-ci se trouvent trois conteneurs (`ViewCartButtonContainer`, `AddToCartButtonContainer`, `CartContainer`).
```tsx
// src/containers/App.tsx
...

import { AddToCartButtonContainer } from '../AddToCartButton';
import { CartContainer } from '../Cart';
import { ViewCartButtonContainer } from '../ViewCartButton';

export const App: React.FC = () => {
    const logo = (
        <Stack direction="row">
            <ElevenLabsIcon height="24px" />
            <Heading size="md" ml="5px">Shop</Heading>
        </Stack>
    );

    return (
        <ChakraProvider theme={theme}>
            <NavBar
                logo={logo}
                rightContent={<ViewCartButtonContainer />}
            />
            <Box p={4}>
                <Stack spacing={4} as={Container} maxW={'3xl'}>
                    <ProductList
                        products={products}
                        renderAddToCartButton={(product: Product) => (
                            <AddToCartButtonContainer
                                product={product}
                            />
                        )}
                    />
                </Stack>
            </Box>
            <CartContainer />
        </ChakraProvider>
    );
}
```

Tous ces conteneurs sont totalement indépendants et communiquent via un système de bus d'événements par le biais du hook `useCart`.

Ce hook expose la liste des produits dans le panier ainsi que son prix total mais aussi les trois méthodes et événements personnalisés :

- La mise à jour du panier (`updateCart`)

Pour cela, l'événement `updateCart` est écouté via le `useEffect` qui déclenche la méthode `onUpdateCart`.
Cette méthode ajoute ou modifie la quantité d'un produit dans le panier. Il est préférable de [mémoïser](https://fr.wikipedia.org/wiki/M%C3%A9mo%C3%AFsation) la fonction à l'aide de `useCallback` pour éviter des rendus superflus.
À noter que dans le `useEffect`, l'écouteur est supprimé à chaque changement de la méthode `onUpdateCart`. Ceci est appliqué à tous les `useEffect` de l'exemple.

- La suppression du panier (`clearCart`)  
- Et l'ouverture de ce panier (`openCart`)

Pour ces deux derniers événements, la logique des écouteurs d'événements est similaire.

```tsx
// src/hooks/useCart.ts
...

export const useCart = (): UseCart => {
    const [cartItems, setCartItems] = useState<CartProduct[]>([]);

    const onUpdateCart = useCallback((event: CustomEvent<CartProduct>): void => {
        const cartItem = event.detail;
        const cartItemsDraft = [...cartItems];
        const cartItemIndex = cartItemsDraft.findIndex(({ id }) => id === cartItem.id);
        if (cartItemIndex !== -1) {
            if (cartItem?.quantity !== undefined) {
                if (cartItem.quantity === 0) {
                    cartItemsDraft.splice(cartItemIndex, 1);
                } else {
                    cartItemsDraft[cartItemIndex].quantity = cartItem.quantity;
                }
            } else {
                cartItemsDraft[cartItemIndex].quantity++;
            }
        } else {
            cartItemsDraft.push({ ...cartItem, quantity: 1 });
        }
        setCartItems(cartItemsDraft);
    }, [cartItems]) as EventListenerOrEventListenerObject;

    const onClearCart = useCallback(() => {
        setCartItems([]);
    }, []);

    useEffect(() => {
        document.addEventListener(EventType.UPDATE_CART, onUpdateCart);
        return () => {
            document.removeEventListener(EventType.UPDATE_CART, onUpdateCart, false);
        }
    }, [onUpdateCart]);

    useEffect(() => {
        document.addEventListener(EventType.CLEAR_CART, onClearCart);
        return () => {
            document.removeEventListener(EventType.CLEAR_CART, onClearCart, false);
        }
    }, [onClearCart]);

    const totalPrice = useMemo(() => {
        return cartItems.reduce((total, cartItem) => {
            total += (cartItem.salePrice ?? cartItem.price) * cartItem.quantity;
            return total;
        }, 0);
    }, [cartItems]);

    return {
        totalPrice,
        currency: 'EUR',
        cartItems,
        openCart: () => document.dispatchEvent(new Event(EventType.OPEN_CART)),
        updateCart: (options) => document.dispatchEvent(
            new CustomEvent(EventType.UPDATE_CART, {
                detail: options
            })
        ),
        clearCart: () => document.dispatchEvent(new Event(EventType.CLEAR_CART)),
    };
};
```

Concernant les conteneurs, le premier d'entre eux (`ViewCartButtonContainer`) affiche le montant du panier et permet de se rendre sur celui-ci.
```tsx
// src/containers/ViewCartButtonContainer.tsx
...

export const ViewCartButtonContainer: React.FC = () => {
    const { cartItems, totalPrice, currency, openCart } = useCart();

    return (
        <ViewCartButton
            totalPrice={totalPrice}
            currency={currency}
            numberOfProducts={cartItems.length}
            openCart={openCart}
        />
    );
}
```

Le second conteneur (`AddToCartButtonContainer`) permet d'ajouter un produit au panier et de changer sa quantité.

```tsx
// src/containers/AddToCartButtonContainer.tsx
...

export interface AddToCartButtonContainerProps { product: Product; }

export const AddToCartButtonContainer: React.FC<AddToCartButtonContainerProps> = ({ product }) => {
    const { cartItems, updateCart } = useCart();

    return (
        <AddToCartButton
            cartItem={cartItems.find(cartItem => cartItem.id === product.id) || { ...product, quantity: 0 }}
            updateCart={updateCart}
        />
    );
}
```

Et enfin, le dernier conteneur (`CartContainer`) affiche les produits se trouvant dans le panier.
```tsx
// src/containers/CartContainer.tsx
...

export const CartContainer: React.FC = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { cartItems, totalPrice, currency, updateCart, clearCart } = useCart();

    useEffect(() => {
        document.addEventListener(EventType.OPEN_CART, onOpen);
        return () => {
            document.removeEventListener(EventType.OPEN_CART, onOpen, false);
        }
    }, [onOpen]);

    return (
        <Drawer onClose={onClose} isOpen={isOpen} size="full">
            <DrawerOverlay />
            <DrawerContent>
                <DrawerCloseButton />
                <DrawerBody>
                    <Cart
                        cartItems={cartItems}
                        currency={currency}
                        totalPrice={totalPrice}
                        updateCart={updateCart}
                        clearCart={clearCart}
                        goToCheckout={() => {}}
                        continueShopping={onClose}
                    />
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    );
}
```

Le rendu final de l'application, est disponible [ici](https://example-react-app-with-custom-events-fpasquet.vercel.app/).
Le code est accessible [ici](https://github.com/fpasquet/example-react-app-with-custom-events).

Les événements personnalisés sont très appréciés des feature teams mais aussi des projets ayant une architecture micro frontend, car ils peuvent être indépendants les uns des autres et aussi agnostiques au framework JS.

À bientôt !
