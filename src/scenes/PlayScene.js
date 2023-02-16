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
    this.flapVelocity = 300;
    this.score = 0;
    this.scoreText = '';
    this.bestScore = 0;
    this.bestScoreText = '';
  }

  create() {
    this.createBackGround();
    this.createBird();
    this.createPipes();
    this.createPauseButton();
    this.handleInputs();
    this.createColliders();
    this.createScore();
    this.createBestScore();
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
  this.bird.body.gravity.y = 600;
  this.bird.setCollideWorldBounds(true);
}

createPipes() {
  //creates empty pipe group 
  this.pipes = this.physics.add.group();
  for(let i = 0; i < PIPES_TO_RENDER; i ++) {
    //adds upper and lower pipe into group
    let upperPipe = this.pipes
    .create(0, 0, 'pipe')
    .setImmovable(true)
    .setOrigin(0, 1);

    let lowerPipe = this.pipes
    .create(0, 0, 'pipe')
    .setImmovable(true)
    .setOrigin(0,0);

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
          this.increaseScore();
        }
      }
    });
  }
  
  flap() {
    this.bird.body.velocity.y = -this.flapVelocity;
  }
  
  gameOver() {
    this.physics.pause();
    this.bird.setTint(0xEE4824);

    const bestScoreText = localStorage.getItem('best_score');
    const bestScore = bestScoreText && parseInt(bestScoreText, 10);

    if (this.score > bestScore || !bestScore) { 
      this.setBestScore();
    }
    //restart re-calls your create function
    this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.scene.restart();
      },
      loop: false
    })
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
    if (this.bird.getBounds().bottom >= (this.config.height) || this.bird.y <= 0) {
      this.gameOver();
    }
  }

  createScore() {
    this.score = 0;
    this.scoreText = this.add.text(16,16, `Score: ${0}`, { fontSize: '32px', fill: '#000' });
  }

  createBestScore() {
    const bestScore = localStorage.getItem('best_score');
    this.bestScore = bestScore;
    this.bestScoreText = this.add.text(16, 52, `Best score: ${bestScore || 0}`, { fontSize: '18px', fill: '#000' });
  }

  increaseScore() {
    this.score++;
    this.scoreText.setText(`Score: ${this.score}`);
  }

  setBestScore() {
    localStorage.setItem('best_score', this.score);
    this.bestScore = this.score;
    this.bestScoreText.setText(`Best score: ${this.bestScore}`);
  }

  createPauseButton() {
    const pauseButton = this.add
    .image(this.config.width - 10, this.config.height - 10, 'pause')
    .setOrigin(1,1)
    .setScale(2)
    .setInteractive();

    pauseButton.on('pointerdown', () => {
      this.physics.pause();
      this.scene.pause();

    })
  }
}



export default PlayScene;