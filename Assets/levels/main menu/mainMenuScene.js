// main menu of game
class mainMenuScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'mainMenuScene'
    })
  }

  logo;

  preload = function() {
    this.load.image('logo', 'Assets/UI/Logo/logo.png');
    this.load.audio('music', 'Assets/Audio/music/Juhani Junkala [Chiptune Adventures] 4. Stage Select.wav');
  }

  create = function() {
    //click for fullscreen
    this.input.on('pointerdown', () => {
      this.game.scale.startFullscreen();
    });

    music = this.sound.add('music');
    music.play({
      volume: 0,
      loop: true
    });

    this.tweens.add({
      targets: music,
      volume: musicVolume,
      duration: 5000
    });

    // zKey to interact and continue/start game
    zKey = this.input.keyboard.addKey('z');

    cursors = this.input.keyboard.createCursorKeys();

    // logo
    this.logo = this.add.image(256, 96, 'logo');

    // zKey
    this.startText = this.add.text(180, 144, '        [z] to Start', {
      fontSize: '16px',
      fontFamily: 'c64esque',
      color: '#FFF',
      lineSpacing: 6,
      align: 'center'
    }).setVisible(true).setColor('#0000FF');

    this.creditsText = this.add.text(180, 154, '      [z] for credits', {
      fontSize: '16px',
      fontFamily: 'c64esque',
      color: '#FFF',
      lineSpacing: 6,
      align: 'center'
    }).setVisible(true);

    this.masterVolume = this.add.text(180, 164, ' [<] Master Volume: ' + (10 * masterVolume) + ' [>]', {
      fontSize: '16px',
      fontFamily: 'c64esque',
      color: '#FFF',
      lineSpacing: 6,
      align: 'center'
    }).setVisible(true);

    this.currentText = 0;
    this.creditsActive = false;

    this.textArray = [this.startText, this.creditsText, this.masterVolume, this.musicVolume, this.soundEffectsVolume]

    // credits
    this.credits = this.add.text(90, 144, 'Credits:\nEngine: Phaser\nProgrammer: Victor Ruiz\nArtist: Victor Ruiz\nDesginer: Victor Ruiz\nMusic:\nSoundEffects: 8-Bit Retro Game SFX Pack by David Dumais Audio', {
      fontSize: '16px',
      fontFamily: 'c64esque',
      color: '#FFF',
      lineSpacing: 6,
      align: 'left'
    }).setVisible(false);

    this.menuDelay = false;
  }

  update = function() {
    if (this.creditsActive === true) {
      if (zKey.isDown) {
        this.credits.setVisible(false);
        this.startText.setVisible(true);
        this.creditsText.setVisible(true);
        this.masterVolume.setVisible(true);
        this.time.delayedCall(100, this.deactivateCredits, [], this);
      }
    }
    else {
      if (this.menuDelay === false) {
        if (cursors.down.isDown && this.currentText < 2) {
          this.textArray[this.currentText].setColor('#FFF');
          this.currentText += 1;
          this.textArray[this.currentText].setColor('#0000FF');
          this.menuDelay = true;
          this.time.delayedCall(100, this.delayMenu, [], this);
        }
        else if (cursors.up.isDown && this.currentText > 0) {
          this.textArray[this.currentText].setColor('#FFF');
          this.currentText -= 1;
          this.textArray[this.currentText].setColor('#0000FF');
          this.menuDelay = true;
          this.time.delayedCall(100, this.delayMenu, [], this);
        }
        else {
          if (zKey.isDown && this.textArray[this.currentText] === this.startText) {
            music.stop();
            this.scene.start('fall');
          }
          else if (zKey.isDown && (this.textArray[this.currentText] === this.creditsText && this.creditsActive === false)) {
            this.credits.setVisible(true);
            this.startText.setVisible(false);
            this.creditsText.setVisible(false);
            this.masterVolume.setVisible(false);
            this.time.delayedCall(800, this.activateCredits, [], this);
          }
        }

      }
    }

    if (this.textArray[this.currentText] === this.masterVolume) {
      if (cursors.left.isDown && masterVolume > 0.2) {
        masterVolume -= 0.1;
        this.updateVolume();
        this.tweens.add({
          targets: music,
          volume: musicVolume,
          duration: 1000
        });

        this.masterVolume.setText(' [<] Master Volume: ' + (10 * Phaser.Math.RoundTo(masterVolume, -2)) + ' [>]');
      }
      else if (cursors.right.isDown && masterVolume < 1) {
        masterVolume += 0.1;
        this.updateVolume();
        this.tweens.add({
          targets: music,
          volume: musicVolume,
          duration: 1000
        });

        this.masterVolume.setText(' [<] Master Volume: ' + (10 * Phaser.Math.RoundTo(masterVolume, -2)) + ' [>]');
      }
    }
  }

  delayMenu() {
    this.menuDelay = false
  }

  activateCredits() {
    this.creditsActive = true
  }

  deactivateCredits() {
    this.creditsActive = false;
  }

  updateVolume() {
    musicVolume = defaultMusicVolume * masterVolume;
    soundEffectsVolume = defaultSoundEffectsVolume * masterVolume;
  }
}
