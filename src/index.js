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
    default: 'arcade',
    arcade: {
      debug: true,
    }
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

let upperPipe = null;
let lowerPipe = null;
let pipeVerticalDistanceRange = [150, 250];
//returns a number between the two
let pipeVerticalDistance = Phaser.Math.Between(pipeVerticalDistanceRange[0], pipeVerticalDistanceRange[1]); 


const flapVelocity = 200;
const initialBirdPosition = {
  x: config.width * 0.1,
  y: config.height / 2
}

const initialPipePosition = {
  x: config.width * 0.5,
  y: config.height/ 2
}

//loading assets such as images, music, animations etc
function preload() {
  //this context = scene. Contains functions and properties that can be used

  //loads images from assets
  this.load.image('sky-bg', 'assets/sky.png');
  this.load.image('bird', 'assets/bird.png');
  this.load.image('pipe', 'assets/pipe.png');
}

//inits instances of objects for application
function create() {
  //x and y coords are the center of the image
  //image() takes 3 arguments, x coord, y coord and key of image set in preload
  this.add.image(0, 0, 'sky-bg').setOrigin(0);
  //adds a sprite to the physics engine, in our case arcade
  bird = this.physics.add.sprite(initialBirdPosition.x, initialBirdPosition.y, 'bird').setOrigin(0);
  bird.body.gravity.y = 400;
  bird.body.velocity.x = 100;
  upperPipe = this.physics.add.sprite(400, 100, 'pipe').setOrigin(0, 1);
  lowerPipe = this.physics.add.sprite(400, upperPipe.y + pipeVerticalDistance, 'pipe').setOrigin(0,0);

  this.input.on('pointerdown', flap);

  this.input.keyboard.createCursorKeys()

  this.input.keyboard.on('keydown-SPACE', flap);
  // bird.body.velocity.x = 100;
}

//app should render about 60fps - 60 executed of update every second
//delta time from the last frame - in ms - about 16ms 
//60 * 16 = 1000ms or 1s
function update(time, delta) {

  console.log(bird.y);
  if (bird.y > (config.height) || bird.y < 0) {
    restartBirdPosition();
  }
}

function flap() {
  bird.body.velocity.y = -flapVelocity;
}

function restartBirdPosition() {
  //rests x and y positions of bird and sets velocity to 0 so it does not increase each time you restart
  bird.x = initialBirdPosition.x;
  bird.y = initialBirdPosition.y;
  bird.body.velocity.y = 0;

}

new Phaser.Game(config);