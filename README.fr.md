# Travaux d'Héraclès #6 : les écuries d'Augias
 


La prochaine mission d'Héraclès est de nettoyer les écuries d'Augias (Augean stables).

> Par rapport à l'atelier précédent, tu verras que les classes dans *src/* ont été réorganisées et que plusieurs sous dossiers ont été crées. Le but est simplement de mieux organiser les classes qui commençaient à être nombreuses. Cette modification a entraîné une modification de *index.html*  pour importer les classes concernées. De plus, les datas ont été mises dans un dossier séparé, pour être sortie de la logique JS.

> Jusqu'à maintenant, toute la phase d'initialisation d'une partie se faisait directement dans *indexjs* (qui devenait plutôt long). On y trouvait la création et le positionnement des tuiles, des combattants, des équipements, *etc.* Or, chaque arène correspond à un des travaux, avec sa propre carte, ses propres monstres *etc.* La logique d'initialisation est donc déportée directement dans le `construct()` de `Arena`. De plus, les 2 fonctions d'ouverture/fermeture des modals ont été déplacé dans le fichier *util.js*. Le fichier *index.js* est maintenant bien plus clair et les comportements propres uniquement à un niveau vont pouvoir y être plus facilement définis.

Tu vois la nouvelle carte. Il s'y trouve de l'eau, de l'herbe et un nouveau type de tuile, `Building` qui a également été ajouté (et qui est  *crossable*).

Dans les écuries d'Augias, les pieds de notre héros disparaissent dans une couche nauséabonde de fumier ! L'odeur est insoutenable. Il faut nettoyer tout cela, et avant la fin de la journée. Une seule alternative, détourner le lit du fleuve pour faire passer les flots directement dans le bâtiment. Décrassage assuré. Pour commencer, il va donc falloir creuser !

# Du travail à la pelle

Et pour pouvoir creuser, il faut une pelle.
Commence par créer une classe `Shovel` dans le dossier Fighters/Inventory. La pelle *pourrait* hériter de `Weapon`, mais même si un bon coup de pelle peut faire mal, nous allons partir du principe qu'Héraclès va plutôt s'en servir en accessoire, qu'il tiendra dans sa seconde main. Si tu ouvres l'inventaire sur l'interface graphique, tu vois une slot "Second Hand" sous l'arme. C'est ici que la pelle devra aparaître. Pour cela, il lui faut une image et un name comme pour l'arme, comme pour le bouclier, comme pour... Enfin, tu vois où l'on veut en venir. A la différence d'une arme prévue pour attaquer et un bouclier pour se défendre, on ajoutera une propriété `role` a notre accessoire.

Une fois la classe `Shovel.js` crée, pense à l'instancier dans *index.js* sous le `shield` avec comme nom "pelle" et image "./images/shovel.svg" et une role à "diggeable". Ajoute la ensuite à notre héro...

Pour vérifier ton travail, pense à ouvrir le modal de notre héro.

# Des ptits trous, des ptits trous.

Notre héros va maintenant pouvoir creuser. Créé une méthode `digArena()` dans `Arena` (le simple fait d'avoir créer la méthode, un bouton "Dig" est apparu sur l'interface !)

Cette méthode va :
1. Vérifier que le héros porte bien une pelle en seconde main, Sinon afficher un message d'erreur via l'`#error` et return `false`.
2. Vérifier que le héros se trouve sur une tuile de type `Grass` qui vont être les seules qu'il pourra creuser. Sinon afficher un message d'erreur via l'`#error` et return `false`.

Les tuiles de type `Grass` étant creusables, elles vont avoir 2 états possibles (creusées ou non). Commence par y ajouter une propriété `digged`, de type booléen avec la valeur `false` par défaut.
Créé ensuite une méthode `dig()` dans `Grass`, qui va avoir pour rôle de passer la propriété `digged` à `true`.
On a ainsi l'information de savoir si la tuile est creusée ou non, mais visuellement, sur la carte, il n'y a pas d'impact. Pour que cela soit plus visible, fais également en sorte que la méthode `dig()` modifie l'image en `hole.png`.
Dans la méthode `digArena()`, appelle la méthode `dig()` de la tuile sélectionnée et return `true`.

Vérifie sur ton écran, lorsque tu cliques sur le bouton, l'herbe se change en un trou.

# Fill good

