# Labors of Heracles #6: the stables of Augeas
 
Prerequisite: clone this *repository*.

The next mission of Heracles is to clean the stables of Augeas (Augean stables).

> Compared to the previous workshop, you will see that the classes in *src/* have been reorganized and that several subfolders have been created. The goal is simply to better organize the classes which were beginning to be numerous. This change resulted in a modification of *index.html* to import the affected classes. In addition, the data has been put in a separate folder, to be output from the JS logic.

> Until now, the entire initialization phase of a game was done directly in *indexjs* (which was becoming rather long). There was the creation and positioning of tiles, fighters, equipment, *etc.* However, each arena corresponds to one of the works, with its own map, its own monsters *etc.* The initialization logic is therefore deported directly into the `construct()` of `Arena`. In addition, the 2 open/close modal functions have been moved to the *util.js* file. The *index.js* file is now much clearer and behaviors unique to one level can be more easily defined there.

You see the new map. There is water, grass and a new type of tile, `Building` which has also been added (and is *crossable*).

In the stables of Augeas, our hero's feet are disappearing in a nauseating layer of manure! The smell is unbearable. All this must be cleaned up, and before the end of the day. Only one alternative, divert the bed of the river to pass the waves directly into the building. Decluttering guaranteed. To start, you will have to dig!

# Shovel work

And to be able to dig, you need a shovel.
Start by creating a `Shovel` class in the Fighters/Inventory folder. The shovel *could* inherit from `Weapon`, but even if a good blow of the shovel can hurt, we will assume that Heracles will rather use it as an accessory, which he will hold in his second hand. If you open the inventory on the GUI, you see a "Second Hand" slot under the weapon. This is where the shovel should appear. For that, it needs an image and a name like for the weapon, like for the shield, like for... Finally, you see where we are coming from. Unlike a weapon designed to attack and a shield to defend, we will add a `role` property to our accessory.

Once the `Shovel.js` class is created, consider instantiating it in *index.js* under the `shield` with the name "shovel" and image "./images/shovel.svg" and a role of "diggeable ". Then add it to our hero...

To check your work, remember to open our hero's modal.

# Little holes, little holes.

Our hero will now be able to dig. Created a `digArena()` method in `Arena` (the simple fact of having created the method, a "Dig" button appeared on the interface!)

This method will:
1. Check that the hero is carrying a second-hand shovel, otherwise display an error message via `#error` and return `false`.
2. Check that the hero is on a `Grass` type tile which will be the only ones he can dig. Otherwise display an error message via `#error` and return `false`.

Since the `Grass` type tiles are diggable, they will have 2 possible states (digged or not). Start by adding a `digged` property, of type boolean with the value `false` by default.
Then create a `dig()` method in `Grass`, which will have the role of passing the `digged` property to `true`.
We thus have the information of whether the tile is dug or not, but visually, on the map, there is no impact. To make it more visible, also make the `dig()` method change the image to `hole.png`.
In the `digArena()` method, call the `dig()` method of the selected tile and return `true`.

Check on your screen, when you click on the button, the grass changes into a hole.

# Fill good

The idea now is to be able to divert the course of the river. So, if you dig right next to water, you have to make your hole "fill" instantly. Your tile will therefore change from `Grass` "not dug" to `Grass` "dig" and then change to `Water`.

In `digArena()`, just after the call to the `dig()` method, you will call a `fill(tile)` method which will contain the logic of this filling.

In `fill()` you will have to
1. Recover the four boxes adjacent to the hollowed out box (not the diagonals).
To do this, create a `getAdjacentTiles(tile)` method which will return an array (yes we create lots of little methods, each with a little bit of logic, it's cleaner that way)
2. Check if any of these tiles are of the `Water` type.
3. If so, you will swap the dug `Grass` tile for a new `Water` type tile.

# Recursion

But now, everything is not working well yet, because if you dig a hole at a distance of 2 squares from the water, then you dig the square between the two, the nearest hole fills up but not the first one. The water only stops at the adjacent hole. What is this magic? Heracles decides to urgently consult his uncle Poseidon. The latter quickly gives him the solution, use recursion!

What is the problem ? Let's go back to your code
1. Heracles digs in the grass
2. A hole forms
3. If there is water next to this hole, it turns into water.
But at no time do we try to see if this new water tile is itself near a hole that it should then fill. Then if this new water tile is itself near a hole that it should then fill. Then if this new water tile is itself near a hole that it should then fill. Then .... STOP!

As you can see, you will have to use the `fill()` method an indefinite number of times. And each time you use `fill()`, you have to try again to *fill* the possible holes until there are no more. The `fill()` method will therefore have to **call itself**, as long as the exit condition (absence of unfilled adjacent hole) will not be validated. This is **recursion**.

Take the code from `fill()`. The method :
1. Collect the tiles adjacent to the hole
2. Loops on these.
3. If one of them is of Grass type and with the `ìsDigged` property at `true`, then we relaunch the `fill()` method with this tile;

Cool, the recursion is set up... It's magic.
All the holes fill well, Heracles thanks Poseidon for his help and goes to finish digging.

# Victory

To complete his job, our hero must bring the river bed to the stable gates. Created a `checkVictory()` method in `Arena`. This method will display a victory message if the victory conditions are met.

To keep it simple, we are going to assume that for this level, there must be water on a `Building` type tile. In the `checkVictory()` method:
- 1/ Collect the `Building` type tiles
- 2/ For each of them, test if an adjacent tile (Use the `getAdjecenteTile` method) is of the `Water` type
- 3/ If yes, displays the victory message

A message is displayed on the screen to signify the victory, congratulations!