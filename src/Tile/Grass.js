class Grass extends Tile {
  constructor(x, y) {
    super(x, y)
    this.image = "./images/grass.png";
    this.digged = false;
  }

  dig() {
    this.digged = true;
    this.image = "./images/hole.png";

  }
}