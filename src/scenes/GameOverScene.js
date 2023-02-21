import BaseScene from './BaseScene';

class GameOverScene extends BaseScene {
  constructor(config) {
    super('GameOverScene', config);

    this.menu = [
      {scene: 'PlayScene', text: 'Retry'},
      {scene: 'MenuScene', text: 'Exit'}
    ]
  }

  create() {
    super.create();
    this.createMenu(this.menu, (menuItem) => this.setUpMenuEvents(menuItem));
    this.add.text(this.config.width * 0.3 ,this.config.height * 0.05,  'Gave Over', {fontSize: 32, fill: '#ffff'});
  }

  setUpMenuEvents(menuItem) {
    const textGameObject = menuItem.textGameObject;
    textGameObject.setInteractive();

    textGameObject.on('pointerover', () => {
      textGameObject.setStyle({fill: '#ff0'})
    });

    textGameObject.on('pointerout', () => {
      textGameObject.setStyle({fill: '#fff'})
    });

    textGameObject.on('pointerup', () => {
      this.handleMenuItemClick(menuItem)
    });
  }

  handleMenuItemClick(menuItem) {
    if (menuItem.scene && menuItem.text.toLowerCase() === 'retry') {
      this.scene.stop();
      this.scene.start(menuItem.scene);
    }

    if (menuItem.scene && menuItem.text.toLowerCase() === 'exit') {
      this.scene.stop('PlayScene');
      this.scene.start('MenuScene');
    }
  }

}

export default GameOverScene;