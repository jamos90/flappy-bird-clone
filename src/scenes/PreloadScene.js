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
    this.load.image('bird', 'assets/bird.png');
    this.load.image('pipe', 'assets/pipe.png');
    this.load.image('pause', 'assets/pause.png');
  }

  create() {
    this.scene.start('MenuScene');
  }
}

export default PreloadScene;