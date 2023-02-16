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

    if (this.config.canGoBack) {
      const backButton = this.add.image(this.config.width - 10, this.config.height - 10, 'back')
      .setOrigin(1)
      .setScale(2)
      .setInteractive();

      backButton.on('pointerup', () => {
        this.scene.start('MenuScene');
      });
    }
  }

  createMenu(menu, setUpMenuEvents) {
    let lastMenuPositionY = 0
    menu.forEach((menuItem) => {
      const menuPosition = [this.screenCenter[0], this.screenCenter[1] + lastMenuPositionY]
      menuItem.textGameObject = this.add.text(...menuPosition, menuItem.text, {fontSize: this.fontSize, fill: '#FFFF'}).setOrigin(0.5,1);
      lastMenuPositionY += 42;
      setUpMenuEvents(menuItem);
    })
  }

}

export default BaseScene;