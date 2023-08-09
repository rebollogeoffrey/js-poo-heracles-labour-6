class Monster extends Fighter {
	constructor(name, x, y) {
		super(name, x, y);
		this.experience = 500;
	}

	getDirection(monster) {
		console.log(monster);
		const direction = {
			1: 'N',
			2: 'S',
			3: 'E',
			4: 'W',
		};

		return direction[Math.floor(Math.random() * 4) + 1];
	}
}
