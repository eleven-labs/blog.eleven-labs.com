---
contentType: article
lang: fr
date: '2019-07-26'
slug: optimistic-ui-avec-react-et-apollo-js
title: Une application React plus réactive - L'Optimistic UI
excerpt: >-
  Dans cet article, nous allons vous présenter l'optimistic UI et vous montrer
  comment l'implémenter dans votre application React facilement grâce à ApolloJS
categories:
  - javascript
authors:
  - kcordier
keywords:
  - react
  - apollojs
  - apollo
  - ux
  - optimistic ui
---

## Intro

Êtes-vous quelqu’un de patient ? Si oui, alors c’est bien, c’est une vertu. Mais êtes-vous prêt à attendre 3 secondes le retour d’un appel API pour avoir une réaction de la part d’une application front ?
 *\- Ça va 3 secondes dans la vie d’une personne.*
OK mais si je vous montre ça :
![]({BASE_URL}/imgs/articles/2019-07-23-optimistic-ui/no_reactivity.gif)
Ça vous fait grincer des dents ?
 *\- Ouais mais si le serveur met du temps à réagir je peux rien y faire en tant que dev JS ?*
Et c’est là qu'intervient le sujet de notre article : l’**Optimistic UI**.
Le but de l’article est de vous présenter cette technique et de vous montrer comment l'implémenter dans votre application React facilement grâce à ApolloJS.


## Définition

L’**Optimistic UI** est une technique de développement front permettant d’améliorer la réactivité d’une interface. Elle consiste à simuler l’état le plus optimal lors d’une action utilisateur pouvant prendre du temps.
Dans le cas normal nous attendons la fin de l’appel API pour changer l'état de notre interface :
![]({BASE_URL}/imgs/articles/2019-07-23-optimistic-ui/simple_event_call.png)
Si le serveur prend du temps, l’utilisateur peut penser à un dysfonctionnement de l'application.  Il risque alors de cliquer à nouveau sur le bouton et de multiplier les appels au serveur. Pour régler ce problème nous pouvons faire patienter l'utilisateur avec un état “En chargement” grâce à un loader bien connu des utilisateurs de 3G :
![]({BASE_URL}/imgs/articles/2019-07-23-optimistic-ui/loading_event_call.png)
Et si on donnait l'impression à notre utilisateur qu’il utilise une application totalement optimisée en lui affichant directement le résultat final de son action comme si tout se passait comme dans le meilleur des mondes ?
![]({BASE_URL}/imgs/articles/2019-07-23-optimistic-ui/optimistic_event_call.png)
Cette technique est très prisée des outils de communication écrite comme les tchats ou les applications sms de vos téléphones lors de l’envoi de message.
![]({BASE_URL}/imgs/articles/2019-07-23-optimistic-ui/phone_exemple.gif)
Ici, le message s’affiche dans la conversation alors que la barre de chargement n’est pas encore complète et que le “Sending... “ est encore présent.

## Mais la réalité est-elle si optimiste ?

Dans la vie, j'essaie de voir le verre à moitié plein. Mais malheureusement tout n’est pas rose, et il existe des cas où votre requête serveur vous retournera une erreur. Que la faute soit due au serveur ou au client, comment signaler à votre utilisateur que l’action qu’il vient de réaliser n’est pas tant un succès que ça ?
La méthode la plus facile est de rollback à l'état avant l’action tout en informant l’utilisateur de l’erreur via un message d’erreur.

## Mise en place
Maintenant que vous avez bien compris les tenants et aboutissants de l’**Optimistic UI**, mettons-le en oeuvre dans notre application React.
À partir d’ici je présume que votre application React utilise GraphQL et ApolloJS pour la communication avec vos APIs. Si ce n’est pas le cas et que vous voulez le mettre en place suivez [cet article]({BASE_URL}/fr/commencer-avec-apollojs/).
Pour une meilleure compréhension du code suivant, mettons nous en situation :
Imaginons une application permettant de noter des articles via un système de pouce bleu et de pouce rouge. L’idée ici est d'afficher à l’utilisateur la valeur exacte du nombre de pouces vers le haut de l’article précédemment noté.
```jsx
//article.jsx
const ADD_THUMB_UP = gql`
    mutation AddThumbUp($articleId: ID!) {
        addThumbUp(articleId: $articleId) {
            status // OK or KO
        }
    }
