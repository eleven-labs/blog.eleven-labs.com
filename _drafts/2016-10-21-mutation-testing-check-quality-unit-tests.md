---
layout: post
title: Mutation Testing - Check the quality of your unit tests
author: rgraillon
date: '2016-10-21 11:00:27 +0200'
date_gmt: '2016-10-21 09:00:27 +0200'
categories:
- Non classé
tags: []
---

### **Unit tests and trust**
It is well established : unit tests are mandatory when developing an application. They allow to highlight possible regressions when code is modified, so the developer gets a certain confidence when shipping his code to production : If tests do pass, everything works correctly.

To measure this confidence, we use code coverage as our main metric. The more your code is covered, (close to 100%), the less chance there is that regressions would fall through the net.

But be careful ! This affirmation is a pure theory !

### **Coverage vs protection**
We are going to see that sometimes, code coverage is a false indicator of protection.<br />
Here is a simple example :

<pre class="lang:php decode:true">
{% raw %}
&lt;?php

class Astronaut {}

class SpaceShip
{
    private $capacity;
    public $astronauts = [];

    public function __construct($capacity)
    {
        $this-&gt;capacity = $capacity;
    }

    public function addAstronaut(Astronaut $astronaut)
    {
        if (count($this-&gt;astronauts) &lt; $this-&gt;capacity) {
            $this-&gt;astronauts[] = $astronaut;
        }
    }
}
{% endraw %}
</pre>

The <em>SpaceShip</em> class has a public method <em>addAstronaut</em> which adds an instance of <em>Astronaut</em> only if maximum capacity is not reached. Let's see the associated unit test :

<pre class="lang:php decode:true">
{% raw %}
&lt;?php

class SpaceShipTest extends \PHPUnit_Framework_TestCase
{
    public function testAddAstronaut()
    {
        $spaceShip = new SpaceShip(1);

        $spaceShip-&gt;addAstronaut(new Astronaut());

        $this-&gt;assertCount(1, $spaceShip-&gt;astronauts);
    }
}
{% endraw %}
</pre>

The test checks that the method is actually adding an entry to the astronaut array. When we launch the tests, we have a code coverage of 100% (even without assertion we would still have this result).<br />
But we are not protected enough : what would happen if the <em>addAstronaut</em> method changed ?<br />
Would our test be sufficient to detect the regression ?

### **Mutation Tests**
In order to detect breaches in your unit tests, one solution exist : **mutation tests**.<br />
The principle is very simple : alter the source code to check that associated tests would fail accordingly.

To get to this, here are the required steps :

<ul>
<li>Launch the test suite once to check that all the tests pass (it's useless to try to make a failing test fail !)</li>
<li>Launch the test suite again but with parts of the tested code modified</li>
<li>Check that tests fail when tested code have been mutated</li>
<li>Start over as many times as there are possible mutations to apply</li>
</ul>
Of course, we don't have to do this by hand, there are frameworks out there that are going to automate the process.

Before we go deeper, let's see some vocabulary :

<ul>
<li>**Mutant** : Unit modification of the code (e.g: **!==** replaced by **===**)</li>
<li>**Killed/Captured** : A mutant is said killed (or captured) if the unit test fails (positive outcome)</li>
<li>**Escaped** : A mutant escapes if the unit test dosn't fail (negative outcome)</li>
<li>**Uncovered** : A mutant is uncovered if no test cover the mutated code</li>
</ul>
### **Case study : Humbug**
We are going to see <a href="https://github.com/padraic/humbug">Humbug</a>, a framework that allows us to do mutation tests in PHP.

As we execute the Humbug binary, we get the following output :

<pre class="lang:txt decode:true">
{% raw %}
$&gt; humbug
...
Mutation Testing is commencing on 1 files...
(.: killed, M: escaped, S: uncovered, E: fatal error, T: timed out)

M.

2 mutations were generated:
       1 mutants were killed
       0 mutants were not covered by tests
       1 covered mutants were not detected
       0 fatal errors were encountered
       0 time outs were encountered

Metrics:
    Mutation Score Indicator (MSI): 50%
    Mutation Code Coverage: 100%
    Covered Code MSI: 50%
{% endraw %}
</pre>

Damn ! A Mutant escaped ! Let's have a look at the log file :

<pre class="lang:txt decode:true">
{% raw %}
1) \Humbug\Mutator\ConditionalBoundary\LessThan
Diff on \SpaceShip::addAstronaut() in src/SpaceShip.php:
--- Original
+++ New
@@ @@
     {
-        if (count($this-&gt;astronauts) &lt; $this-&gt;capacity) {
+        if (count($this-&gt;astronauts) &lt;= $this-&gt;capacity) {
             $this-&gt;astronauts[] = $astronaut;
         }
     }
 }
{% endraw %}
</pre>

As we can see in the generated diff, tests didn't detect the operator substitution. Actually, we haven't tested the case when our spaceship is full !<br />
Now, let's add a test to cover this use-case :

<pre class="lang:php decode:true">
{% raw %}
&lt;?php

class SpaceShipTest extends \PHPUnit_Framework_TestCase
{
    public function testAddsAstronautWhenShipNotFull()
    {
        $spaceShip = new SpaceShip(1);

        $spaceShip-&gt;addAstronaut(new Astronaut());

        $this-&gt;assertCount(1, $spaceShip-&gt;astronauts);
    }

    public function testDoesNotAddAstronautWhenShipFull()
    {
        $spaceShip = new SpaceShip(0);

        $spaceShip-&gt;addAstronaut(new Astronaut());

        $this-&gt;assertCount(0, $spaceShip-&gt;astronauts);
    }
}
{% endraw %}
</pre>

Launch Humbug again :

<pre class="lang:txt decode:true">
{% raw %}
$&gt; humbug
...
Mutation Testing is commencing on 1 files...
(.: killed, M: escaped, S: uncovered, E: fatal error, T: timed out)

..

2 mutations were generated:
       2 mutants were killed
       0 mutants were not covered by tests
       0 covered mutants were not detected
       0 fatal errors were encountered
       0 time outs were encountered

Metrics:
    Mutation Score Indicator (MSI): 100%
    Mutation Code Coverage: 100%
    Covered Code MSI: 100%
{% endraw %}
</pre>

That's it ! This time no mutant escaped, our test suite is more efficient, and this potential bug will never reach production !<br />
Obviously, the example chosen here is voluntarily very simple and might not be evocative, but in the core businnes logic of your application, you may have a lot more sensitive use-cases.

Humbug is capable of generating a whole set of mutations :

<ul>
<li>Comparison operator substitution (**&gt;** becomes **&gt;=**, **!==** becomes **===**, etc...)</li>
<li>Constant substitution (**0** becomes **1**, **true** becomes **false**, etc...)</li>
<li>Logic operator substitution (**&amp;&amp;**, **||**, etc...)</li>
<li>Binary operator subsctirution (**&amp;**, **|**, **%**, etc...)</li>
<li>Return values substitution</li>
</ul>
I'm not going to detail everything here, if wou want to know more about this, I invite you to check the <a href="https://github.com/padraic/humbug" target="_blank">GitHub project page</a>.

### **Conclusion**
Mutation testing is a simple and efficient way of measuring unit tests fiability. Code coverage is not a very reliable metric, a code can be 100% covered without any assertion !<br />
Humbug allows to automate these tests, so it's possible to plug it in your continuous integration workflow. However, be aware that execution time increases exponentially when codebase grows, we want to use mutation testing where there is a true concern in priority : business code.


