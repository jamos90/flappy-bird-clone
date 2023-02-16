import BaseScene from './BaseScene';

class MenuScene extends BaseScene {
  constructor(config) {
    super('MenuScene', config);
    this.config = config;

  }

  create() {
    super.create();
    this.scene.start('PlayScene');
  }

}

export default MenuScene;