`;

const Article = ({ articleId }) => (
    <Query query={GET_ARTICLE_BY_ID} variables={{ id: articleId }} >
        {(data: { article }) => {
            return (
                //...
                <Mutation mutation={SUBMIT_COMMENT_MUTATION}>
                    {mutate => (
                        <ThumbUp
                            nbThumbUp={article.nbThumbUp}
                            onClick={() =>
                                mutate({
                                    variables: { articleId: article },
                                })
                            }
                        />
                    )}
                </Mutation>
                //...
            );
        }}
    </Query>
);
```
Une première solution est d’effectuer un **refetch** de la query récupérant les articles afin d’avoir la nouvelle valeur de pouces.
```jsx
//article.jsx
const ADD_THUMB_UP = gql`
    mutation AddThumbUp($articleId: ID!) {
        addThumbUp(articleId: $articleId) {
            status // OK or KO
        }
    }
`;

const Article = ({ articleId }) => (
    <Query query={GET_ARTICLE_BY_ID} variables={{ id: articleId }} >
        {(data: { article }) => {
            return (
                //...
                <Mutation mutation={SUBMIT_COMMENT_MUTATION} refetchQueries={[{ query: GET_ARTICLE_BY_ID, variables: { id: articleId } }]}>
                    {mutate => (
                        <ThumbUp
                            nbThumbUp={article.nbThumbUp}
                            onClick={() =>
                                mutate({
                                    variables: { articleId: article },
                                })
                            }
                        />
                    )}
                </Mutation>
                //...
            );
        }}
    </Query>
);
```
La solution est facile à mettre en place, mais elle nécessite d’attendre la fin de la mutation puis la récupération de tous les articles (même de possibles nouveaux) afin de voir la modification. C’est lent, pas optimisé, et ce n’est pas le sujet de l’article.
Une deuxième solution serait de manuellement incrémenter la valeur, mais cela nécessite de garder la valeur initiale dans un ‘state’. La difficulté ici est de gérer les erreurs et le rollback de manière propre.
La dernière solution (et je pense, la meilleure, sinon je ne ferais pas cet article) est d’utiliser l’option **optimisticResponse** de votre mutation pour simuler une réponse la plus proche de l’état souhaité (sans oublier les **\_\_typename**) et d’utiliser l’option **update** pour modifier directement dans le cache apollo avec les valeurs envoyées par notre fake response.
```jsx
//article.jsx
const ADD_THUMB_UP = gql`
    mutation AddThumbUp($articleId: ID!) {
        addThumbUp(articleId: $articleId) {
            nbThumbUp // La dernière valeur du nombre de pouces bleu
        }
    }
`;

const Article = ({ articleId }) => (
    <Query query={GET_ARTICLE_BY_ID} variables={{ id: articleId }} >
        {(data: { article }) => {
            return (
                //...
                <Mutation mutation={SUBMIT_COMMENT_MUTATION} >
                    {mutate => (
                        <ThumbUp
                            nbThumbUp={article.nbThumbUp}
                            onClick={() => {
                                try {
                                    mutate({
                                        variables: { articleId: article },
                                        optimisticResponse: {
                                            __typename: 'Mutation',
                                            nbThumbUp: article.nbThumbUp + 1, // donnée fake
                                        },
                                        update: (proxy, { data: { nbThumbUp } }) => {
                                            // Récupération des données du cache pour cette query.
                                            const data = proxy.readQuery({ query: GET_ARTICLE_BY_ID, variables: { id: articleId } });
                                            // Ajout de la donnée fake
                                            data.article.nbThumbUp = nbThumbUp;
                                            // Ecriture de la nouvelle valeur directement dans le cache de la query
                                            proxy.writeQuery({ query: GET_ARTICLE_BY_ID, variables: { id: articleId }, data });
                                        },
                                    })
                                } catch (e) {
                                    // Traitement des erreurs
                                }
                            }}
                        />
                    )}
                </Mutation>
                //...
            );
        }}
    </Query>
);

```
Une fois le cache Apollo mis à jour, c’est toute la query qui va se re render avec les valeurs mises à jour.
Le plus beau dans tout ça, c’est que dans le cas d’un retour en erreur, Apollo se charge de rollback les modifications réalisées dans la fonction d’update, et le catch se chargera de gérer l’erreur. Encore mieux, à la fin de la mutation le même traitement sera réalisé, mais cette fois-ci avec les vraies données de la réponse et dans notre exemple nous afficherons la valeur de pouces bleus la plus à jour.

## Génial ! Mettez-en moi 2 caisses de 12
Mais calmez vous ! Je sais que l’**optimistic UI** est génial, mais il n’est pas à utiliser dans tous les cas. C’est très utile dans le cas de modifications simples comme ceci.
```jsx
//comment.jsx
const UPDATE_COMMENT = gql`
    mutation UpdateComment($commentId: ID!, $commentContent: String!) {
        updateComment(commentId: $commentId, commentContent: $commentContent) {
            id
            __typename
            content
        }
    }
