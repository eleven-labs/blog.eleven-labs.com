---
layout: post
title: Ma première Application sous IOS
author: ibenichou
date: '2017-02-08 10:42:47 +0100'
date_gmt: '2017-02-08 09:42:47 +0100'
categories:
- Mobile
tags: []
---
{% raw %}
<p><span style="font-weight: 400;">Je voulais partager avec vous un retour d’expérience sur ma première application IOS. Personnellement, j’apprécie ce genre d’article car je peux facilement m’identifier à celui-ci.</span></p>
### **Intro**
<p><span style="font-weight: 400;">En ce moment, je travaille ma montée en compétence sur Swift 3/Xcode et donc comme on le sait tous, quand on apprend un nouveau langage c’est bien beau de savoir faire une boucle et des méthodes, mais il n’y a rien de mieux qu’un vrai projet pour valider ses acquis et monter en xp.</span></p>
<p><span style="font-weight: 400;">Le premier “problème", c’est de trouver une idée sur laquelle travailler. En effet, je ne suis pas très fan des to do lists que je trouve sans grand intérêt. Mais c’est là justement que ça se complique : trouver une idée est la chose la plus difficile  :( (coder est tellement plus simple à côté :) ). Bon, je vous rassure après quelques jours j’ai trouvé un sujet assez intéressant. Sur mon fil d’actualité Facebook je n’arrête pas de voir un petit “jeu” de quizz concernant des calculs mentaux (je ne sais pas si vous avez déjà vu ce genre de publication mais c’est très </span><span style="font-weight: 400;">addictif</span><span style="font-weight: 400;">). J’ai trouvé l’idée mais...</span></p>
### **Graphisme**
<p><span style="font-weight: 400;">Mais je ne vais pas faire une app sans un minimum de graphisme, non ? À ce moment là, je me dis, "autant faire une belle app pour la montrer à mon entourage…" Car il faut être honnête, la majorité des gens à qui je vais montrer cette application se contre-fiche de mon code #vieMaVieDeDev :), et par conséquent ils vont juger mon travail plus sur le côté interactif et graphique que sur mon code. </span></p>
<p><span style="font-weight: 400;">Suite à cela, je me suis encore posé une question : avec quel outil vais-je faire mon design ? Sur un photoshop, ou bien existe t-il une autre solution plus adaptée et plus simple ? C’est là que j’ai entendu parler de Sketch app. Et voilà pourquoi j’ai choisi d’utiliser cet outil pour réaliser mes maquettes :</span></p>
<ol>
<li style="font-weight: 400;"><span style="font-weight: 400;">Il est utilisé par une grosse majorité des graphistes / UX qui travaillent sur du mobile ;</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">C’est une bonne occasion de me former dessus et je me dis que si je viens à travailler sur une mission qui utilise cet outil je ne serai pas largué ;</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Sketch met à votre disposition énormément d’outils afin de faciliter la conception de maquette mobile. En effet, il propose des templates tels que Android/IOS Icon App, IOS UI Design (Sketch inclut tous les éléments graphiques sur IOS), Material Design…</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Le prix : Sketch App est à 99$/an alors que photoshop… :)</span></li>
</ol>
<p><span style="font-weight: 400;">Après avoir visionné quelques tutos vidéos pour apprendre les bases, j’ai pu réaliser les maquettes de mon application. Cependant, j’ai relevé plusieurs points très intéressants sur la partie graphique :</span></p>
<ol>
<li style="font-weight: 400;"><span style="font-weight: 400;">Je comprends encore plus l’utilisation d’un(e) UX sur un projet. J’ai du reprendre à plusieurs reprises mes maquettes car je n’avais pas pensé à des détails qui semblent minimes mais qui avaient pour autant un impact important sur l’expérience utilisateur ;</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Il faut prendre en compte toutes les contraintes d’intégration sur mobile mais comme je ne les connais pas encore exactement en détail, je n’ai pas réalisé que certaines choses n'étaient pas possibles voir très compliquées à mettre en place ;</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Il est crucial de prendre en considération toutes les tailles de devices. Vous allez me dire "oui c’est logique, je ne comprends pas pourquoi tu n’y as pas pensé". Eh bien sur ce cas précis, j'ai commis l'erreur d'intégrer pleins de petites images et sur des devices avec un petit écran, cela rend surchargé.</span></li>
</ol>
<p><span style="font-weight: 400;">Aperçu de mes maquettes:</span></p>
<p>[caption id="attachment_3269" align="alignleft" width="168"]<a href="http://blog.eleven-labs.com/wp-content/uploads/2017/01/Capture-d’écran-2017-01-22-à-13.39.50.png"><img class="wp-image-3269 size-medium" src="http://blog.eleven-labs.com/wp-content/uploads/2017/01/Capture-d’écran-2017-01-22-à-13.39.50-168x300.png" alt="Ecran de lancement." width="168" height="300" /></a> Ecran de lancement.[/caption]</p>
<p>[caption id="attachment_3274" align="alignleft" width="169"]<a href="http://blog.eleven-labs.com/wp-content/uploads/2017/01/Capture-d’écran-2017-01-22-à-13.54.23.png"><img class="wp-image-3274 size-medium" src="http://blog.eleven-labs.com/wp-content/uploads/2017/01/Capture-d’écran-2017-01-22-à-13.54.23-169x300.png" alt="Ecran home" width="169" height="300" /></a> Ecran home[/caption]</p>
<p>[caption id="attachment_3270" align="alignleft" width="169"]<a href="http://blog.eleven-labs.com/wp-content/uploads/2017/01/Capture-d’écran-2017-01-22-à-13.52.43.png"><img class="wp-image-3270 size-medium" src="http://blog.eleven-labs.com/wp-content/uploads/2017/01/Capture-d’écran-2017-01-22-à-13.52.43-169x300.png" alt="Ecran &quot;mode normal&quot;" width="169" height="300" /></a> Ecran "mode normal"[/caption]</p>
<p>[caption id="attachment_3272" align="alignleft" width="170"]<a href="http://blog.eleven-labs.com/wp-content/uploads/2017/01/Capture-d’écran-2017-01-22-à-13.53.11.png"><img class="wp-image-3272 size-medium" src="http://blog.eleven-labs.com/wp-content/uploads/2017/01/Capture-d’écran-2017-01-22-à-13.53.11-170x300.png" alt="Ecran &quot;mode normal&quot;" width="170" height="300" /></a> Ecran "mode normal"[/caption]</p>
<p>[caption id="attachment_3271" align="alignleft" width="169"]<a href="http://blog.eleven-labs.com/wp-content/uploads/2017/01/Capture-d’écran-2017-01-22-à-13.52.54.png"><img class="wp-image-3271 size-medium" src="http://blog.eleven-labs.com/wp-content/uploads/2017/01/Capture-d’écran-2017-01-22-à-13.52.54-169x300.png" alt="Ecran &quot;mode chrono&quot;" width="169" height="300" /></a> Ecran "mode chrono"[/caption]</p>
<p>[caption id="attachment_3273" align="aligncenter" width="169"]<a href="http://blog.eleven-labs.com/wp-content/uploads/2017/01/Capture-d’écran-2017-01-22-à-13.53.29.png"><img class="wp-image-3273 size-medium" src="http://blog.eleven-labs.com/wp-content/uploads/2017/01/Capture-d’écran-2017-01-22-à-13.53.29-169x300.png" alt="Ecran &quot;Perdu&quot;" width="169" height="300" /></a> Ecran "Perdu"[/caption]</p>
<p><em><span style="font-weight: 400;">PS: Je remercie Julie qui m'a aidée sur la partie Graphique/UX :)</span></em></p>
### **Backend**
<p><span style="font-weight: 400;">Je ne vais pas trop m’attarder sur cette partie car ce n’est pas vraiment le but de cet article. Pour la faire courte, j’ai juste mis en place un symfony 3.* avec un controller qui retourne une réponse en json. Cette réponse est un tableau de questions qui contient pour chacune des questions sa réponse et les liens d'images.</span></p>
### **Xcode**
<p><span style="font-weight: 400;">Bon on rentre enfin dans le vif du sujet ! </span></p>
<p><span style="font-weight: 400;">Avant d’attaquer mon application, je me suis posé un peu (oui ça m’arrive :) ) et j’ai porté ma réflexion sur ce dont j’avais besoin, ce que j’allais utiliser, comment j’allais découper mon code… </span></p>
<p>**Cocoapods:**</p>
<p><span style="font-weight: 400;">Qu’est-ce que cocoapods ? C’est un gestionnaire de dépendance comme npm, composer, yarn…</span></p>
<p><span style="font-weight: 400;">J’ai besoin de cocoapods car je souhaite inclure deux librairies à mon projet, à savoir :</span></p>
<ol>
<li style="font-weight: 400;"><span style="font-weight: 400;"><a href="https://github.com/Alamofire/Alamofire">Alamofire</a>, </span><span style="font-weight: 400;">qui est une des librairies la plus connue et utilisée sur Swift. Elle permet de faire des requêtes HTTP. Quand j’ai vu la différence entre la procédure dite “classique” utilisant les méthodes natives, et Alamofire, mon choix a été vite fait !</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;"><a href="https://github.com/Alamofire/AlamofireImage">AlamofireImage</a>, c</span><span style="font-weight: 400;">ette librairie permet de gérer les images qui proviennent du net. Lorsque vous récupérez des images via une url, il faut gérer cette dernière en passant par de l’asynchrone. Je me suis amusé une fois à écrire du code afin de gérer ce cas et j’ai comparé le résultat de mon code avec l’utilisation d’AlamoFireImage. Je ne vous cache pas qu’Alamofire m’a mis une fessée ! :)</span></li>
</ol>
<p><span style="font-weight: 400;">Pour ajouter les deux librairies, il vous suffit de créer un fichier Podfile à la racine de votre projet et d’ajouter ces petites lignes :</span></p>
<pre class="lang:sh decode:true"># Podfile
# Uncomment the next line to define a global platform for your project
# platform :ios, '9.0'
platform :ios, '10.0'
target 'GeniusApp' do
  # Comment the next line if you're not using Swift and don't want to use dynamic frameworks
  use_frameworks!

  # Pods for GeniusApp
  pod 'Alamofire', '~&gt; 4.0'
  pod 'AlamofireImage', '~&gt; 3.1'
