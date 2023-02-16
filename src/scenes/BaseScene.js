import Phaser from 'phaser'; 
import PreloadScene from './PreloadScene';

class BaseScene extends Phaser.Scene  {
  constructor(key, config) {
    super(key);
    this.config = config;
    this.fontSize = 32;
    this.screenCenter = [config.width / 2, config.height / 2 ];

  }

  create() {
    this.add.image(0, 0, 'sky-bg').setOrigin(0); 
  }

  createMenu(menu) {
    let lastMenuPositionY = 0
    menu.forEach((menuItem) => {
      const menuPosition = [this.screenCenter[0], this.screenCenter[1] + lastMenuPositionY]
      this.add.text(...menuPosition, menuItem.text, {fontSize: this.fontSize, fill: '#CD00FF'}).setOrigin(0.5,1);
      lastMenuPositionY += 42;
    })
  }

}

export default BaseScene;