// audio constants
const defaultSoundEffectsVolume = 0.1;
const defaultMusicVolume = 0.1;
const defaultMasterVolume = 1;

// audio variables
let textAudio; //audio used when text is displayed
let music; // music of the game
let previousMusic //music from previous level
let musicVolume = defaultMusicVolume * defaultMasterVolume;
let masterVolume = defaultMasterVolume;
let soundEffectsVolume = defaultSoundEffectsVolume * defaultMasterVolume;

// UI
let conversationManager;
let healthText;
let computerPartsText;
let fpsText;
let xText;
let yText;
let canTransition = true;
let checkpointScene;
let checkpointX;
let checkpointY;

// also used by player class
let cursors;
let zKey; // key to talk/interact with the menus
let xKey;
let dKey;

let enemies;
let parts;

let currentScene; // holds the current scene
let camera;

let player; // the player
let weapon1; // weapon 1

// Base scene add cursor controls and text UI
class UIScene extends Phaser.Scene {

  loadUI() {
    currentScene = this;

    this.load.image('PC_portrait', 'Assets/Sprites/Characters/player/pc_portrait.png');
    this.load.image('textBox', 'Assets/UI/Textboxes/textBox.png');
    this.load.audio('talk', 'Assets/Audio/8Bit Retro Game SFX Pack - 96kHz 24Bit/01Contemporary/Menu/8BitRetroSFXPack1_Contemporary_Menu03.wav');
  }

  createUI() {

    //click for fullscreen
    this.input.on('pointerdown', () => {
      this.game.scale.startFullscreen();
    });

    // Health text
    healthText = this.add.text(6, 3, 'Health: ' + health + '/' + MAX_HEALTH, {
      fontSize: '16px',
      fontFamily: 'c64esque',
      color: '#FFF'
    }).setScrollFactor(0).setColor('#FF0000');

    // computer parts text
    computerPartsText = this.add.text(6, 13, 'Parts: ' + computerParts, {
      fontSize: '16px',
      fontFamily: 'c64esque',
      color: '#FFF'
    }).setScrollFactor(0);

    fpsText = this.add.text(6, 23, 'FPS: ', {
      fontSize: '16px',
      fontFamily: 'c64esque',
      color: '#FFF'
    }).setScrollFactor(0).setColor('#00FF00');

    xText = this.add.text(6, 33, 'X: ', {
      fontSize: '16px',
      fontFamily: 'c64esque',
      color: '#FFF'
    }).setScrollFactor(0).setColor('#02ccfe');

    yText = this.add.text(6, 43, 'Y: ', {
      fontSize: '16px',
      fontFamily: 'c64esque',
      color: '#FFF'
    }).setScrollFactor(0).setColor('#FFFF00');

    // text interface of game
    textAudio = this.sound.add('talk');
    zKey = this.input.keyboard.addKey('z');
    xKey = this.input.keyboard.addKey('x');
    dKey = this.input.keyboard.addKey('d');

    cursors = this.input.keyboard.createCursorKeys();

    conversationManager = new DialogueScript(new DialogueManager(this.add.image(98, 150, 'PC'), this.add.image(256, 240, 'textBox'), this.add.text(100, 205, '', {
      fontSize: '32px',
      fontFamily: 'c64esque',
      color: '#FFF',
      lineSpacing: 6,
    }), this.add.text(57, 205, '', {
      fontSize: '32px',
      fontFamily: 'c64esque',
      color: '#00FFFF',
      align: 'center'
    }), this.add.text(365, 260, '[Z]', {
      fontSize: '32px',
      fontFamily: 'c64esque',
      color: '#FFF',
      lineSpacing: 6
    }), textAudio, soundEffectsVolume), zKey, cursors.down);

    // world bounds settings
    this.physics.world.on('worldbounds', (body, up, down, left, right) => {
      switch (body.gameObject.custom_id) {
        case 'bullet':
          // remove bullet to reuse later
          body.setCollideWorldBounds(false);
          body.onWorldBounds = false;
          body.gameObject.setVelocity(0, 0);
          body.gameObject.setPosition(1000, 1000);
          body.gameObject.setActive(false);
          body.gameObject.setVisible(false);
          break;
        case 'player':
          break;
      };
    });
  }

  updateUI() {
    fpsText.setText('FPS: ' + Phaser.Math.RoundTo(game.loop.actualFps, 0));
    xText.setText('X: ' + Phaser.Math.RoundTo(player.sprite.x, 0));
    yText.setText('Y: ' + Phaser.Math.RoundTo(player.sprite.y, 0));
    if (dKey.isDown) {
      player.damagePlayer(1);
    }
  }

}