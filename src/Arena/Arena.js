class Arena {
  constructor(hero, monsters, size = 10) {
    this.hero = hero;
    this.monsters = monsters;
    this.size = size;
    this.message = "";
    this.tiles = [...grass, ...water, ...bush, ...building]
  }

  /**
   * Calcul the distance between two fighters
   * @param {Object} fighter1
   * @param {Object} fighter2
   * @returns Number
   */
  getDistance(fighter1, fighter2) {
    return Math.sqrt(Math.pow(fighter2.x - fighter1.x, 2) + Math.pow(fighter2.y - fighter1.y, 2)).toFixed(2);
  }

  /**
   * Find the tile corresponding to the coordinates
   * @param {*} x Number
   * @param {*} y Number
   * @returns Object Tile
   */
  getTile(x, y) {
    return this.tiles.find(tile => tile.x === x && tile.y === y)
  }

  /**
   * Calcul from the distance of the fight is posssible
   * @param {Object} attacker
   * @param {Obect} defender
   * @returns Boolean
   */
  isTouchable(attacker, defender) {
    return this.getDistance(attacker, defender) <= attacker.getRange()
  }

  /**
   * Calcul the new coordinates after the move if possible
   * @param {String} direction
   * @returns Object with Number
   */
  move(direction, fighter) {
    let y = fighter.y;
    let x = fighter.x;
    if (direction === "N") fighter.y -= 1;
    if (direction === "S") fighter.y += 1;
    if (direction === "E") fighter.x -= 1;
    if (direction === "W") fighter.x += 1;

    const tile = this.getTile(fighter.x, fighter.y);

    if (!this.checkOnMap(fighter.x, fighter.y)) {
      this.message = "Moving outside the map is not possible";
    } else if (this.CheckNoMonster(fighter)) {
      this.message = "Position already used, you can t move here";
    } else if (tile && !tile.isCrossable(fighter)) {
      this.message = "Moving over is not possible";
    } else {
      return { x, y };
    }

    document.getElementById('error').innerHTML = this.message;
    fighter.x = x;
    fighter.y = y;
  }

  globalMove(direction, hero) {
    this.move(direction, hero);

    this.monsters
      .filter(monster => monster.moveable)
      .forEach(moveable => this.move(moveable.getDirection(moveable), moveable))
  }

  /**
   * Check if the coordinate are on the map
   * @param {Number} x
   * @param {Number} y
   * @returns Boolean
   */
  checkOnMap(x, y) {
    return (x >= 0 && x < this.size) && (y >= 0 && y < this.size)
  }

  /**
   * Check of the presence of e monster on the coordinates
   * @param {Number} x
   * @param {Number} y
   * @returns Boolean
   */
  CheckNoMonster(fighter) {
    return this.monsters.some(monster => monster != fighter && monster.isAlive() && (monster.x === fighter.x && monster.y === fighter.y))
  }

  /**
   * Check if monsters are still alive
   * @returns Boolean
   */
  checkBattle() {
    return this.monsters.some(monster => monster.life > 0);
  }

  /**
   * Launch the battle between our hero and a monsters
   * @param {Number} id
   * @returns Boolean
   */
  battle(index) {
    let msg = 'This monster is not touchable, please move first';
    let death = false;

    if (this.isTouchable(this.hero, this.monsters[index])) {
      this.hero.fight(this.monsters[index]);

      if (this.isTouchable(this.monsters[index], this.hero && this.monsters[index].isAlive())) {
        this.monsters[index].fight(this.hero);
      }

      if (!arena.monsters[index].isAlive()) {
        death = true;
        msg = `${this.hero.name} won 🗡️  ${this.hero.life} 💙 ${this.monsters[index].name} is dead !!!`;
        this.hero.updateExp(this.monsters[index].experience)
      } else if (!arena.hero.isAlive()) {
        death = true;
        msg = `${this.monsters[index].name} won 🗡️, your're dead !!!`
      } else {
        msg = `${this.hero.name} 💙 ${this.hero.life} 🗡️  ${this.monsters[index].name} 💙 ${this.monsters[index].life}`
      }

    }

    if (!this.checkBattle()) {
      msg = `${this.hero.name} won this battle. All monsters are dead. Congratulations`
    }

    document.getElementById("error").innerText = msg;
    return death;
  }

  isDiggeable(tile) {
    let msg = "";
    if (!tile.image.includes("grass")) {
      const tileNameLower = tile.image.slice(9, -4)
      const tileName = tileNameLower.charAt(0).toUpperCase() + tileNameLower.slice(1);

      msg = `You can't dig here!\nThis is a ${tileName} but you can only dig on grass.`
      document.getElementById("error").innerText = msg;
      return false
    } else {
      tile.dig();
      return true
    }
  }


  isHoldingShovel() {
    let msg = "";
    if (!this.hero.accessory) {
      msg = `${this.hero.name} doesn't have a shovel.`
      document.getElementById("error").innerText = msg;
      return false
    } else {
      return true
    }
  }

  getAdjacentTiles(tile) {
    const northTile = {
      n: 'N',
      x: tile.x - 1,
      y: tile.y
    }
    const southTile = {
      n: 'S',
      x: tile.x + 1,
      y: tile.y
    }
    const eastTile = {
      n: 'E',
      x: tile.x,
      y: tile.y + 1
    }
    const westTile = {
      n: 'W',
      x: tile.x,
      y: tile.y - 1
    }


    // If the tiles adjacent to the hero are on the map, fill the array with it, else fill with null
    const arrayTiles = [
      this.checkOnMap(northTile.x, northTile.y) ? northTile : null,
      this.checkOnMap(eastTile.x, eastTile.y) ? eastTile : null,
      this.checkOnMap(southTile.x, southTile.y) ? southTile : null,
      this.checkOnMap(westTile.x, westTile.y) ? westTile : null,
    ];
    return arrayTiles
  }

  fill(heroTile) {
    this.getAdjacentTiles(heroTile).map((adjTile) => {
      if (adjTile) {


        //-------------
        if (grass.includes(heroTile)) {
          // Find index of heroTile
          const heroTileIndex = grass.indexOf(heroTile);

          // Delete heroTile from grass array
          grass.splice(heroTileIndex, 1)

          // Check if splice was delicious (in splice there's "ice" as in "ice cream" :-p )
          console.log('grass.includes(heroTile) :>> ', grass.includes(heroTile));
          // It should be alright, right ?

          // Create newHeroTile as water type where hero is digging
          newHeroTile = new Water(heroTile.x, heroTile.y);
          // Add newHeroTile to water array
          water.push(newHeroTile);

          // Check if dev's work was good
          console.log('water[water.indexOf(heroTile)] :>> ', water[water.indexOf(heroTile)]);

          // Cup of coffee of victory \o/
        }
      }
    })
  }
  /**
   * 
   * testesttesttest
   fill(heroTile) {
   
    this.getAdjacentTiles(heroTile).map((adjTile) => {
    
      if (adjTile) {
      
        if (this.getTile(adjTile.x, adjTile.y).image.includes("water")) {
        
        if (this.tiles.grass.includes(heroTile)){
          console.log('index of heroTile :>> ', this.tiles.grass.indexOf(heroTile));
        }
          
          
        } else {
          return false;
        }
      }
    })
  }

  this.tiles = [...grass, ...water, ...bush, ...building]
   */

  digArena() {
    if (this.isHoldingShovel()) {
      const tile = this.getTile(this.hero.x, this.hero.y);
      this.isDiggeable(tile);

      this.fill(tile)
    }
  }
}
