/** creating the hero Heracles */
const heracles = new Hero('👨 Heracles', 0, 0);

/** associating  staff to our hero*/
heracles.weapon = new Weapon('bow', 8, './images/bow.svg', 5);
heracles.shield = new Shield('shield', 10, './images/shield.svg');
heracles.accessory = new Shovel('shovel', 10, './images/shovel.svg');

/** Creating the arena place  */
const arena = new Arena(heracles, [])
const ArenaHTML = new ArenaTemplate('arena');
ArenaHTML.setMoveEvent(arena);
ArenaHTML.setMonsterClick(arena);
ArenaHTML.createArena(arena);
