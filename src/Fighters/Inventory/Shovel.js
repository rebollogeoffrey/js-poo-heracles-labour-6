class Shovel extends Weapon {
    constructor(name, damage, image) {
        super(name, damage, image)
        this.image = image
        this.role = "diggeable"
    }
}

/*
class Hero extends Fighter {
  constructor(name, x, y) {
    super(name, x, y)
    this.weapon = null;
    this.shield = null;
    this.strength = 20;
    this.dexterity = 6;
    this.image = './images/heracles.svg';
    this.moveable = true;
  }*/