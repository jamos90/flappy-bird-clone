import Phaser from 'phaser';
//config passed to phase game object
const config = {
  //type will be WebGl - web graphics lib, part of the browser - js api for rendering graphics
  type: Phaser.AUTO,
  //width of game widow
  width: 800, 
  //height of game window
  height: 600,
  physics: {
    //arcade physics plugin, manages physics simulations
    default: 'arcade'
  },
  scene: {
    //order of execution follows order in object
    preload,
    create,
    //called every frame
    update
  }
}

let bird = null;

//loading assets such as images, music, animations etc
function preload() {
  //this context = scene. Contains functions and properties that can be used

  //loads sky image from assets
  this.load.image('sky-bg', 'assets/sky.png');

  //loads square image from assests
  this.load.image('bird', 'assets/bird.png');
}

//inits instances of objects for application
function create() {
  //x and y coords are the center of the image
  //image() takes 3 arguments, x coord, y coord and key of image set in preload
  this.add.image(0, 0, 'sky-bg').setOrigin(0);
  //adds a sprite to the physics engine, in our case arcade
  bird = this.physics.add.sprite(config.width / 10, config.height / 2, 'bird').setOrigin(0);
  //gravity y 200 means your sprite will fall 200 pxs a second 
  // bird.body.gravity.y = 0;
  bird.body.gravity.y = 200;
}

//app should render about 60fps - 60 executed of update every second
//delta time from the last frame - in ms - about 16ms 
//60 * 16 = 1000ms or 1s
function update(time, delta) {

}

new Phaser.Game(config);