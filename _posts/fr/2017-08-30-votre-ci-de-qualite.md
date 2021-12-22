---
layout: post
title: Votre CI de qualité
lang: fr
permalink: /fr/votre-ci-de-qualite/
excerpt: La qualité est un vaste sujet, surtout quand on l'associe au développement d'applications web. Ce qui est encore plus compliqué, c'est de mettre en place l'environnement d'intégration continue (CI) de suivi de qualité.
authors:
    - captainjojo
categories:
    - symfony
    - javascript
tags:
    - php
    - symfony2
    - javascript
    - webperformance
cover: /assets/2017-08-30-votre-ci-de-qualite/cover.jpg
---

La qualité est un vaste sujet, surtout quand on l'associe au développement d'application web.

Ce qui est encore plus compliqué, c'est de mettre en place l'environnement d'intégration continue (CI) de suivi de qualité.

Pendant plus de 2 ans, nous avons mis en place une CI de qualité chez LeMonde.fr qui a évolué en fonction de nos besoins. Le but de cet article est de comprendre la stratégie et les technos choisies pour la CI d'un site comme LeMonde.fr

### La partie Symfony

Comme pour tout langage de programmation, la première chose que l'on veut vérifier, c'est la syntaxe. La première chose à mettre en place est donc un vérificateur de syntaxe en PHP.

```sh
php -l somefile.php
```

Maintenant, il faut savoir quand faire cette vérification. L'idée numéro 1 étant de laisser le développeur le faire avant d'envoyer son code sur git. Si l'appel n'est pas automatisé, 1 fois sur 3, le développeur ne lance pas la commande.

L'idée est donc de le faire à chaque commit. Pour cela rien de plus simple, on ajoute [un hook de pre-commit](https://git-scm.com/docs/githooks){:rel="nofollow noreferrer"}.

Dans le fichier `.git/hooks/pre-commit` il faut ajouter le code suivant.

```sh
#!/bin/sh

BADWORDS='var_dump|die|todo'

EXITCODE=0
FILES=`git diff --cached --diff-filter=ACMRTUXB --name-only $against --`

for FILE in $FILES ; do
  if [ "${FILE##*.}" = "php" ]; then

    php -l "$FILE"
    if [ $? -gt 0 ]; then
      EXITCODE=1
    fi

    grep -H -i -n -E "${BADWORDS}" $FILE
    if [ $? -eq 0 ]; then
      EXITCODE=1
    fi

  fi
done

if [ $EXITCODE -gt 0 ]; then
  echo
  echo 'Fix the above errors or use:'
  echo ' git commit --no-validate'
  echo
fi

exit $EXITCODE
```

Si tout est ok, lors de chaque `commit` , le hook va vérifier la syntaxe php.

Une fois cela validé, la suite logique est de faire en sorte que les développeurs codent tous avec les mêmes standards. Ce qui est bien, c'est que PHP a déjà des standards : les **[PSR](http://www.php-fig.org/psr/){:rel="nofollow noreferrer"}**.

Encore faut-il que tous les développeurs les suivent, c'est assez simple en PHP. Nous avons ajouté dans notre hook de pre-commit la commande de vérification disponible dans cet article, *[vérifier la qualité du code](https://blog.eleven-labs.com/fr/verifier-la-qualite-du-code/){:rel="nofollow noreferrer"}*

Nous étions satisfaits mais c'était assez contraignant de passer par les hooks git. La première difficulté était que chaque développeur pouvait changer ses hooks, ce qui peut poser des problèmes.

