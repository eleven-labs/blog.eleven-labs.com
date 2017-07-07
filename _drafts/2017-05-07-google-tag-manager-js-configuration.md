The management of external javascript tags can very quickly become a real ordeal. If you look at the big media sites with the <a href="https://chrome.google.com/webstore/detail/ghostery/mlomiejdfkolichcflejclcbmpeaniij?hl=fr">Ghostery</a> extension you will notice that each site loads about 20 cookies, which gives so many javascript tags. But how to control the different versions, the publication, the changes? This is where Google Tag Manager comes in.

<!--more-->
<h3>To do what ?</h3>
You'll understand, Google Tag Manager will serve you to control your javascript tags. It allows you to store them all in one place. Today you put them directly into your code, which makes binding every change because often requires a putting into production. In addition to storing them, you can also publish them at any time and Google Tag Manager allows you to keep each version in memory and rollback easily. One of the biggest benefits of Google Tag Manager is that it allows you to create and use variables that you can then use in your code, the so-called DataLayer.
<h3>How to use ?</h3>
You can visit the <a href="https://tagmanager.google.com">Google Tag Manager</a> site. You have to configure your site.

<a href="http://blog.eleven-labs.com/wp-content/uploads/2017/05/Capture-d’écran-2017-05-26-à-10.49.46.png"><img class="aligncenter size-large wp-image-3879" src="http://blog.eleven-labs.com/wp-content/uploads/2017/05/Capture-d’écran-2017-05-26-à-10.49.46-1024x380.png" alt="" width="1024" height="380" /></a>

The first thing to configure is the type of container you need.

<a href="http://blog.eleven-labs.com/wp-content/uploads/2017/05/Capture-d’écran-2017-05-26-à-10.50.52.png"><img class="aligncenter size-large wp-image-3880" src="http://blog.eleven-labs.com/wp-content/uploads/2017/05/Capture-d’écran-2017-05-26-à-10.50.52-1024x424.png" alt="" width="1024" height="424" /></a>

You will choose Web. You just have to put the script on your site. This is a classic javascript tag in the <span class="lang:default decode:true crayon-inline ">&lt;head&gt;</span>  tag of your site.

<a href="http://blog.eleven-labs.com/wp-content/uploads/2017/05/Capture-d’écran-2017-05-26-à-10.53.20.png"><img class="aligncenter size-large wp-image-3881" src="http://blog.eleven-labs.com/wp-content/uploads/2017/05/Capture-d’écran-2017-05-26-à-10.53.20-1024x388.png" alt="" width="1024" height="388" /></a>

You will be taken to the home page, where you will find information about the latest version of your Google Tag Manager as well as the changes in progress.

<a href="http://blog.eleven-labs.com/wp-content/uploads/2017/05/Capture-d’écran-2017-05-26-à-11.01.29.png"><img class="aligncenter size-large wp-image-3883" src="http://blog.eleven-labs.com/wp-content/uploads/2017/05/Capture-d’écran-2017-05-26-à-11.01.29-1024x529.png" alt="" width="1024" height="529" /></a>

You can now start using Google Tag Manager.
<h3>Test project</h3>
Now, let's do a mini test project. You only need a web server and a few HTML pages.

