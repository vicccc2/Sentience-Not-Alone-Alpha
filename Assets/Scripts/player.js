// variables needed for player
//constants
const MAX_VELOCITY_X = 120;
const MAX_VELOCITY_Y = 100;
const MAX_PARTS = 1000;
let MAX_HEALTH = 10
let health = 10
let computerParts = 0;

// variables

// Player class
class Player {
  // public variables
  sprite; // main sprite
  followbox; // the box camera box follows
  cameraBox; // the box the camera follows
  aimBox; // where the bullet comes from

  // private variables
  #jumpSpeed = 260; // acceleration for jumping
  #speed = 500; // acceleration for running
  #canJump = false; // if the player can jump
  #jumpBoost = 170; // the velocity you get when jumping
  #bonusTime = false;
  #timedEvent1; // jump time
  #tolerance = 6;
  #aimingDown = false;
  #aimingUp = false;
  #hurt = false;
  #damageSound;
  #jumpSound;

  // public functions 
  constructor(x, y, image, jumpSound, damageSound, walkSound) {
    // sounds
    this.#jumpSound = currentScene.sound.add(jumpSound);
    this.#damageSound = currentScene.sound.add(damageSound);

    // follow box
    this.followbox = currentScene.add.zone(0, 0, 8, 8);
    currentScene.physics.add.existing(this.followbox, false);
    this.followbox.body.moves = false;

    // camera box
    this.cameraBox = currentScene.add.zone(0, 0, 8, 8);
    currentScene.physics.add.existing(this.cameraBox, false);
    this.cameraBox.body.moves = true;
    this.cameraBox.body.setAllowGravity(false);

    //aim box
    this.aimBox = currentScene.add.zone(0, 0, 8, 8);
    currentScene.physics.add.existing(this.aimBox, false);
    this.aimBox.body.moves = false;

    // sprite
    this.sprite = currentScene.physics.add.sprite(x, y, image);

    this.cameraBox.x = this.sprite.x + 80;
    this.cameraBox.y = this.sprite.y;
    this.sprite.custom_id = 'player';
    this.jumping = false;
    this.sprite.body.setBounce(0.1, 0.1)
      .setCollideWorldBounds(true)
      .setDrag(300, 20)
      .setMaxVelocityX(MAX_VELOCITY_X)
      //.setMaxVelocityY(MAX_VELOCITY_Y)
      .setCircle(7)
      .setOffset(3, 9);
    this.sprite.body.onWorldBounds = true;
  }

  updatePlayer() {

    // if conversation is taking place no moving
    if (conversationManager.isActive) {
      this.sprite.body.setVelocity(0);
      this.sprite.body.setAcceleration(0);
      this.cameraBox.body.setVelocity(0);
      this.#canJump = false;
      return;
    }

    if (cursors.left.isDown) { // move left
      this.sprite.setAccelerationX(-this.#speed);
      this.sprite.flipX = true;
    }
    else if (cursors.right.isDown) { // move right
      this.sprite.body.setAccelerationX(this.#speed);
      this.sprite.flipX = false;
    }
    else {
      this.sprite.body.setAccelerationX(0);
    }

    // aim up 
    if (cursors.up.isDown) {
      this.#aimingUp = true;
      this.#aimingDown = false;
      Phaser.Display.Align.In.Center(this.aimBox, this.sprite, 0, -10);
    }
    else {
      this.#aimingUp = false;
    }

    // aim down
    if (this.sprite.body.blocked.down === false && cursors.down.isDown) {
      Phaser.Display.Align.In.Center(this.aimBox, this.sprite, 0, 10);
      this.#aimingDown = true;
      this.#aimingUp = false;
    }
    else {
      this.#aimingDown = false;
    }

    // jump
    if (zKey.isDown) {
      if ((this.#bonusTime === true || this.sprite.body.blocked.down) && this.#canJump === true) {
        this.#jumpSound.play({
          volume: soundEffectsVolume,
          loop: false
        });
        this.sprite.body.setAccelerationY(-this.#jumpSpeed);
        this.sprite.body.setVelocityY(-this.#jumpBoost);
        this.#canJump = false;
        this.#timedEvent1 = currentScene.time.delayedCall(800, this.#jumpEvent, [], this);
      }
    }
    else {
      if (this.#canJump === true && this.sprite.body.blocked.down === false) {
        this.#bonusTime = true;
        currentScene.time.delayedCall(200, this.#jumpExtra, [], this);
      }
      this.sprite.body.setAccelerationY(0);

      if (this.#timedEvent1 != null) {
        this.#timedEvent1.remove();
      }

      if (this.sprite.body.blocked.down) {
        this.#canJump = true;
      }
    }

    // camera box
    if (this.sprite.flipX === true) {
      Phaser.Display.Align.In.Center(this.followbox, this.sprite, -87);
      if (this.#aimingDown === false && this.#aimingUp === false) {
        Phaser.Display.Align.In.Center(this.aimBox, this.sprite, -10);
      }
    }
    else {
      Phaser.Display.Align.In.Center(this.followbox, this.sprite, 87);
      if (this.#aimingDown === false && this.#aimingUp === false) {
        Phaser.Display.Align.In.Center(this.aimBox, this.sprite, 10);
      }
    }

    //this.followbox.y = this.sprite.y;

    this.cameraBox.y = this.sprite.y;

    if (Phaser.Math.Distance.BetweenPoints(this.followbox, this.cameraBox) < this.#tolerance) {
      if (this.cameraBox.body.speed > 0) {
        this.cameraBox.body.reset(this.cameraBox.x, this.cameraBox.y);
      }
      //this.cameraBox.x = this.followbox.x;

      if (this.sprite.flipX === true) {
        Phaser.Display.Align.In.Center(this.cameraBox, this.sprite, -87);
      }
      else {
        Phaser.Display.Align.In.Center(this.cameraBox, this.sprite, 87);
      }
    }
    else {
      currentScene.physics.moveToObject(this.cameraBox, this.followbox, 170);
    }
  }

  // when player gets hit
  damagePlayer(damage) {
    if (this.#hurt === false) {
      health -= damage;
      this.#damageSound.play({
        volume: soundEffectsVolume,
        loop: false
      });
      this.#hurt = true;
      this.sprite.setTint('0xff0000');
      healthText.setText('health: ' + health + '/' + MAX_HEALTH);
      currentScene.time.delayedCall(1000, this.#damaged, [], this);
    }

    if (health <= 0) {
      music.stop();
      currentScene.scene.start('gameOver');

      //canTransition = false;
      //previousMusic = music;

      //currentScene.tweens.add({
      //  targets: previousMusic,
      //  volume: 0,
      //   duration: 2000,
      //  onComplete: previousMusic.stop()
      //});

      //currentScene.scene.transition({
      //  target: 'gameOver',
      // duration: 3000,
      //  moveBelow: true,
      //  allowInput: false,
      //  onComplete: canTransition = true
      //});
    }
  };

  // private functions
  #jumpEvent() { // when a jump ends
    this.sprite.body.setAccelerationY(0);
  }

  #jumpExtra() { // when the time for a jump that wasn't done ends 
    this.#bonusTime = false;
    this.#canJump = false;
  }

  #damaged() {
    this.#hurt = false;
    this.sprite.setTint('0xffffff');
  }

}