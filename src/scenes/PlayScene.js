import Phaser from 'phaser';

const PIPES_TO_RENDER = 4;

class PlayScene extends Phaser.Scene {
  constructor(config) {
    super('PlayScene');
    this.config = config;
    this.bird = null;
    this.pipes = null;
    this.pipeHorizontalDistance = 0;
    this.pipeVerticalDistanceRange = [150, 250];
    this.pipeHorizontalDistanceRange = [300, 500];
    this.flapVelocity = 200;
  }

//loading assets such as images, music, animations etc
  preload() {
  //this context = scene. Contains functions and properties that can be used

  //loads images from assets
    this.load.image('sky-bg', 'assets/sky.png');
    this.load.image('bird', 'assets/bird.png');
    this.load.image('pipe', 'assets/pipe.png');
  }

  create() {
    this.createBackGround();
    this.createBird();
    this.createPipes();
    this.handleInputs();
    this.createColliders();
  }

//app should render about 60fps - 60 executed of update every second
//delta time from the last frame - in ms - about 16ms 
//60 * 16 = 1000ms or 1s
update(time, delta) {
  this.checkGameStatus();
  this.recyclePipes();
}

createBackGround(){
      //x and y coords are the center of the image
    //image() takes 3 arguments, x coord, y coord and key of image set in preload
  this.add.image(0, 0, 'sky-bg').setOrigin(0);
}

createBird() {
  //adds a sprite to the physics engine, in our case arcade
  this.bird = this.physics.add.sprite(this.config.startingPosition.x, this.config.startingPosition.y, 'bird').setOrigin(0);
  this.bird.body.gravity.y = 400;
}

createPipes() {
  //creates empty pipe group 
  this.pipes = this.physics.add.group();
  for(let i = 0; i < PIPES_TO_RENDER; i ++) {
    //adds upper and lower pipe into group
    let upperPipe = this.pipes.create(0, 0, 'pipe').setOrigin(0, 1);
    let lowerPipe = this.pipes.create(0, 0, 'pipe').setOrigin(0,0);

    this.placePipe(upperPipe, lowerPipe)
  }
    //sets velocity of all pipes in group
  this.pipes.setVelocityX(-200);
}

createColliders() {
  this.physics.add.collider(this.bird  , this.pipes, this.gameOver, null, this);
}

handleInputs() {
  this.input.on('pointerdown', this.flap, this);
  this.input.keyboard.createCursorKeys()
  this.input.keyboard.on('keydown-SPACE', this.flap, this);
}

  placePipe(uPipe, lPipe) {
    const rightMostXPosition = this.getRightMostPipe();
    const pipeVerticalDistance = Phaser.Math.Between(this.pipeVerticalDistanceRange[0], this.pipeVerticalDistanceRange[1]); 
    const pipeVerticalPosition = Phaser.Math.Between(0 + 20, this.config.height - 20 - pipeVerticalDistance);
    const pipeHorizontalDistance = Phaser.Math.Between(...this.pipeHorizontalDistanceRange);
  
    uPipe.x = rightMostXPosition + pipeHorizontalDistance;
    uPipe.y = pipeVerticalPosition;
    lPipe.x = uPipe.x;
    lPipe.y = uPipe.y + pipeVerticalDistance;
  }


  recyclePipes() {
    const tempPipes = []
    this.pipes.getChildren().forEach((pipe) => {
      //checks each pipe position. Right bound is right side of sprite 
      if (pipe.getBounds().right <= 0) {
        //recycle pipe
        tempPipes.push(pipe);
        if(tempPipes.length === 2) {
          this.placePipe(...tempPipes);
        }
      }
    });
  }
  
  flap() {
    this.bird.body.velocity.y = -this.flapVelocity;
  }
  
  gameOver() {
    //rests x and y positions of bird and sets velocity to 0 so it does not increase each time you restart
    this.bird.x = this.config.startingPosition.x;
    this.bird.y = this.config.startingPosition.y;
    this.bird.body.velocity.y = 0;
  }

  getRightMostPipe() {
    let rightMostX = 0;
    //gets all from group as array
    this.pipes.getChildren().forEach((pipe) => {
      rightMostX = Math.max(pipe.x, rightMostX);
    });
    return rightMostX;
  }

  checkGameStatus() {
    if (this.bird.y > (this.config.height) || this.bird.y < 0) {
      this.gameOver();
    }
  }
}



export default PlayScene;