import BaseScene from './BaseScene';

class MenuScene extends BaseScene {
  constructor(config) {
    super('MenuScene', config);

    this.menu = [
      {scene: 'PlayScene', text: 'Play'},
      {scene: 'ScoreScene', text: 'Score'},
      {scene: null, text: 'Exit'}
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
  }

}

export default MenuScene;