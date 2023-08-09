class Tile {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.image = "";
    this.crossable = true;
  }

  isCrossable(monster) {
    return this.crossable;
  }
}