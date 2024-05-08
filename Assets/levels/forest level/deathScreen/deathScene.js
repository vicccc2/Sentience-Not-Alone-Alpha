// game over screen

class gameOver extends Phaser.Scene {
  constructor() {
    super({
      key: 'gameOver'
    });
  }

  preload = function() {
    this.load.image('over', 'Assets/levels/forest level/deathScreen/deathScreen.png');
    this.load.audio('music', 'Assets/Audio/music/Juhani Junkala [Chiptune Adventures] 4. Stage Select.wav');

  }

  create = function() {

    music = this.sound.add('music');
    music.play({
      volume: 0,
      loop: true
    });

    this.tweens.add({
      targets: music,
      volume: musicVolume,
      duration: 2000
    });


    //click for fullscreen
    this.input.on('pointerdown', () => {
      this.game.scale.startFullscreen();
    });

    // zKey to interact and continue/start game
    zKey = this.input.keyboard.addKey('z');

    // logo
    this.logo = this.add.image(256, 144, 'over');

    // zKey
    this.continueText = this.add.text(200, 200, 'Press [z] to Retry', {
      fontSize: '16px',
      fontFamily: 'c64esque',
      color: '#FFF',
      lineSpacing: 6
    });
  }

  update = function() {
    if (zKey.isDown) {
      health = MAX_HEALTH
      music.stop();
      this.scene.start('fall');

      //canTransition = false;
      //previousMusic = music;

      //this.continueText.setVisible(false);

      //this.tweens.add({
      //  targets: previousMusic,
      //  volume: 0,
      //  duration: 2000,
      //  onComplete: previousMusic.stop()
      //});

      //this.scene.transition({
      //  target: 'fall',
      //  duration: 3000,
      //  moveBelow: true,
      //  allowInput: false,
      //  onUpdate: function(progress) {
      //    this.logo.alpha = 1 - progress;
      // },
      //  onComplete: canTransition = true
      //});
    }
  }
}