Nous avons donc regardé les solutions du marché, et comme nous utilisions Github, [Travis](https://travis-ci.org){:rel="nofollow noreferrer"} était la plus approprié.

La migration était simple, nous avons ajouté le fichier `.travis.yml` dans notre projet contenant les mêmes scripts de vérification.

```yml
before_script:
  - ! find . -type f -name "*.php" -exec php -d error_reporting=32767 -l {} \; 2>&1 >&- | grep "^"
```

La vérification ne se faisait que lors d'une pull request. Il fallait aider le développeur à voir les erreurs de coding style et syntaxe avant, c'est-à-dire pendant son développement.
Nous avons choisi d'utiliser [l'editorconfig](http://editorconfig.org/){:rel="nofollow noreferrer"} ! L'editorconfig est un fichier que l'on ajoute à la racine du repo et qui est utilisé par la plupart des IDE pour vérifier en live la syntaxe.

Exemple de fichier .editorconfig

```ini
# EditorConfig helps developers define and maintain consistent
# coding styles between different editors and IDEs
# editorconfig.org

root = true

[*.md]
trim_trailing_whitespace = false
indent_style = tabs

[*]
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true
indent_size = 4
indent_style = space

[*.{js,jsx,json}]
indent_size = 2
indent_style = space

[Makefile]
indent_size = 4
indent_style = tabs
```

**La syntaxe c'est fait !!!!**

Passons au code ! Comme tout le monde, nous avions des tests unitaires et fonctionnels en [phpunit](https://phpunit.de/){:rel="nofollow noreferrer"}.  Comme nous avions Travis, qui était en place, il fallait seulement ajouter le script pour les lancer dans la configuration.

```yml
//.travis.yml
script:
  ## PHPUnit
  - vendor/bin/phpunit
```

**Bravo vos tests sont dans la CI !!!**

Après cette importante étape, nous avons cherché à savoir ce qui nous manquait. Nous avions des tests, mais cela n'attestait pas de la qualité de notre code, seulement du fait qu'il était fonctionnel. Pour améliorer la qualité du code, nous avons alors instauré l'obligation d'une relecture par deux autres développeurs de chaque pull request afin qu'elle soit validée. Nous avions la sensation que la qualité était meilleure car les gens posaient les bonnes questions :

 1. pourquoi cette variable ?
 2. ton nom de fonction est étrange.
 3. tu pourrais utiliser cette fonction.
 4. j'ai déjà codé un truc ressemblant.
 5. etc...

Mais il nous est arrivé que certaines pull requests nous aient posé des problèmes. Des questions du type `for` ou `while` sont apparues dans les codes review et cela est devenu trollLand sur certaines pull requests. Comment faire ?

L'idée fut d'avoir un juge de touche Nous avons cherché et nous avons choisi [Scrutinizer](https://scrutinizer-ci.com/). [Scrutinizer](https://scrutinizer-ci.com/){:rel="nofollow noreferrer"} est une solution qui permet de *juger* votre code. Il vous donne une note en prenant en compte plusieurs signes de qualité :

 1. nom de variable
 2. taille du code
 3. ré-utilisation
 4. psr
 5. etc...

La mise en place est simple puisque [Scrutinizer](https://scrutinizer-ci.com/){:rel="nofollow noreferrer"} se plugue facilement à Github. Il suffit d'ajouter un fichier `.scrutinizer.yml` dans votre projet.

Exemple:
```yml
checks:
    php:
        verify_property_names: true
        verify_argument_usable_as_reference: true
        verify_access_scope_valid: true
        variable_existence: true
        useless_calls: true
        use_statement_alias_conflict: true
        use_self_instead_of_fqcn: true
        uppercase_constants: true
        unused_variables: true
        unused_properties: true
        unused_methods: true
        unused_parameters: true
        unreachable_code: true
        too_many_arguments: true
        symfony_request_injection: true
        switch_fallthrough_commented: true
        sql_injection_vulnerabilities: true
        single_namespace_per_use: true
        simplify_boolean_return: true
        side_effects_or_types: true
        security_vulnerabilities: true
        return_doc_comments: true
        return_doc_comment_if_not_inferrable: true
        require_scope_for_properties: true
        require_scope_for_methods: true
        require_php_tag_first: true
        remove_extra_empty_lines: true
        psr2_switch_declaration: true
        psr2_class_declaration: true
        property_assignments: true
        properties_in_camelcaps: true
        prefer_while_loop_over_for_loop: true
        precedence_mistakes: true
        precedence_in_conditions: true
        phpunit_assertions: true
        php5_style_constructor: true
        parse_doc_comments: true
        parameters_in_camelcaps: true
        parameter_non_unique: true
        parameter_doc_comments: true
        param_doc_comment_if_not_inferrable: true
        overriding_private_members: true
        optional_parameters_at_the_end: true
        one_class_per_file: true
        non_commented_empty_catch_block: true
        no_unnecessary_if: true
        no_unnecessary_final_modifier: true
        no_underscore_prefix_in_properties: true
        no_underscore_prefix_in_methods: true
        no_trait_type_hints: true
        no_trailing_whitespace: true
        no_short_variable_names:
            minimum: '3'
        no_short_open_tag: true
        no_short_method_names:
            minimum: '3'
        no_property_on_interface: true
        no_non_implemented_abstract_methods: true
        no_new_line_at_end_of_file: true
        no_long_variable_names:
            maximum: '20'
        no_goto: true
        no_global_keyword: true
        no_exit: true
        no_eval: true
        no_error_suppression: true
        no_empty_statements: true
        no_duplicate_arguments: true
        no_debug_code: true
        no_commented_out_code: true
        newline_at_end_of_file: true
        more_specific_types_in_doc_comments: true
        naming_conventions:
            local_variable: '^[a-z][a-zA-Z0-9]*$'
            abstract_class_name: ^Abstract|Factory$
            utility_class_name: 'Utils?$'
            constant_name: '^[A-Z][A-Z0-9]*(?:_[A-Z0-9]+)*$'
            property_name: '^[a-z][a-zA-Z0-9]*$'
            method_name: '^(?:[a-z]|__)[a-zA-Z0-9]*$'
            parameter_name: '^[a-z][a-zA-Z0-9]*$'
            interface_name: '^[A-Z][a-zA-Z0-9]*Interface$'
            type_name: '^[A-Z][a-zA-Z0-9]*$'
            exception_name: '^[A-Z][a-zA-Z0-9]*Exception$'
            isser_method_name: '^(?:is|has|should|may|supports)'
        line_length:
            max_length: '120'
        method_calls_on_non_object: true
        missing_arguments: true
        align_assignments: true
        argument_type_checks: true
        assignment_of_null_return: true
        avoid_aliased_php_functions: true
        avoid_closing_tag: true
        avoid_conflicting_incrementers: true
        avoid_corrupting_byteorder_marks: true
        avoid_duplicate_types: true
        avoid_entity_manager_injection: true
        avoid_fixme_comments: true
        avoid_length_functions_in_loops: true
        avoid_multiple_statements_on_same_line: true
        avoid_perl_style_comments: true
        avoid_superglobals: true
        avoid_todo_comments: true
        avoid_unnecessary_concatenation: true
        avoid_usage_of_logical_operators: true
        avoid_useless_overridden_methods: true
        blank_line_after_namespace_declaration: true
        catch_class_exists: true
        classes_in_camel_caps: true
        closure_use_modifiable: true
        closure_use_not_conflicting: true
        code_rating: true
        deadlock_detection_in_loops: true
        deprecated_code_usage: true
        duplication: true
        encourage_postdec_operator: true
        encourage_shallow_comparison: true
        encourage_single_quotes: true
        fix_doc_comments: true
        fix_line_ending: true
        fix_use_statements:
            remove_unused: true
            preserve_multiple: false
            preserve_blanklines: false
            order_alphabetically: true
        foreach_traversable: true
        foreach_usable_as_reference: true
        instanceof_class_exists: true
        function_in_camel_caps: true

tools:
    external_code_coverage:
        timeout: 600

build_failure_conditions:
    - 'elements.rating(<= D).new.exists'
    - 'issues.label("coding-style").new.exists'
    - 'issues.severity(>= MINOR).new.exists'
    - 'project.metric_change("scrutinizer.test_coverage", < -0.10)'
    - 'patches.label("Doc Comments").exists'
```

Vous pouvez configurer énormément de choses mais surtout les conditions d'acceptation. Comme vous le voyez dans la configuration, on y trouve `build_failure_conditions` qui permet de mettre les seuils d'acceptation de la pull request.

Scrutinizer permet aussi de gérer le taux de code coverage, il faut alors l'envoyer à Scrutinizer à partir de la sortie de Travis. Un tutoriel est disponible [ici](https://scrutinizer-ci.com/docs/tools/external-code-coverage/){:rel="nofollow noreferrer"}. Normalement, il vous faut ajouter ceci dans le fichier `.travis.yml`

```yml
after_script:
  ## Scrutinizer
  - wget https://scrutinizer-ci.com/ocular.phar
  - php ocular.phar --access-token="TOKEN" code-coverage:upload --format=php-clover ./build/logs/clover.xml
```

Scrutinizer est assez complet et permet de suivre la qualité de votre code au fil du temps, en vous envoyant des mails de suivi et vous proposant des dashboards.

**Encore une étape de terminée !!!!**

Nous avons utilisé cette stack pendant plus d'un an, nous étions assez satisfait. Puis un jour, un article sur [les tests de mutation](https://blog.eleven-labs.com/fr/mutation-testing-verifiez-la-qualite-de-vos-tests-unitaires/){:rel="nofollow noreferrer"}, nous a donné envie d'aller plus loin. Nous avons alors essayé les tests de mutation, ce qui nous a permis de voir que même avec un code coverage de 90%, il y avait des tests qui ne faisaient rien ou qui testaient mal le code. Après avoir fait les changements, nous voulions aussi l'introduire dans notre CI. Le premier réflexe étant d'ajouter le script dans la configuration travis. Grosse erreur, le script mettant plus de 20 minutes sur notre projet, nous avions les jobs Travis en attente sur les autres projets. Mais heureusement, Travis avait sorti une nouvelle fonctionnalité qui permet de lancer les jobs en mode CRON et donc de le faire qu'une fois par jour, ce qui est suffisant pour ce genre de test. Il nous suffsait alors d'ajouter la config suivante.

```yml
//.travis.yml
script:
    - |
        if [[ "$TRAVIS_EVENT_TYPE" == 'cron' && "$TRAVIS_BRANCH" == 'master' ]]; then
            php bin/humbug
            php bin/humbug stats ./build/humbug/log.json --skip-killed=yes -vvv
        fi
```

Il suffit alors de regarder chaque jour le build humbug fait sur la branche master.

**La dernière étape de la partie php est terminée !!!!**

### La partie javascript

L'architecture évoluant, nous avons dû nous adapter et donc travailler de plus en plus avec du javascript.

Nous avons alors réfléchi à la même problématique, du javascript oui, mais de qualité.

Encore une fois, nous avons commencé par la syntaxe avec la mise en place [Eslint](https://eslint.org/). Nous avons choisi comme standard la configuration de [airbnb](https://www.npmjs.com/package/eslint-config-airbnb){:rel="nofollow noreferrer"}.

```js
---
    extends: "airbnb"
    env:
        node: true
        browser: true
        jest: true
    settings:
        import/resolver:
            webpack:
                config: 'app/config/webpack.config.js'
```

Puis nous avons ajouté la vérification à la configuration de Travis.

```yml
//.travis.yml
script:
  - eslint src app/config --ext .js --ext .jsx
```

Comme nous faisons déjà du javascript dans le frontend, notre Editorconfig était correctement configuré.

**Étape 1, 3 secondes !!!**

Nous avons alors fait les tests unitaires. Comme toujours le choix de la techno ne fut pas simple. Mais comme nous faisions du [react](https://facebook.github.io/react/), [jest](https://facebook.github.io/jest/){:rel="nofollow noreferrer"} s'est très vite imposé.
Une fois les tests développés, nous avons encore une fois ajouté l'appel dans la configuration Travis.

```yml
//.travis.yml
script:
  - jest
```

**Étape 2, done !!!!**

Comme nous le savions de notre expérience en PHP, tout cela ne suffisait pas. Nous avons donc cherché un outil équivalent à Scrutinizer et nous avons trouvé [Bithound](https://www.bithound.io){:rel="nofollow noreferrer"}. Cet outil est un peu moins poussé, mais il permet de mettre une note sur votre code et surtout de vous alerter quand des librairies extérieures ne sont plus à jour.

La configuration est comme toujours un fichier à la racine du projet.

```json
//.bithoundrc
{
  "ignore": [
    "**/node_modules/**"
  ],
  "test": [
    "**/*.spec.js*"
  ],
  "critics": {
    "lint": {
      "engine": "eslint"
    }
  }
}
```

Bithound n'est pas mal mais n'apporte pas les mêmes fonctionnalités que Scrutinizer. Il n'y a pas de dashboard de suivi et les checks sont limités.

**Et voila, votre javascript est maintenant de qualité !!!**

Nous n'avons malheureusement pas trouvé une technologie permettant de faire des tests de mutation avec Jest, donc nous n'avons pas passé cette étape sur le code javascript. (Avez-vous des solutions ?)

### Partie CSS

On l'oublie souvent mais le CSS, c'est aussi du code, et la qualité de celui-ci doit aussi être prise en compte.

Jamais deux sans trois, on commence par la syntaxe. Pour cela, nous avons utilisé [Stylelint](https://stylelint.io/){:rel="nofollow noreferrer"} qui permet de gérer la syntaxe de vos fichiers CSS. Stylelint permet de nombreuses vérifications:

 1. Ne pas avoir de commentaire vide
 2. Le nombre de sélecteurs max
 3. Vérification des accolades
 4. etc...

Si vous suivez le tutoriel, vous devez écrire un fichier de configuration à la racine de votre repository.

Exemple de fichier `.stylelintrc`

```json
{
    "plugins": [
        "stylelint-order"
    ],
    "rules": {
        "color-hex-case": "lower",
        "color-no-invalid-hex": true,

        "font-weight-notation": "named-where-possible",

        "indentation": 4,
        "function-max-empty-lines": 2,
        "function-comma-space-after": "always-single-line",
        "function-parentheses-space-inside": "never-single-line",
        "block-closing-brace-newline-after": [
            "always-multi-line",
            { "ignoreAtRules": ["if", "else"] }
        ],
        "number-leading-zero": "always",
        "number-no-trailing-zeros": true,
        "number-max-precision": 6,
        "block-no-empty": true,
        "comment-no-empty": true,
        "declaration-bang-space-before": "always",
        "declaration-block-no-duplicate-properties": [
            true,
            { "ignore": ["consecutive-duplicates"] }
        ],
        "string-quotes": "single",
        "max-line-length": 100,
        "max-empty-lines": 2,
        "max-nesting-depth": [3,
            { "ignoreAtRules": ["if", "else", "include"] }
        ],
        "order/declaration-block-order": [
            "custom-properties",
            "dollar-variables",
            {
                "type": "at-rule",
                "name": "include",
                "hasBlock": false
            },
            "declarations",
            {
                "type": "at-rule",
                "name": "include",
                "parameter": "to-screen",
                "hasBlock": true
            },{
                "type": "at-rule",
                "name": "include",
                "parameter": "from-screen",
                "hasBlock": true
            },{
                "type": "at-rule",
                "name": "include",
                "parameter": "from-to-screen",
                "hasBlock": true
            },{
                "type": "at-rule",
                "name": "include",
                "parameter": "at-screen",
                "hasBlock": true
            },
            "rules"
        ],
        "order/declaration-block-properties-specified-order" : [
            [
                "box-sizing",
                "display",
                "float",
                "flex",
                "flex-flow",
                "flex-basis",
                "align-self",
                "align-items",
                "order",
                "position",
                "top",
                "right",
                "bottom",
                "left",
                "min-width",
                "z-index",
                "width",
                "max-width",
                "min-height",
                "height",
                "max-height",
                "overflow",
                "overflow-y",
                "overflow-x",
                "padding",
                "padding-top",
                "padding-right",
                "padding-bottom",
                "padding-left",
                "margin",
                "margin-top",
                "margin-right",
                "margin-bottom",
                "margin-left"
            ],
            {
                "unspecified": "bottom"
            }
        ]
    }
}
```

Pour lancer ceci dans nos CI, nous avons utilisé le plugin pour gulp et donc ajouté une tâche gulp.

```js
gulp.task('scss:lint', () => {
    const lintPlugins = [
        stylelint(),
        reporter({
            clearReportedMessages: true,
        }),
    ];

    return gulp.src(path.resolve(src.scss, '**/*.scss'))
        .pipe(postcss(lintPlugins, { syntax }).on('error', onError));
});
```

Et comme à chaque fois, il nous faut ajouter la commande dans le fichier `.travis.yml`.

```yml
script:
  - gulp scss:lint
```

La seconde façon de vérifier la qualité du CSS est de faire des tests de non régression visuelle. Pour cela [BackstopJs](https://github.com/garris/BackstopJS){:rel="nofollow noreferrer"} est une solution complète, qui permet de tester deux versions de votre code html/css.

L'idée est de générer une version statique des pages de votre site avec votre code actuel et de stocker le résultat. Ensuite, vous pouvez faire des modifications de votre code et lancer les tests de régression visuelle, cela génère un site qui vous montre les différences entre les deux versions. À vous de décider si la différence est normale ou non.

Nous n'avons pas ajouté cette vérification dans la partie automatique de la CI, parce que souvent les tests montrent des différences normales et non des erreurs. Mais pour rendre ceci plus simple, nous avions généré le site statique de BackstopJs lors d'un merge dans master. Pour cela, nous utilisions la variable d'environnement de travis qui permet de connaître la branche, si celle-ci était un tag, nous déployions le site dans un bucket lisible par tout le monde et qui permettait de faire les vérifications manuelles.

Voici l'exemple de configuration Travis.

```yml
language: node_js
node_js:
  - 6.7.0
sudo: false
cache:
  directories:
    - node_modules

script:
  - make lint

install:
  - make install
  - mkdir -p "deploy/${TRAVIS_TAG}"
  - cp -R public/assets "deploy/${TRAVIS_TAG}"

deploy:
  provider: gcs
  access_key_id: GOOGLE_ID
  secret_access_key:
    secure: SECURE
  bucket: BUCKET_NAME
  acl: public-read
  local-dir: deploy
  skip_cleanup: true
  on:
    repo: lemonde/pattern-guides
    branch: master
    tags: true
    condition: $TRAVIS_TAG =~ [0-9]+\.[0-9]+\.[0-9]+
```

Nous avions avec cela gagné en qualité CSS et avons eu beaucoup moins de régression visuelle.

### Partie WebPerformance

Parce que la WebPerformance, c'est aussi de la qualité, nous avons ajouté un outil dans notre CI pour suivre cette dernière.

Nous avons choisi [Speedcurve](https://speedcurve.com/){:rel="nofollow noreferrer"}, un outil de monitoring simple d'utilisation et surtout qui permet de suivre les concurrents.

Speedcurve permet beaucoup de choses, nous avons essayé d'utiliser l'ensemble des fonctionnalités disponibles.

La première chose est de suivre la WebPerformance de votre site en production. Speedcurve va, selon votre configuration, se connecter plusieurs fois dans la journée sur votre site et faire des calculs de WebPerformance.

Speedcurve vous renvoie plusieurs indicateurs très sympas :

 - Start Render
 - Speed Index
 - Visually Complete
 - Page Load Time
 - css size
 - Image Size
 - etc ...

Ce qui est intéressant avec cette fonctionnalité, c'est de pouvoir suivre jour après jour votre WebPerformance.

La seconde chose est que vous pouvez mettre d'autres sites que le votre et donc vérifier votre WebPerformance par rapport aux autres.

La dernière fonctionnalité importante permet de lancer une demande de vérification via une API. Nous avions alors, après chaque mise en production lancée, un check sur Speedcurve en le nommant avec le numéro de la release mise en prod. Ceci permet ensuite de voir sur l'ensemble des dashboards disponible sur Speedcurve le moment de la mise en production, mais aussi de faire des comparaisons entre les releases.

### Conclusion

L'utilisation de l'ensemble des outils nous a permis de suivre la qualité de notre site dans le temps. Ceci permet d'éviter la dette technique qui peut très vite s'accumuler. Effectivement, cela prend du temps de mettre tous les outils en place, mais il faut savoir le prendre pour en gagner après. Nous avons mis plus de deux ans pour avoir l'ensemble des outils, allez y pas à pas et vous y arriverez.