end</pre>
<p><span style="font-weight: 400;">Puis de faire un :</span></p>
<pre class="lang:sh decode:true ">$ pod install</pre>
<p>**Model :**</p>
<p><span style="font-weight: 400;">Au lieu d'avoir tout mon code métier dans mes controllers (pas bien ça !!), j’ai décidé de mettre un peu de logique dans des model afin d’isoler mon code pour notamment le tester plus facilement... </span></p>
<p><em>Exemple :</em></p>
<pre class="lang:swift decode:true">// Model/Party.swift
import Foundation

class Party {
    let BASE_SCORE = 0
    let BASE_LIFE = 3
    var score:Int = 0
    var life:Int = 3

    func addScore() {
        self.score += 1
    }

    func getScore() -&gt; String {
        return "x \(self.score)"
    }

    func getLife() -&gt; String {
        return "\(self.life)"
    }

    func killLife() {
        if isGameOver() {
            return;
        }

        self.life -= 1
    }

    func isGameOver() -&gt; Bool {
        return self.life &lt; 1
    }

    func resetData() {
        self.life = BASE_LIFE
        self.score = BASE_SCORE
    }
}
</pre>
<p><strong>ViewController </strong>**:**</p>
<p><span style="font-weight: 400;">Au lieu de vous montrer en détail mes ViewControllers, je vais vous parler de quelques parties que je trouve intéressantes.</span></p>
<p><span style="font-weight: 400;">Pour commencer, j’ai rencontré plusieurs “soucis” avec le clavier :</span></p>
<ol>
<li style="font-weight: 400;"><span style="font-weight: 400;">Quand je clique sur mon label “??” celui-ci doit se transformer en input ;</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Lorsque j’affiche mon clavier, il faut que je remonte l’écran afin de faciliter l’écriture de la réponse de l’utilisateur.</span></li>
</ol>
<p><span style="font-weight: 400;">Ensuite, pour compliquer encore un peu plus les choses, j’ai décidé d'utiliser un clavier de type “number pad” pour améliorer l’expérience utilisateur. Toutefois, le soucis avec ce type de clavier est qu’il n’y a pas de bouton dit “return”.</span></p>
<p><span style="font-weight: 400;">A noter : Si vous souhaitez que lorsque votre utilisateur clique sur le label "??" cela déclenche un événement de type touch il suffit de changer son attribut </span>**isUserInteractionEnabled = true**<span style="font-weight: 400;"> afin de délivrer les événements de type touch et keyboard à la vue.</span></p>
<p><span style="font-weight: 400;">Je souhaite que lorsque mon utilisateur clique sur ma cellule cela déclenche l’activation de mon clavier.</span></p>
<pre class="lang:swift decode:true">// Controller/ViewController.swift
let click = UITapGestureRecognizer(target: self, action: #selector(self.showKeyboard))

cell.addGestureRecognizer(click)</pre>
<p>Dans la méthode showKeyboard(), je fais appel à une autre méthode addDoneButtonOnKeyboard() qui permet d’ajouter un bouton "Envoyer" sur le clavier.</p>
<pre class="lang:swift decode:true">// Controller/ViewController.swift
// let doneToolbar: UIToolbar = UIToolbar()
func addDoneButtonOnKeyboard() {
    doneToolbar.barStyle = UIBarStyle.default

    let flexSpace = UIBarButtonItem(barButtonSystemItem: UIBarButtonSystemItem.flexibleSpace, target: nil, action: nil)
    let done: UIBarButtonItem = UIBarButtonItem(title: "Envoyer", style: UIBarButtonItemStyle.done, target: self, action: #selector(self.doneButtonAction))

    var items = [UIBarButtonItem]()
    items.append(flexSpace)
    items.append(done)

    doneToolbar.items = items
    doneToolbar.sizeToFit()
 }</pre>
<p><span style="font-weight: 400;">J’ai d'abord initialisé une constante de type UIToolbar pour pouvoir y accéder à un autre moment dans le code. </span><span style="font-weight: 400;">Une fois la Toolbar initialisée, je souhaite lui ajouter le bouton "Envoyer" (UIBarButtonItem). </span></p>
<p><span style="font-weight: 400;">Cependant, il faudrait que celui-ci se situe tout à droite de la Toolbar car par défaut il se place tout à gauche. Pour y remédier, j’ai donc créé un bouton flexSpace qui ne fait rien mais qui va cependant permettre d’avoir le bouton à droite. Je n’ai plus qu'à ajouter lesdits boutons à ma Toolbar. </span></p>
<p><span style="font-weight: 400;">Attention : il ne faut pas oublier aussi d'ajouter la Toolbar au clavier via : </span></p>
<pre class="lang:swift decode:true">// Controller/ViewController.swift
{UITextField}.inputAccessoryView = doneToolbar
</pre>
<p><span style="font-weight: 400;">La propriété inputAccessoryView est utilisée pour attacher une vue accessoire (ici, notre UIToolbar) au clavier qui est présentée par UITextField.</span></p>
<p>Pour résoudre le deuxième "problème", je vous avoue que j'ai opté pour la solution la plus simple mais qui marche parfaitement bien. J'ai donc créé deux méthodes qui me permettent de faire un "scroll" sur ma vue.</p>
<pre class="lang:swift decode:true">// Controller/ViewController.swift
if self.view.frame.origin.y &lt; 0.0 {
    if UIScreen.main.bounds.size.height &lt; 600 {
        self.view.frame.origin.y += 285

        return
    }

    self.view.frame.origin.y += 180
}
// And

if self.view.frame.origin.y &gt;= 0.0 {
    if UIScreen.main.bounds.size.height &lt; 600 {
        self.view.frame.origin.y -= 285

        return
    }

    self.view.frame.origin.y -= 180
}</pre>
<p>J'ai dû rajouter un petit "hack" car sur l'Iphone 5 il me faut un plus grand scroll. C'est une des parties de mon code qui je pense demande une refacto (si vous avez des suggestions je suis bien évidemment preneur).</p>
<p><strong>Extension:</strong></p>
<p>Une des choses qui me plait le plus en Swift, ce sont les extensions ! J'ai donc pensé à en faire une pour la partie téléchargement d'une image depuis une url.</p>
<pre class="lang:swift decode:true ">// Extensions/UIImageViewExtension.swift
import UIKit
import Alamofire
import AlamofireImage

extension UIImageView {
    func getUIImageViewByUrl(url: String) {
        Alamofire.request(url).responseImage { response in
            if let image = response.result.value {
                self.image = image
            }
        }
    }
}</pre>
<p>Je n'ai plus qu'à appeler celle-ci dans mon ViewController:</p>
<pre class="lang:swift decode:true ">// Controller/ViewController.swift
cell.image.getUIImageViewByUrl(url: url)</pre>
### **Conclusion**
<p>J'ai pris énormément de plaisir à coder cette application (c'est le plus important je pense).</p>
<p>Avant de me lancer, j'avais pas mal d'a priori et je me disais "cette partie va être dure... ; comment je vais gérer ça..." Et finalement, pour chaque problème rencontré, j'ai su trouver des solutions. Alors oui, mon application n'est pas hyper optimisée et elle demande surement une refacto générale mais j'ai tellement appris de choses qu'on ne voit pas dans un tuto :).</p>
<p>Ce que je retiens de ma toute première application sous IOS, c'est que j'apprécie vraiment de faire du mobile, que je prends du plaisir à coder sous Swift et qu'il ne faut pas avoir peur de se lancer. Alors j'espère qu'en lisant cet article, ça va tenter certaines personnes à se lancer sur cette voie.</p>
<p>&nbsp;</p>
<p><em>P.S. : Merci aux Pandas pour les relectures</em></p>
{% endraw %}
