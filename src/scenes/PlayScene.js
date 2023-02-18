import BaseScene from './BaseScene';
import { IgnoreCaseMode } from 'css-what';

const PIPES_TO_RENDER = 4;
let LIVES_COUNT = 3;

class PlayScene extends BaseScene {
  constructor(config) {
    super('PlayScene', config);
    this.bird = null;
    this.pipes = null;
    this.lives = null;
    this.pipeHorizontalDistance = 0;
    this.flapVelocity = 300;
    this.score = 0;
    this.scoreText = '';
    this.bestScore = 0;
    this.bestScoreText = '';
    this.isPaused = false;
    this.currentDifficulty = 'easy';
    this.difficulties = {
      'easy': {
        pipeHorizontalDistanceRange: [300, 350],
        pipeVerticalDistanceRange: [150, 200]
      },
      'normal': {
        pipeHorizontalDistanceRange: [280, 330],
        pipeVerticalDistanceRange: [140, 190]
      },
      'hard': {
        pipeHorizontalDistanceRange: [250, 310],
        pipeVerticalDistanceRange: [120, 170]
      }
    }
  }

  create() {
    this.currentDifficulty = 'easy';
    super.create();
    this.createBird();
    this.createPipes();
    this.createPauseButton();
    this.createColliders();
    this.createScore();
    this.createBestScore();
    this.handleInputs();
    this.listenToEvents();
    this.createLives();

    this.anims.create({
      key: 'fly',
      frames: this.anims.generateFrameNumbers('bird', {start: 8, end: 15 }),
      //frame rate 24fps default 
      frameRate: 8,
      //repeat infite times
      repeat: -1
    });

    this.bird.play('fly');
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
  this.bird = this.physics.add.sprite(this.config.startingPosition.x, this.config.startingPosition.y, 'bird')
  .setScale(3)
  .setFlipX(true)
  .setOrigin(0);
  this.bird.body.gravity.y = 600;
  this.bird.setCollideWorldBounds(true);
  this.bird.setBodySize(this.bird.width, this.bird.height - 8);
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

createLives() {
  if(LIVES_COUNT ===0) LIVES_COUNT = 3;
  let xOffSet = 10;
  this.lives = this.physics.add.group();
  for (let i = 0; i < LIVES_COUNT; i ++) {
    this.lives.create(xOffSet, 80, 'life_icon').setOrigin(0,0);
    xOffSet += 20;
  }
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
    const difficulties = this.difficulties[this.currentDifficulty]
    const rightMostXPosition = this.getRightMostPipe();
    const pipeVerticalDistance = Phaser.Math.Between(...difficulties.pipeVerticalDistanceRange); 
    const pipeVerticalPosition = Phaser.Math.Between(0 + 20, this.config.height - 20 - pipeVerticalDistance);
    const pipeHorizontalDistance = Phaser.Math.Between(...difficulties.pipeHorizontalDistanceRange);
  
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
          this.increaseDifficulty();
        }
      }
    });
  }

  increaseDifficulty() {
    if (this.score === 20) {
      this.currentDifficulty = 'normal'
    }

    if (this.score === 50) {
      this.currentDifficulty = 'hard'
    }
  }
   
  flap() {
    if (!this.isPaused) {
      this.bird.body.velocity.y = -this.flapVelocity;
    }
  }
  
  gameOver() {
    const lives = this.lives.getChildren();
    this.physics.pause();
    this.bird.setTint(0xEE4824);

    const bestScoreText = localStorage.getItem('best_score');
    const bestScore = bestScoreText && parseInt(bestScoreText, 10);

    if (this.score > bestScore || !bestScore) { 
      this.setBestScore();
    }

    this.handleRemoveLife();
  
    // console.log(this.lives.getChildren());
    // this.lives.remove(this.lives.getChildren()[2], true, true);
    // console.log(this.lives.killAndHide(this.lives.getChildren()));
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
    this.isPaused = false;
    const pauseButton = this.add
    .image(this.config.width - 10, this.config.height - 10, 'pause')
    .setOrigin(1,1)
    .setScale(2)
    .setInteractive();

    pauseButton.on('pointerdown', () => {
      this.isPaused = true;
      this.physics.pause();
      this.scene.pause();
      this.scene.launch('PauseScene');
    })
  }

  listenToEvents() {
    if (this.pauseEvent) { return; }
    this.pauseEvent = this.events.on('resume', () => {
      this.initialTime = 3; 
      this.countDownText = this.add.text(...this.screenCenter, 'Fly in ' + this.initialTime, {fontSize: 32, fill: '#ffff'}).setOrigin(0.5);
      this.timedEvent = this.time.addEvent({
        delay: 1000,
        callback: this.countDown,
        callbackScope: this,
        loop: true,
      });
    })
  }

  countDown() {
    this.initialTime--;
    this.countDownText.setText('Fly in: ' + this.initialTime);
    if (this.initialTime <= 0) {
      this.isPaused = false;
      this.countDownText.setText('');
      this.physics.resume();
      this.timedEvent.remove();
    }
  }

  handleRemoveLife() {
    const lifeCount = this.lives.getChildren();
    const lifeToRemove = lifeCount.length - 1;
    if (lifeCount.length === 1) {
      this.scene.stop('PlayScene');
      this.scene.start('GameOverScene');
    } else {
      this.lives.remove(lifeCount[lifeToRemove], true, true);
    }
    LIVES_COUNT --;
  }
}



export default PlayScene;