import Phaser from 'phaser';

class PreloadScene extends Phaser.Scene  {
  constructor(config) {
    super('PreloadScene');
    this.config = config;

  }

  //loads assets required for whole game
  preload() {
    console.log('pre load');
    this.load.image('sky-bg', 'assets/sky.png');
    this.load.spritesheet('bird', 'assets/birdsprite.png', {
      frameWidth: 16,
      frameHeight: 16
    })
    this.load.image('pipe', 'assets/pipe.png');
    this.load.image('pause', 'assets/pause.png');
    this.load.image('back', 'assets/back.png');
    this.load.image('life_icon', 'assets/star.png');
  }

  create() {
    this.scene.start('MenuScene');
  }
}

export default PreloadScene;