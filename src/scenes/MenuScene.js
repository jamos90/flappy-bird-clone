import Phaser from 'phaser'; 

class MenuScene extends Phaser.Scene  {
  constructor(config) {
    super('MenuScene');
    this.config = config;

  }

  create() {
    this.add.image(0, 0, 'sky-bg').setOrigin(0);
  }

  update() {

  }
}

export default MenuScene;