L'idée maintenant, c'est de pouvoir dévier le cours de la rivière. Ainsi, si tu creuses juste à côté de l'eau, il faut faire en sorte que ton trou se "remplisse" instantanément. Ta tuile va donc passer de `Grass` "non creusée" à `Grass` "creusée" puis se changer en `Water`.

Dans `digArena()`, juste après l'appel à la méthode `dig()`, tu vas appeler une méthode `fill(tile)` qui va contenir la logique de ce remplissage.

Dans `fill()` tu vas devoir
1. Récupérer les quatre cases adjascentes à la case creusée (pas les diagonales).
Pour cela, créée une méthode `getAdjacentTiles(tile)` qui renverra un tableau (oui nous crééons plein de petites méthodes, avec chacune un petit bout de la logique, c'est plus propre ainsi)
2. Vérifier si l'une de ces tuiles est de type `Water`.
3. Si c'est le cas, tu vas échanger la tuile `Grass` creusée par une nouvelle tuile de type `Water`. Pour réaliser cela, tu vas créer une méthode `addTile(tile)` et `removeTile(tile)` contenant cette logique. Ce mécanisme étant assez générique (pas spécifiquement propre à `Arena`), tu crééra ces méthodes directement dans `Arena`. Une fois que cela fonctionne, créer une méthode `replaceTile(tile)` qui en s'appuyant sur les deux méthodes précédentes, ajoutera la nouvelle tuile en supprimant la précédente à la même place.

Super, si tu creuses loin de l'eau, tu fais un trou, si tu creuses le long de l'eau, tu commences à déplacer le lit de la rivière.

# Recursivité

Mais voilà, tout ne fonctionne pas encore bien, car si tu creuses un trou à une distance de 2 cases de l'eau, puis que tu creuses la case entre les deux, le trou le plus proche se remplis mais pas le premier. L'eau s'arrête seulement au trou adjacent. Qu'elle est cette magie ? Héraclès décide de consulter en urgence son oncle Poséidon. Ce dernier lui donne rapidement la solution, utiliser la récursivité ! 

Quelle est le problème ? Reprenons le déroulé de ton code
1. Héraclès creuse dans l'herbe
2. Un trou se forme
3. S'il y a de l'eau à coté de ce trou, il se transforme en eau.
Mais à aucun moment on ne cherche à voir si cette nouvelle tuile d'eau se trouve elle même à proximité d'un trou qu'elle devrait alors remplir. Puis si cette nouvelle tuile d'eau se trouve elle même à proximité d'un trou qu'elle devrait alors remplir. Puis si cette nouvelle tuile d'eau se trouve elle même à proximité d'un trou qu'elle devrait alors remplir. Puis .... STOP ! 

Comme tu le vois, il va falloir utiliser la méthode `fill()` un nombre indéfini de fois. Et à chaque utilisation de `fill()`, il faut retenter de *fill* les éventuels trous jusqu'à ce qu'il n'y en ait plus. La méthode `fill()` va donc devoir **s'appeller elle même**, tant que la condition de sortie (absence de trou adjacent non remplis) ne sera pas validée. C'est celà la **récursivité**.

Reprend donc le code de `fill()`. La méthode :
1. Récupères les tuiles adjascentes au trou
2. Boucles sur celles-ci. 
3. Si l'une d'entre elle est de type Grass et avec la propriété `ìsDigged` à `true`, alors on relance la méthode `fill()` avec cette tuile;

Cool,  la récursivité est mise en place... C'est Magique. 
Tous les trous se remplissent bien, Héraclès remercie Poséidon pour son aide et file finir de creuser. 

# La victoire

Pour mener à bien son travail, notre héros doit amener le lit de la rivière jusqu'aux portes des écuries. Créé une méthode `checkVictory()` dans `Arena`. Cette méthode affichera un message de victoire si les conditions de la victoire sont remplis.

Pour faire au plus simple, nous allons partir du principe que, pour ce niveau, il faut qu'il y ait de l'eau sur une tuile de type `Building`. Dans la méthode `checkVictory()` : 
- 1/ Récupére les tuiles de type `Building`
- 2/ Pour chacune d'entre elles, teste si une tuile adajacente (Utilise la méthode `getAdjecenteTile`) est de type `Water`
- 3/ Si oui, affiche le message de victoirete

Un message est affiché à l'écran pour signifier la victoire, félicitations ! 