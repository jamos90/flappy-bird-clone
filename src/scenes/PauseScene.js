import BaseScene from './BaseScene';

class PauseScene extends BaseScene {
  constructor(config) {
    super('PauseScene', config);

    this.menu = [
      {scene: 'PlayScene', text: 'Continue'},
      {scene: 'MenuScene', text: 'Exit'}
    ]
  }

  create() {
    super.create();
    this.createMenu(this.menu, (menuItem) => this.setUpMenuEvents(menuItem));
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
    if (menuItem.scene && menuItem.text.toLowerCase() === 'continue') {
      this.scene.stop();
      this.scene.resume(menuItem.scene);
    }

    if (menuItem.scene && menuItem.text.toLowerCase() === 'exit') {
      this.scene.stop('PlayScene');
      this.scene.start('MenuScene');
    }
  }

}

export default PauseScene;