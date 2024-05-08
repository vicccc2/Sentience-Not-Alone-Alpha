// weapon class
class Weapon {
  bullets; // bullet group
  damage; // how much damge the bullet does

  #speed; // speed of bullets
  #audio; // the sound of the laser
  #shootingSpeed; // how fast you are allowed to shoot
  #playerBoost; // how much the bullet gives the player velocity when in the air shooting down
  #canShoot = true; // if teh player can shoot
  #life; // how long the bullets live for

  constructor(bullets, damage, speed, shootingSpeed, life, playerBoost, audio) {
    this.bullets = bullets;
    this.#speed = speed;
    this.#shootingSpeed = shootingSpeed;
    this.#life = life;
    this.#playerBoost = playerBoost;
    this.#audio = currentScene.sound.add(audio);
    this.damge = damage;
  }

  listen() { // listens to player trying to shoot
    if (xKey.isDown && this.#canShoot) {
      this.#shoot();
      this.#canShoot = false;
      currentScene.time.delayedCall(this.#shootingSpeed, this.#shootingOver, [], this);
    }
  };

  #shoot() { // activates bullet
    let bullet = this.bullets.get(player.aimBox.x, player.aimBox.y);
    if (bullet) {
      this.#audio.play({
        volume: soundEffectsVolume,
        loop: false
      });
      bullet.setActive(true);
      bullet.setVisible(true);
      bullet.body.setAllowGravity(false);
      bullet.setCollideWorldBounds(true);
      bullet.body.onWorldBounds = true;
      bullet.custom_id = 'bullet';
      if (cursors.down.isDown && player.sprite.body.blocked.down === false) {
        bullet.setRotation(3.141);
        bullet.setVelocityY(this.#speed);
        bullet.setSize(4, 14);
        player.sprite.body.setVelocityY(-this.#playerBoost);
      }
      else if (cursors.up.isDown) {
        bullet.setRotation(0);
        bullet.setVelocityY(-this.#speed);
        bullet.setSize(4, 14);
      }
      else if (player.sprite.flipX === true) {
        bullet.setRotation(-1.57);
        bullet.setVelocityX(-this.#speed);
        bullet.setSize(14, 4);
      }
      else {
        bullet.setRotation(1.57);
        bullet.setVelocityX(this.#speed);
        bullet.setSize(14, 4);
      }
      currentScene.time.delayedCall(this.#life, this.shootOver, [bullet], this);
    }
  }

  shootOver(bullet) { // when a bullet's life is over
    bullet.body.setCollideWorldBounds(false);
    bullet.body.onWorldBounds = false;
    bullet.setVelocity(0, 0);
    bullet.setPosition(1000, 1000);
    bullet.setActive(false);
    bullet.setVisible(false);
  }

  #shootingOver() { // when the player can fire their weapon again
    this.#canShoot = true;
  }



}