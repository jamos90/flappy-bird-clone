import Phaser from 'phaser'; 

class BaseScene extends Phaser.Scene  {
  constructor(key, config) {
    super(key);
    this.config = config;

  }

  create() {
    console.log('super create??');
    this.add.image(0, 0, 'sky-bg').setOrigin(0); 
  }

}

export default BaseScene;