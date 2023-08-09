class Bush extends Tile {
  constructor(x, y) {
    super(x, y)
    this.image = "./images/bush.png";
    this.crossable = false;
  }

  isCrossable(monster) {
    return (monster instanceof Hind) ? true : this.crossable;
  }
}