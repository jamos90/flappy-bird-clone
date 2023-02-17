import Phaser from 'phaser';
import PlayScene from './scenes/PlayScene';
import MenuScene from './scenes/MenuScene';
import PreloadScene from './scenes/PreloadScene';
import ScoreScene from './scenes/ScoreScene';
import PauseScene from './scenes/PauseScene';

//config passed to phase game object
const WIDTH = 400;
const HEIGHT = 600
const BIRD_POSITION  = {x: WIDTH * 0.1, y: HEIGHT/2}

const SHARED_CONFIG = {
  width: WIDTH,
  height: HEIGHT,
  startingPosition: BIRD_POSITION
}

const scenes = [
  PreloadScene,
  MenuScene, 
  ScoreScene,
  PlayScene,
  PauseScene
]

const createScene = scene => new scene(SHARED_CONFIG);

const initScenes = () => scenes.map((scene) =>  createScene(scene));
  

const config = {
  //type will be WebGl - web graphics lib, part of the browser - js api for rendering graphics
  type: Phaser.AUTO,
  ...SHARED_CONFIG,
  physics: {
    //arcade physics plugin, manages physics simulations
    default: 'arcade',
    arcade: {
      debug: true,
    }
  },
  scene: initScenes()
}

new Phaser.Game(config);