Let's start by creating the next HTML page.
<pre class="lang:default decode:true" title="Test 1">&lt;html&gt;
&lt;head&gt;
  &lt;!-- Google Tag Manager --&gt;
  &lt;script&gt;(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&amp;l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','GTM-5JQJFQV');&lt;/script&gt;
  &lt;!-- End Google Tag Manager --&gt;
&lt;/head&gt;
&lt;body&gt;
  TEST GTM
&lt;/body&gt;
&lt;/html&gt;
</pre>
Only the Google Tag Manager script is placed there.

Then go back to the Google Tag Manager interface and create your first workspace. Click "Default Workspace" at the top left. Then create your workspace, this is a workspace that allows you to make a sort of Pull Request (we'll see later).

<a href="http://blog.eleven-labs.com/wp-content/uploads/2017/05/Capture-d’écran-2017-05-27-à-12.42.42.png"><img class="aligncenter size-large wp-image-3888" src="http://blog.eleven-labs.com/wp-content/uploads/2017/05/Capture-d’écran-2017-05-27-à-12.42.42-1024x566.png" alt="" width="1024" height="566" /></a>

Once the workspace is created, we'll go into "preview mode" to see the changes to the Google Tag Manager, as well as activate the debugger directly in your web page. Simply click on "Preview" at the top right.

<a href="http://blog.eleven-labs.com/wp-content/uploads/2017/05/Capture-d’écran-2017-05-27-à-12.48.11.png"><img class="aligncenter size-large wp-image-3889" src="http://blog.eleven-labs.com/wp-content/uploads/2017/05/Capture-d’écran-2017-05-27-à-12.48.11-1024x521.png" alt="" width="1024" height="521" /></a>

What's handy with Preview is that you can share it with other people, just click "Share Preview" and send the link provided by Google Tag Manager. This allows you to make the changes you need and have them tested prior to production.

<a href="http://blog.eleven-labs.com/wp-content/uploads/2017/05/Capture-d’écran-2017-05-27-à-12.49.57.png"><img class="aligncenter size-large wp-image-3890" src="http://blog.eleven-labs.com/wp-content/uploads/2017/05/Capture-d’écran-2017-05-27-à-12.49.57-1024x555.png" alt="" width="1024" height="555" /></a>

Go back to your web page, you should see at the bottom of the Google Tag Manager debug console.

<a href="http://blog.eleven-labs.com/wp-content/uploads/2017/05/Capture-d’écran-2017-05-27-à-12.52.55.png"><img class="aligncenter size-large wp-image-3891" src="http://blog.eleven-labs.com/wp-content/uploads/2017/05/Capture-d’écran-2017-05-27-à-12.52.55-1024x564.png" alt="" width="1024" height="564" /></a>

We will put the first tag, to make simple it will be only a small <span class="lang:default decode:true crayon-inline ">alert ('GTM')</span> . Click tag in the left column, then "New".

<a href="http://blog.eleven-labs.com/wp-content/uploads/2017/05/Capture-d’écran-2017-05-27-à-12.56.08.png"><img class="aligncenter size-large wp-image-3893" src="http://blog.eleven-labs.com/wp-content/uploads/2017/05/Capture-d’écran-2017-05-27-à-12.56.08-1024x438.png" alt="" width="1024" height="438" /></a>

Then click on "Tag Configuration" and choose "Custom HTML", as you can see, there are many pre-configured tags, I invite you to look at those that might interest you.

<a href="http://blog.eleven-labs.com/wp-content/uploads/2017/05/Capture-d’écran-2017-05-27-à-12.58.48.png"><img class="aligncenter size-large wp-image-3897" src="http://blog.eleven-labs.com/wp-content/uploads/2017/05/Capture-d’écran-2017-05-27-à-12.58.48-1024x530.png" alt="" width="1024" height="530" /></a>

In the "textarea" I invite you to put the following code.
<pre class="lang:default decode:true ">&lt;script&gt;
  alert("GTM");
&lt;/script&gt;</pre>
Then you have to choose the trigger, the trigger lets you know when the tag should activate.

<a href="http://blog.eleven-labs.com/wp-content/uploads/2017/05/Capture-d’écran-2017-05-27-à-13.01.18.png"><img class="aligncenter size-large wp-image-3900" src="http://blog.eleven-labs.com/wp-content/uploads/2017/05/Capture-d’écran-2017-05-27-à-13.01.18-1024x557.png" alt="" width="1024" height="557" /></a>

You can create your own trigger, but for now I invite you to take the default "All page" trigger that will activate the tag on every page viewed. All you have to do is name the tag and save it.

<a href="http://blog.eleven-labs.com/wp-content/uploads/2017/05/Capture-d’écran-2017-05-27-à-13.03.47.png"><img class="aligncenter size-large wp-image-3902" src="http://blog.eleven-labs.com/wp-content/uploads/2017/05/Capture-d’écran-2017-05-27-à-13.03.47-1024x499.png" alt="" width="1024" height="499" /></a>

You just have to "Refresh" the preview and return to your web page, the alert should be displayed.

<a href="http://blog.eleven-labs.com/wp-content/uploads/2017/05/Capture-d’écran-2017-05-27-à-13.05.10.png"><img class="aligncenter size-large wp-image-3904" src="http://blog.eleven-labs.com/wp-content/uploads/2017/05/Capture-d’écran-2017-05-27-à-13.05.10-1024x171.png" alt="" width="1024" height="171" /></a>

Now we will create a new page "category.html" with exactly the same code.
<pre class="lang:default decode:true " title="Category.html">&lt;html&gt;
&lt;head&gt;
  &lt;!-- Google Tag Manager --&gt;
  &lt;script&gt;(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&amp;l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','GTM-5JQJFQV');&lt;/script&gt;
  &lt;!-- End Google Tag Manager --&gt;
&lt;/head&gt;
&lt;body&gt;
  TEST GTM
&lt;/body&gt;
&lt;/html&gt;
</pre>
If you go to the page you should have the same "alert".
<h5>How do manage two different alerts?</h5>
We will first use the triggers, go back to the Google Tag Manager interface and click on triggers in the left column and then "new". You get to a page to create a trigger. Click "Trigger configuration" and choose "Page view".

<a href="http://blog.eleven-labs.com/wp-content/uploads/2017/05/Capture-d’écran-2017-05-27-à-17.58.03.png"><img class="aligncenter size-large wp-image-3935" src="http://blog.eleven-labs.com/wp-content/uploads/2017/05/Capture-d’écran-2017-05-27-à-17.58.03-1024x497.png" alt="" width="1024" height="497" /></a>

Now, we will choose when the trigger should activate, so choose "Some page views". At this point, you will be able to choose when the trigger "Page view" should activate, for this example we will choose to look at the "Page Path" and depending on what it contains we will launch the trigger.

<a href="http://blog.eleven-labs.com/wp-content/uploads/2017/05/Capture-d’écran-2017-05-27-à-18.02.31.png"><img class="aligncenter size-large wp-image-3936" src="http://blog.eleven-labs.com/wp-content/uploads/2017/05/Capture-d’écran-2017-05-27-à-18.02.31-1024x365.png" alt="" width="1024" height="365" /></a>

Name your trigger and save it. Re-do this by creating a trigger for the index page.

<a href="http://blog.eleven-labs.com/wp-content/uploads/2017/05/Capture-d’écran-2017-05-27-à-18.05.09.png"><img class="aligncenter size-large wp-image-3937" src="http://blog.eleven-labs.com/wp-content/uploads/2017/05/Capture-d’écran-2017-05-27-à-18.05.09-1024x320.png" alt="" width="1024" height="320" /></a>

Now, we will modify our tag "ALERT 1", to do this click on the tag then click to modify the trigger. The two triggers you have created must appear in the right column.

<a href="http://blog.eleven-labs.com/wp-content/uploads/2017/05/Capture-d’écran-2017-05-27-à-18.08.06.png"><img class="aligncenter size-large wp-image-3938" src="http://blog.eleven-labs.com/wp-content/uploads/2017/05/Capture-d’écran-2017-05-27-à-18.08.06-1024x552.png" alt="" width="1024" height="552" /></a>

I invite you to choose the "Index Page" trigger, save and refresh your preview. If you go to your page "index.html" you should see your "alert" but not on the page "category.html", besides in the debug console you see that no trigger was called.

<a href="http://blog.eleven-labs.com/wp-content/uploads/2017/05/Capture-d’écran-2017-05-27-à-18.12.45.png"><img class="aligncenter size-large wp-image-3939" src="http://blog.eleven-labs.com/wp-content/uploads/2017/05/Capture-d’écran-2017-05-27-à-18.12.45-1024x414.png" alt="" width="1024" height="414" /></a>

There is a lot of trigger, you can create it yourself, which allows you to perform many custom actions.

Go back by changing the trigger so that all pages start the alert. We will use the "variables" and set up a "data layer". Click on "variables" in the left column, where you will find the variables provided directly by Google Tag Manager and the variables you can add.

<a href="http://blog.eleven-labs.com/wp-content/uploads/2017/05/Capture-d’écran-2017-05-27-à-18.21.01.png"><img class="aligncenter size-large wp-image-3940" src="http://blog.eleven-labs.com/wp-content/uploads/2017/05/Capture-d’écran-2017-05-27-à-18.21.01-1024x528.png" alt="" width="1024" height="528" /></a>

We will add a variable, click on "New", then on "configuration variable".

<a href="http://blog.eleven-labs.com/wp-content/uploads/2017/05/Capture-d’écran-2017-05-27-à-18.23.04.png"><img class="aligncenter size-large wp-image-3941" src="http://blog.eleven-labs.com/wp-content/uploads/2017/05/Capture-d’écran-2017-05-27-à-18.23.04-1024x562.png" alt="" width="1024" height="562" /></a>

Choose "Variable Javascript" and give a name to your variable then save.

<a href="http://blog.eleven-labs.com/wp-content/uploads/2017/05/Capture-d’écran-2017-05-27-à-18.25.42.png"><img class="aligncenter size-large wp-image-3942" src="http://blog.eleven-labs.com/wp-content/uploads/2017/05/Capture-d’écran-2017-05-27-à-18.25.42-1024x522.png" alt="" width="1024" height="522" /></a>

Go back to the configuration of your tag, and change the custom HTML by putting the <span class="lang:default decode:true crayon-inline ">{{NAME OF YOUR VARIABLE}}</span>  in place of the message. Save your tag and make a "refresh" of your preview.
<pre class="lang:default decode:true">&lt;script&gt;
  alert("{{Message Alert}}");
&lt;/script&gt;</pre>
Now you have to set up your data layer in your HTML pages, and add your variables before calling the Google Tag Manager script.
<pre class="lang:default decode:true" title="index.html">&lt;html&gt;
&lt;head&gt;
  &lt;script&gt;
  alertMsg = 'index';
  &lt;/script&gt;
  &lt;!-- Google Tag Manager --&gt;
  &lt;script&gt;(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&amp;l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','GTM-5JQJFQV');&lt;/script&gt;
  &lt;!-- End Google Tag Manager --&gt;
&lt;/head&gt;
&lt;body&gt;
  TEST GTM
&lt;/body&gt;
&lt;/html&gt;
</pre>
So you can choose your alert message by setting the value to <span class="lang:default decode:true crayon-inline">alertMsg</span>. You can see your variables directly in the debug console.

<a href="http://blog.eleven-labs.com/wp-content/uploads/2017/05/Capture-d’écran-2017-05-27-à-18.36.39.png"><img class="aligncenter size-large wp-image-3943" src="http://blog.eleven-labs.com/wp-content/uploads/2017/05/Capture-d’écran-2017-05-27-à-18.36.39-1024x437.png" alt="" width="1024" height="437" /></a>

You can put a lot of information into your "data layer", which allows you to use and configure each of your tags according to your page.

Now that we have finished our work, we will publish our "container". Go back to the Google Tag Manager interface and click on "Submit" at the top right. You will be taken to a page showing all changes. Choose your version name and a description to click "publish".

<a href="http://blog.eleven-labs.com/wp-content/uploads/2017/05/Capture-d’écran-2017-05-27-à-18.40.08.png"><img class="aligncenter size-large wp-image-3944" src="http://blog.eleven-labs.com/wp-content/uploads/2017/05/Capture-d’écran-2017-05-27-à-18.40.08-1024x550.png" alt="" width="1024" height="550" /></a>

You are redirected to the page of your version, you can return to your site and now all users are on the new version. You can exit debug mode.

The versions allow, as for git, to go back on certain versions and to follow the evolution of your tags.
<h3>In conclusion</h3>
Google Tag Manager is a very complete tool that finally allows to manage your javascript tags without putting into production your site. There are many features that I have not explained, I invite you to take a walk in the product. If you want to know more, leave me a comment.
