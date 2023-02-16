import BaseScene from './BaseScene';

class ScoreScene extends BaseScene {
  constructor(config) {
    super('ScoreScene', {...config, canGoBack: true});
  }

  create() {
    console.log('score scene create');
    super.create();
    const bestScore = localStorage.getItem('best_score')
    this.add.text(...this.screenCenter, `Best score: ${bestScore || 0}`, {fontSize: 32, fill: '#fff'}).setOrigin(0.5,1);
  }
}

export default ScoreScene;