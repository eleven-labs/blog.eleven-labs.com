--- layout: post title: Create your first Atom package author:
vcomposieux date: '2016-12-05 17:34:21 +0100' date\_gmt: '2016-12-05
16:34:21 +0100' categories: - Non classé tags: - atom - babel - jasmine
- package --- {% raw %}

Introduction to Atom
--------------------

[Atom](https://atom.io) is an open-source text editor (mostly used by
developers) which is multi-platform and developed by GitHub company. It
is based on [Electron](http://electron.atom.io/), the Github-developed
framework, which allows developers to build native desktop applications
for any operating systems by writing Javascript code.

The main interesting feature of Atom is that it also has a great package
management tool and packages are also written in Javascript so it's
quite easy for anyone to create one. This article aims to talk about it.

Finally, its community is also active as it already has a lot of
available packages: **5 285** at this time.\
You can browse all packages by going to the following address:
<https://atom.io/packages>

However, if you cannot find a package that fits your needs you can start
creating your own and we will see how simple it is.

 

Generate your first package
---------------------------

In order to create your own package, don't worry, you will not start
from scratch. Indeed, we will use the [Package Generator]{.lang:default
.highlight:0 .decode:true .crayon-inline}  command which is brought to
us by Atom core.

To do that, you will just have to navigate into
 [Packages]{.lang:default .highlight:0 .decode:true
.crayon-inline} -&gt; [Package Generator]{.lang:default .highlight:0
.decode:true .crayon-inline} -&gt; [Generate Atom Package]{.lang:default
.highlight:0 .decode:true .crayon-inline}.

\[note\]In order to generate your package, you can choose the language
between **Javascript**  and **Coffeescript** . This article will
use Javascript.\[/note\]

When the command is executed, Atom will open a new window into your
package project, by default named [my-package]{.lang:default
.highlight:0 .decode:true .crayon-inline} .

 

Package structure
-----------------

We will now see in details what's inside our package project directory:

``` {.lang:default .highlight:0 .decode:true}
├── CHANGELOG.md
├── LICENSE.md
├── README.md
├── keymaps
│   └── my-package.json         <- Key shortcuts registered by your package
├── lib
│   ├── my-package-view.js
│   └── my-package.js           <- Entry point of your package
├── menus
│   └── my-package.json         <- Menus declaration of your package into Atom application
├── package.json                <- Description and library dependencies of your package
├── spec                        <- Tests directory (Jasmine) of your package
│   ├── my-package-spec.js
│   └── my-package-view-spec.js
└── styles                      <- Stylesheets used by your package
└── my-package.less
```

The first element to add to your package is
the [package.json]{.lang:default .highlight:0 .decode:true
.crayon-inline}  file which has to contain all information of your
package such as its name, version, license type, keywords that will
enable you to find your package into Atom registry and also your package
dependancies.

Please also note that there is a section
called [activationCommands]{.lang:default .highlight:0 .decode:true
.crayon-inline}  which allows to define the executed command when your
package is loaded.

Next, we have the [keymaps/my-package.json]{.lang:default .highlight:0
.decode:true .crayon-inline}  file which allows you to define shortcuts
into your package very easily. Here is the default example:

``` {.lang:js .decode:true}
{
  "atom-workspace": {
    "ctrl-alt-p": "my-package:toggle"
  }
}
```

Next, we will go into your package entry point. It is located
into [lib/my-package.js]{.lang:default .highlight:0 .decode:true
.crayon-inline} file.

This file exports a default object which contains
a [subscriptions]{.lang:default .highlight:0 .decode:true
.crayon-inline}  property and also [activate()]{.lang:default
.highlight:0 .decode:true .crayon-inline} 
and [deactivate()]{.lang:default .highlight:0 .decode:true
.crayon-inline}  methods.

During package activation (inside [activate()]{.lang:default
.highlight:0 .decode:true .crayon-inline} method), we will register
a [CompositeDisposable](https://atom.io/docs/api/latest/CompositeDisposable) type
object inside our [subscriptions]{.lang:default .highlight:0
.decode:true .crayon-inline}  property and that will allow us to add and
maybe later remove some commands offered by our package:

``` {.lang:js .decode:true}
activate(state) {
  this.subscriptions = new CompositeDisposable();
  this.subscriptions.add(atom.commands.add('atom-workspace', {
    'my-package:toggle': () => this.toggle()
  }));
}
```

Now that our command is registered, we can test it by simply typing the
following words, into the Atom command palette: [My Package:
Toggle]{.lang:default .highlight:0 .decode:true .crayon-inline} .\
This command will execute the code contained in
the [toggle()]{.lang:default .highlight:0 .decode:true .crayon-inline} 
method of the class and will display a little modal at the top of the
window.

You can add as many commands as you want and I really encourage you to
decouple your code.

 

Add settings for your package
-----------------------------

The [Config](https://atom.io/docs/api/latest/Config) component allows
your package to have some settings.

To add a new setting, you just have to define a [config]{.lang:default
.highlight:0 .decode:true .crayon-inline}  property into your package's
class which is an object containing each settings definition, as
follows:

``` {.lang:js .decode:true}
config: {
  "gitlabUrl": {
    "description": "If you rely on a private Gitlab server, please type your base URI here (default: https://gitlab.com).",
    "type": "string",
    "default": "https://gitlab.com"
  }
}
```

Atom settings allow multiple setting types ([boolean]{.lang:default
.highlight:0 .decode:true .crayon-inline} , [color]{.lang:default
.highlight:0 .decode:true .crayon-inline} , [integer]{.lang:default
.highlight:0 .decode:true .crayon-inline} , [string]{.lang:default
.highlight:0 .decode:true .crayon-inline} , ...) so it can fit your
needs on setting values by your users.

Once it is added, if you reload your package, you will see your package
settings appearing into Atom settings:

![Atom -
Settings](http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-24-à-13.58.11.png){.size-full
.wp-image-2642 .aligncenter width="755" height="103"}[\
](http://blog.eleven-labs.com/wp-content/uploads/2016/11/Capture-d’écran-2016-11-24-à-13.56.01.png)

In order to retrieve the value (or default value) defined by a user for
a given setting in your code, you just have to use the following line:

``` {.lang:js .decode:true}
let gitlabUrl = atom.config.get('gitlabUrl');
```

Components overview
-------------------

So you are now ready to develop your package. We will have a quick
overview of some interesting components that Atom brings to you and
allows you to use in your package.

**TextEditor: Interact with the text editor**

With the [TextEditor]{.lang:default .highlight:0 .decode:true
.crayon-inline} component, you will be able to insert some text into
user's text editor, to save the current file, to go back and forth the
history, to move the cursor into editor, to copy/paste into clipboard,
to play with line indentation, to scroll, and to do so much more...

Here are some examples to insert text in a specific position and to save
the file automatically:

``` {.lang:js .decode:true}
editor.setCursorBufferPosition([row, column]);
editor.insertText('foo');
editor.save();
```

**ViewRegistry & View: Create and display your own window**

These components allow you to create views (modals / windows) inside
Atom and display them.\
You have an example of a modal [View]{.lang:default .highlight:0
.decode:true .crayon-inline} into the default package:

``` {.lang:js .decode:true}
export default class MyPackageView {
  constructor(serializedState) {
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('my-package');

    // Create message element
    const message = document.createElement('div');
    message.textContent = 'The MyPackage package is Alive! It
NotificationManager & Notification: Alert your users with notifications
Your package can also display a variety of notifications from "success" to "fatal error":
atom.notifications.addSuccess('My success notification');
atom.notifications.addInfo('My info notification');
atom.notifications.addWarning('My warning notification');
atom.notifications.addError('My error notification');
atom.notifications.addFatalError('My fatal error notification');
```

**GitRepository**

This one is also really interesting: indeed, you can access all the git
properties of the current git repository that is used.

This way, you will be able to access the current branch name, the
repository remote URL and also see if a file is considered as a new or
modified file. Let's see it in action:

``` {.lang:js .decode:true}
let repository = atom.project.getRepositoryForDirectory('/path/to/project');

console.log(repository.getOriginURL());               // -> git@github.com:eko/atom-pull-request.git
console.log(repository.getShortHead());               // -> master
console.log(repository.isStatusNew('/path/to/file')); // -> true
```

**And more things to discover...**

We just made a review of the components that I played with but I invite
you to read more on the following link if you want to go further:
<https://atom.io/docs/api/latest/AtomEnvironment>

 

Test your package with specs
----------------------------

Our package is now developed but we don't have to forget about the
tests. To do that, Atom uses [Jasmine](https://jasmine.github.io/).

Your default package already has a prepared test file:

``` {.lang:js .decode:true}
import MyPackageView from '../lib/my-package-view';

describe('MyPackageView', () => {
  it('has one valid test', () => {
    expect('life').toBe('easy');
  });
});
```

Jasmine specs tests are written in the following way:

-   [describe()]{.lang:default .highlight:0 .decode:true
    .crayon-inline} : A Jasmine test suite starts with a "describe"
    function which takes a name as the first argument and a function as
    the second,
-   [it()]{.lang:default .highlight:0 .decode:true .crayon-inline} : A
    specification is added by using this function, "it" has to be
    contained into a specification,
-   [expect()]{.lang:default .highlight:0 .decode:true .crayon-inline} :
    This one is an assertion, when we expect something to happen.

This is now your turn to play with Jasmine and test your package logic.

In order to run the specs tests, you just have to navigate into the
following menu: [View]{.lang:default .highlight:0 .decode:true
.crayon-inline}  -&gt; [Packages]{.lang:default .highlight:0
.decode:true .crayon-inline}  -&gt; [Run Package Specs]{.lang:default
.highlight:0 .decode:true .crayon-inline} .

 

Publish your package
--------------------

Our package is now ready to be deployed! Let's send it.

![Atom -
Fusée](http://blog.eleven-labs.com/wp-content/uploads/2016/11/fusee.gif){.size-full
.wp-image-2635 .aligncenter width="410" height="470"}

To do that, we will use the [apm]{.lang:default .highlight:0
.decode:true .crayon-inline}  CLI tool which comes with Atom when
installing it.\
After pushing your code into a Github repository, simply go into your
package directory and type the following command:

``` {.lang:sh .decode:true}
$ apm publish --tag v0.0.1 minor

Preparing and tagging a new version ✓
Pushing v0.0.1 tag ✓
...
```

This command will be in charge of creating the new version tag into
repository and publish this version into the Atom registry.

Congratulations, your package is now published and available on the
following URL: **https://atom.io/packages/***&lt;your-package&gt;*!

 

Continuous Integration
----------------------

The final step is to ensure that your package will continue to work in
the future when you or your contributors will add new features but also
when Atom releases a new beta version. To do that, you can
use [Travis-CI](https://travis-ci.org) on your repository with the
following configuration:

``` {.lang:yaml .decode:true}
language: objective-c

notifications:
  email:
    on_success: never
    on_failure: change

script: 'curl -s https://raw.githubusercontent.com/nikhilkalige/docblockr/develop/spec/atom-build-package.sh | sh'

env:
  global:
    - APM_TEST_PACKAGES=""

  matrix:
    - ATOM_CHANNEL=stable
    - ATOM_CHANNEL=beta
```

Conclusion
----------

I personally think that this is a little revolution to allow developers
to make their own editor and bring the features they want.

Moreover, the Atom API is already very rich and very simple to use and
this is certainly the main reason why the community offers a large
number of packages.

To conclude, as for all libraries, it is not useful to reinvent the
wheel by creating already existing packages. The idea is to add features
if they don't already exists, in order to enrich your user experience.

s ALIVE!'; message.classList.add('message');
this.element.appendChild(message); } // ... } let myPackageView = new
MyPackageView(state.myPackageViewState); let modalPanel =
atom.workspace.addModalPanel({ item: myPackageView.getElement(),
visible: false; }); modalPanel.show();

**NotificationManager & Notification: Alert your users with
notifications**

Your package can also display a variety of notifications from "success"
to "fatal error":

``` {.lang:js .decode:true}
atom.notifications.addSuccess('My success notification');
atom.notifications.addInfo('My info notification');
atom.notifications.addWarning('My warning notification');
atom.notifications.addError('My error notification');
atom.notifications.addFatalError('My fatal error notification');
```

**GitRepository**

This one is also really interesting: indeed, you can access all the git
properties of the current git repository that is used.

This way, you will be able to access the current branch name, the
repository remote URL and also see if a file is considered as a new or
modified file. Let's see it in action:

``` {.lang:js .decode:true}
let repository = atom.project.getRepositoryForDirectory('/path/to/project');

console.log(repository.getOriginURL());               // -> git@github.com:eko/atom-pull-request.git
console.log(repository.getShortHead());               // -> master
console.log(repository.isStatusNew('/path/to/file')); // -> true
```

**And more things to discover...**

We just made a review of the components that I played with but I invite
you to read more on the following link if you want to go further:
<https://atom.io/docs/api/latest/AtomEnvironment>

 

Test your package with specs
----------------------------

Our package is now developed but we don't have to forget about the
tests. To do that, Atom uses [Jasmine](https://jasmine.github.io/).

Your default package already has a prepared test file:

``` {.lang:js .decode:true}
import MyPackageView from '../lib/my-package-view';

describe('MyPackageView', () => {
  it('has one valid test', () => {
    expect('life').toBe('easy');
  });
});
```

Jasmine specs tests are written in the following way:

-   [describe()]{.lang:default .highlight:0 .decode:true
    .crayon-inline} : A Jasmine test suite starts with a "describe"
    function which takes a name as the first argument and a function as
    the second,
-   [it()]{.lang:default .highlight:0 .decode:true .crayon-inline} : A
    specification is added by using this function, "it" has to be
    contained into a specification,
-   [expect()]{.lang:default .highlight:0 .decode:true .crayon-inline} :
    This one is an assertion, when we expect something to happen.

This is now your turn to play with Jasmine and test your package logic.

In order to run the specs tests, you just have to navigate into the
following menu: [View]{.lang:default .highlight:0 .decode:true
.crayon-inline}  -&gt; [Packages]{.lang:default .highlight:0
.decode:true .crayon-inline}  -&gt; [Run Package Specs]{.lang:default
.highlight:0 .decode:true .crayon-inline} .

 

Publish your package
--------------------

Our package is now ready to be deployed! Let's send it.

![Atom -
Fusée](http://blog.eleven-labs.com/wp-content/uploads/2016/11/fusee.gif){.size-full
.wp-image-2635 .aligncenter width="410" height="470"}

To do that, we will use the [apm]{.lang:default .highlight:0
.decode:true .crayon-inline}  CLI tool which comes with Atom when
installing it.\
After pushing your code into a Github repository, simply go into your
package directory and type the following command:

``` {.lang:sh .decode:true}
$ apm publish --tag v0.0.1 minor

Preparing and tagging a new version ✓
Pushing v0.0.1 tag ✓
...
```

This command will be in charge of creating the new version tag into
repository and publish this version into the Atom registry.

Congratulations, your package is now published and available on the
following URL: **https://atom.io/packages/***&lt;your-package&gt;*!

 

Continuous Integration
----------------------

The final step is to ensure that your package will continue to work in
the future when you or your contributors will add new features but also
when Atom releases a new beta version. To do that, you can
use [Travis-CI](https://travis-ci.org) on your repository with the
following configuration:

``` {.lang:yaml .decode:true}
language: objective-c

notifications:
  email:
    on_success: never
    on_failure: change

script: 'curl -s https://raw.githubusercontent.com/nikhilkalige/docblockr/develop/spec/atom-build-package.sh | sh'

env:
  global:
    - APM_TEST_PACKAGES=""

  matrix:
    - ATOM_CHANNEL=stable
    - ATOM_CHANNEL=beta
```

Conclusion
----------

I personally think that this is a little revolution to allow developers
to make their own editor and bring the features they want.

Moreover, the Atom API is already very rich and very simple to use and
this is certainly the main reason why the community offers a large
number of packages.

To conclude, as for all libraries, it is not useful to reinvent the
wheel by creating already existing packages. The idea is to add features
if they don't already exists, in order to enrich your user experience.

{% endraw %}
