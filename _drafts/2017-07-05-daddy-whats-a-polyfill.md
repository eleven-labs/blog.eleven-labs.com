With the advent of js native, and the multiplication of browsers and environments (mobile, desktop, tablet), we hear more and more in our open-spaces:
<blockquote>"You would not know a polyfill?"</blockquote>
But who is this polyfill?

<!--more-->
<h4>Definition :</h4>
A polyfill is simple. It is a set of functions to simulate, on an old <a href="https://fr.wikipedia.org/wiki/Navigateur_web">web browser</a>, features that are not natively available. (Cf: Wikipedia)

Clearly, it's like back then with double CSS, one specially for IE and one for the rest. Today browsers do not implement at the same speed the new features available by native javascript. We must then use a polyfill for it to be available everywhere.

And here I hear you say to me:
<blockquote>"But is not that what Jquery is already doing?"</blockquote>
So no, that's not exactly what Jquery is doing. Indeed, the latter is an overlay that allows to use the same functions js on all browsers, but it is not a polyfill, because it renames the functions and does not directly use the native function.

Again, you will say to me:
<blockquote>"But what is polyfill?"</blockquote>
It's simple. Let's take the native function javascript "<a href="https://developer.mozilla.org/fr/docs/Web/API/Fetch_API/Using_Fetch">fetch</a>", which allows to call urls in XHR. If you go to the <a href="http://caniuse.com/#search=fetch">Can I Use ?</a> Site, you will see that you can not use this function on IOS 10. Then you can use the "ajax" function of Jquery but in exchange you loaded the whole of Jquery and don't use the power of your browser. This is where you need the polyfill "fetch" available here <a href="https://github.com/github/fetch">https://github.com/github/fetch</a>. Simply import it and then the "fetch" function will be available for all browsers, even IOS 10.

C'est simple. Prenons la fonction native javascript "<a href="https://developer.mozilla.org/fr/docs/Web/API/Fetch_API/Using_Fetch">fetch</a>", qui permet d'appeler des urls en XHR. Si vous allez sur le site <a href="http://caniuse.com/#search=fetch">Can I Use ?</a>, vous verrez que vous ne pouvez pas utiliser cette fonction sur IOS 10.  Alors vous pouvez utiliser la fonction "ajax" de Jquery mais en échange vous avez chargé l'ensemble de Jquery et n'utilisez pas la puissance de votre navigateur. C'est là qu'il vous faut le polyfill "fetch" disponible ici <a href="https://github.com/github/fetch">https://github.com/github/fetch</a>.  Il vous suffit de l'importer et alors la fonction "fetch" sera disponible pour l'ensemble des navigateurs, même IOS 10.

And now I hear you again:
<blockquote>"I do not find my polyfill, so how do I develop it?"</blockquote>
<h4>How to implement a polyfill?</h4>
We will make it simple, today we want to use the function <span class="lang:default decode:true  crayon-inline">Object.assign()</span>  to create a new object js.

If you go to <a href="http://caniuse.com/">Can I Use</a> you can find the <a href="http://kangax.github.io/compat-table/es6/#test-Object_static_methods_Object.assign">following page</a>:

<a href="http://blog.eleven-labs.com/wp-content/uploads/2016/12/Capture-d’écran-2016-12-11-à-17.38.08.png"><img class="aligncenter size-large wp-image-2893" src="http://blog.eleven-labs.com/wp-content/uploads/2016/12/Capture-d’écran-2016-12-11-à-17.38.08-1024x194.png" alt="" width="1024" height="194" /></a>

So as you can see, the function is not implemented on IE11. So we'll do the polyfill ourselves.
It is sufficient to first check the existence of the function:
<pre class="lang:js decode:true" title="Polyfill - exist">if (typeof Object.assign != 'function') {
  //The function doesn't exist
}</pre>
If it does not exist then it is overloaded with our polyfill, and in js it is enough to define the function:
<pre class="lang:js decode:true  " title="Polyfill assign function">if (typeof Object.assign != 'function') {
  Object.assign = function (target, varArgs) {
    'use strict';
    // TODO
  };
}</pre>
And now we are developing:
<pre class="lang:js decode:true " title="Polyfill Object Assign">if (typeof Object.assign != 'function') {
  Object.assign = function (target, varArgs) {
    'use strict';
    if (target == null) { // TypeError if undefined or null
      throw new TypeError('Cannot convert undefined or null to object');
    }

    var to = Object(target);

    for (var index = 1; index &lt; arguments.length; index++) {
      var nextSource = arguments[index];

      if (nextSource != null) { // Skip over if undefined or null
        for (var nextKey in nextSource) {
          // Avoid bugs when hasOwnProperty is shadowed
          if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
    }
    return to;
  };
}</pre>
There you go ! You have a polyfill!

Normally there is a polyfill for everything so before implementing it, go to Google.