`;

const ArticleComments = ({ articleId }) => (
    <Query query={GET_COMMENTS_BY_ARTICLE} variables={{ articleId }} >
        {(data: { comments }) => {
            return (
                //...
                <Mutation mutation={UPDATE_COMMENT}>
                    {mutate => {
                        <Comment
                            updateComment={({ commentId, commentContent }) => {
                                try {
                                    mutate({
                                        variables: { commentId, commentContent },
                                        optimisticResponse: {
                                            __typename: "Mutation",
                                            updateComment: {
                                                id: commentId,
                                                __typename: "Comment",
                                                content: commentContent,
                                            }
                                        }
                                    })
                                } catch (e) {
                                    // Traitement des erreurs
                                }
                            }
                        />;
                    }}
                </Mutation>
                //...
            );
        }}
    </Query>
);

```
Ici, nous effectuons la modification de l’entièreté d’un objet. Si vous avez bien remarqué, nous n’utilisons pas l’option ‘update’. La raison est que notre mutation nous renvoie un objet complet avec le même ‘__typename’ et ‘id’ que la query a initialement retourné. Grâce à ces deux informations Apollo peut directement retrouver et modifier l’objet dans le cache, car elles forment le ‘dataIdFromObject’ par défaut. Il va sans dire que si vous avez changé votre définition du ‘dataIdFromObject’ dans les paramètres de cache alors vous ne pouvez plus utiliser cette méthode telle quelle.
Traitons le cas de l’ajout :
```jsx
//comment.jsx
const ADD_COMMENT = gql`
    mutation AddComment($commentContent: String!) {
        addComment(commentContent: $commentContent) {
            id
            __typename
            content
        }
    }
`;

const ArticleComments = ({ articleId }) => (
    <Query query={GET_COMMENTS_BY_ARTICLE} variables={{ articleId }} >
        {(data: { comments }) => {
            return (
                //...
                <Mutation mutation={UPDATE_COMMENT}>
                    {mutate => {
                        <Comment
                            updateComment={({ commentId, commentContent }) => {
                                try {
                                    const generatedId = _.uniqueId('comment_');
                                    mutate({
                                        variables: { commentId, commentContent },
                                        optimisticResponse: {
                                            __typename: "Mutation",
                                            submitComment: {
                                                id: generatedId,
                                                __typename: "Comment",
                                                postedBy: currentUser,
                                                createdAt: new Date(),
                                                content: commentContent,
                                            }
                                        },
                                        update: (proxy, { data: { submitComment } }) => {
                                            // Récupération des données du cache pour cette query.
                                            const data = proxy.readQuery({ query: GET_COMMENTS_BY_ARTICLE, variables: { articleId } });
                                            // On supprime le fake commentaire s'il existe, pour eviter les doublons
                                            data.comments.filter((comment) => comment.id != generatedId);
                                            // Ajout du nouveau commentaire
                                            data.comments.push(submitComment);
                                            // Ecriture de la nouvelle valeur directement dans le cache de la query
                                            proxy.writeQuery({ query: GET_COMMENTS_BY_ARTICLE, variables: { articleId }, data});
                                        }
                                    })
                                } catch (e) {
                                    // Traitement des erreurs
                                }
                            }}
                        />;
                    }}
                </Mutation>
                //...
            );
        }}
    </Query>
);
```
La problématique est que nous ajoutons un objet en cache sans connaître son ‘ID’. L’idée est alors de générer un ID temporaire unique en attendant le retour.
La divergence d’ID va poser un problème pour tout appel de mutation nécessitant un identifiant, il faut donc bien vérifier l'intégrité de l’ID avant de donner accès aux autres mutations, comme par exemple la modification.

Mais “dans quel cas ne pas l'utiliser ?” vous allez me demander. Il est déconseillé d’utiliser l’**optimistic UI** sur des formulaires nécessitant une validation serveur avec les erreurs bind sur les champs, ici le retour est trop important pour ne pas l’attendre.
Je vois un second cas où je vous déconseille d’utiliser cette technique. Si l’ajout ou la modification d’un objet a des conséquences sur d’autres objets d’autres queries. La meilleure manière et alors de re-render ces différents queries.

## Conclusion
L'optimistic UI est une technique qui va grandement améliorer les performances de vos applications front si votre back office peine à répondre. De plus, si vous utilisez Apollo il est très facile de la mettre en place. Mais Attention, car mal utilisé, vous pouvez oublier des erreurs ou générer de grosses différences entre vos données back et front. C'est pour cela qu'il faut l'utiliser en connaissance de cause.
Pour plus d'informations, n'hésitez pas à visiter la documentation d'ApolloJS qui m'a inspiré pour cet article : [https://www.apollographql.com/docs/react/features/optimistic-ui/](https://www.apollographql.com/docs/react/features/optimistic-ui/)
