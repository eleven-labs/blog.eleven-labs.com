export const getValidCategories = (categoriesAndTags: string[]): string[] => {
  const validCategories = categoriesAndTags.map((categoryOrTag) => {
    switch (categoryOrTag) {
      case 'php':
      case 'symfony':
      case 'mercure':
      case 'forum php':
      case 'afup':
      case 'behat':
      case 'symfony con':
      case 'phpunit':
      case 'symfony live':
      case 'esi':
      case 'swarrot':
      case 'symfony2':
      case 'symfony 4':
      case 'symfony_live':
      case 'php7':
      case 'js':
        return 'php';

      case 'javascript':
      case 'react':
      case 'storybook':
      case 'node':
      case 'deno':
      case 'react router':
      case 'ssr':
      case 'amd':
      case 'es6':
      case 'lazy loading':
      case 'lazy load':
      case 'react-native':
      case 'ionic':
      case 'cordova':
      case 'yeoman':
      case 'gulp':
      case 'hapi':
      case 'phantomjs':
      case 'sails.js':
      case 'pwa':
      case 'optimistic ui':
      case 'loadable':
      case 'code splitting':
      case 'lazy':
      case 'suspense':
      case 'webpack':
      case 'apollojs':
      case 'apollo':
      case 'skeleton screen':
      case 'promise':
      case 'promesse':
      case 'async':
      case 'babel':
      case 'jasmine':
      case 'ecmascript':
      case 'npm':
      case 'angular':
      case 'angularcli':
      case 'angular2':
      case 'cucumber':
      case 'puppeteer':
      case 'vue.js':
      case 'amp':
      case 'nextjs':
      case 'dotjs':
      case 'nodejs':
      case 'service worker':
      case 'vuejs':
        return 'javascript';

      case 'architecture':
      case 'kubernetes':
      case 'scrutinizer':
      case 'devops':
        return 'architecture';

      case 'agile':
      case 'agilite':
        return 'agile';

      case 'e2e':
      case 'dotcss':
      case 'optimisation':
      case 'python':
      case 'crypto-gaming':
      case 'blockchain':
      case 'bonnes pratiques':
      case 'di':
      case 'git':
      case 'ux':
      case 'méthodologie':
      case 'conference':
      case 'conférence':
      case 'veille':
      case 'low-code':
      case 'outils':
      case 'tutorial':
      case 'éco-conception':
      case 'conception':
      case 'produit':
      case 'développement':
      case 'culture':
      case 'quantique':
      case 'qubit':
      case 'design':
      case 'rédaction':
      case 'projet':
      case 'agilité':
      case 'product owner':
      case 'product manager':
      case 'recrutement':
      case 'teamwork':
      case 'égalités':
      case 'women':
      case 'égalité':
      case 'histoire':
      case 'product management':
      case 'organisation':
      case 'soft skills':
      case 'scrum master':
      case 'metier':
      case 'rex':
      case 'marketing':
      case 'customer journey':
      case 'parcours clients':
      case 'parcours utilisateurs':
      case 'user journey':
      case 'priorisation':
      case 'aide':
      case 'docker':
      case 'chrome':
      case 'bit':
      case 'browserstack':
      case 'graphql':
      case 'monitoring':
      case 'raspberry pi':
      case 'sprint':
      case 'backlog':
      case 'github':
      case 'terraform':
      case 'server':
      case 'real-time':
      case 'story map':
      case 'atelier':
      case 'web':
      case 'images':
      case 'state':
      case 'reducer':
      case 'bonne pratique':
      case 'serverless':
      case 'aws':
      case 'bref':
      case 'lambda':
      case 'serveur':
      case 'master':
      case 'nodes':
      case 'munin':
      case 'opensource':
      case 'communication':
      case 'cnv':
      case 'ui':
      case 'po':
      case 'pm':
      case 'firefox':
      case 'webextention':
      case 'tools':
      case 'base de données':
      case 'arangodb':
      case 'nosql':
      case 'base de données multi-modèles':
      case 'graphe':
      case 'entretien':
      case 'utilisateur':
      case 'cheat-sheet':
      case 'open street map':
      case 'c4model':
      case 'diagramme':
      case 'visualisation':
      case 'modélisation':
      case 'structurizr':
      case 'event':
      case 'agile tour':
      case 'bundle':
      case 'filesystem':
      case 'flysystem':
      case 'estimation':
      case 'planning':
      case 'squelette':
      case 'asynchrone':
      case 'domotique':
      case 'gitlab':
      case 'homeassistant':
      case 'gitlab-ci':
      case 'ifttt':
      case 'hue':
      case 'google home':
      case 'hash':
      case 'concepts':
      case 'us':
      case 'securite':
      case 'component':
      case 'import':
      case 'vscode':
      case 'design-thinking':
      case 'linux':
      case 'macos':
      case 'vim':
      case 'i18n':
      case 'traductions':
      case 'intl':
      case 'multilangue':
      case 'saas':
      case 'cloud':
      case 'hooks':
      case 'webperformance':
      case 'http':
      case 'https':
      case 'scrum':
      case 'vulgarisation':
      case 'redux':
      case 'contextapi':
      case 'php 1':
      case 'hexagonal architecture':
      case 'onion architecture':
      case 'retrospective':
      case 'css':
      case 'paris':
      case '2018':
      case 'intégrateur web':
      case 'designer web':
      case 'mysql':
      case 'devfest':
      case 'nantes':
      case 'bdd':
      case 'gherkin':
      case 'continuous integration':
      case 'ci':
      case 'continuous deployment':
      case 'cd':
      case 'messenger':
      case 'software':
      case 'c':
      case 'procédural':
      case 'poo':
      case 'structure':
      case 'pointeurs':
      case 'security':
      case 'confidentiality':
      case 'api':
      case 'libsodium':
      case 'library':
      case 'query':
      case 'filter':
      case 'querybuilder':
      case 'doctrine':
      case 'orm':
      case 'odm':
      case 'expression':
      case 'collection':
      case 'swift':
      case 'mobile':
      case 'xcode':
      case 'coredata':
      case 'realm':
      case 'database':
      case 'ios':
      case 'json':
      case 'behavior':
      case 'phpstorm':
      case 'tests unitaires':
      case 'xdebug':
      case 'android':
      case 'kotlin':
      case 'android maker':
      case 'stream':
      case 'flux':
      case 'protocol':
      case 'wrappers':
      case 'transports':
      case 'filters':
      case 'man-in-the-middle':
      case 'livre-blanc':
      case 'logiciel':
      case 'rabbitmq':
      case 'broker':
      case 'queuing':
      case 'retry':
      case 'dead letter':
      case 'poison message':
      case 'framework':
      case 'api platform':
      case 'gradle':
      case 'flavor':
      case 'environnement':
      case 'static site generation':
      case 'markdown':
      case 'ast':
      case 'app engine':
      case 'test-unitaire':
      case 'gherkins':
      case 'bem':
      case 'html':
      case 'throwable':
      case 'exception':
      case 'error':
      case 'neo4j':
      case 'blog':
      case 'cnil':
      case 'vie privée':
      case 'cookie':
      case 'performance':
      case 'bot':
      case 'slack':
      case 'dialogflow':
      case 'letscreate':
      case 'google':
      case 'firebase':
      case 'notification':
      case 'kernel':
      case 'compilation':
      case 'gentoo':
      case 'prometheus':
      case 'rgpd':
      case 'front':
      case 'mjml':
      case 'mongodb':
      case 'ansible':
      case 'openpgp':
      case 'confiance':
      case 'non classé':
      case 'vps':
      case 'yubikey':
      case 'go':
      case 'fastlane':
      case 'frontend':
      case 'workshop':
      case 'golang':
      case 'worker':
      case 'travis':
      case 'aspell':
      case 'orthographe':
      case 'applications mobile':
      case 'mvc':
      case 'mvp':
      case 'mvvm':
      case 'databinding':
      case 'rest':
      case 'stream video':
      case 'live':
      case 'streaming':
      case 'video':
      case 'push':
      case 'mail':
      case 'tutoriel':
      case 'cache':
      case 'dev ops':
      case 'conferences':
      case 'dot':
      case 'dotccale':
      case 'scalability':
      case 'ajax':
      case 'compression':
      case 'header':
      case 'http2':
      case 'protocole':
      case 'tls':
      case 'test':
      case 'service':
      case 'consul':
      case 'discovery':
      case 'failure':
      case 'detection':
      case 'health':
      case 'check':
      case 'sketchapp':
      case 'tests':
      case 'xctest':
      case 'delegates':
      case 'closure':
      case 'application mobile':
      case 'dév mobile':
      case 'choo':
      case 'console':
      case 'block':
      case 'ssl':
      case 'algorithmie':
      case 'protocoles':
      case 'chiffrement':
      case 'certificats':
      case 'microservice':
      case 'circuit-breaker':
      case 'express':
      case 'tuto':
      case 'rtc':
      case 'real time communication':
      case 'p2p':
      case 'w3c':
      case 'code-coverage':
      case 'atom':
      case 'package':
      case 'mongodays':
      case '#mdbe16':
      case 'best practice':
      case 'objective-c':
      case 'application':
      case 'elasticsearch':
      case 'workflow':
      case 'logs':
      case 'httpkernel':
      case 'paramconverter':
      case 'bestofweb2016':
      case 'tweet':
      case 'irc':
      case 'stackoverflow':
      case 'ddd':
      case 'psr':
      case 'qualité':
      case 'code':
      case 'hyperdrive':
      case 'lightning':
      case 'talk':
      case 'reaction':
      case 'migration':
      case 'form':
      case 'guard':
      case 'routing':
      case 'design pattern':
      case 'directive':
      case 'bestofweb':
      case 'ncrafts':
      case 'cqrs':
      case 'dotscale':
      case 'extension':
      case 'responsive':
      case 'memcached':
      case 'best practices':
      case 'nocode':
      case 'equality':
      case 'history':
      case 'reverse-proxy':
      case 'procedural':
      case 'oop':
      case 'pointers':
      case 'mobile application':
      case 'dev mobile':
      case 'translations':
      case 'multi-language':
      case 'asynchronous':
      case 'dynamic import':
      case 'modules':
      case 'spelling':
      case 'inspect &amp; adapt':
      case 'continuous improvement':
      case 'video stream':
      case 'encryption':
      case 'facebook':
      case 'mobile app':
      case 'protocols':
      default:
        return '';
    }
  });

  return [...new Set(validCategories)].filter((str) => str.length > 0);
};
