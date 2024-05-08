/*  Students: Please use this week's project for Week 13: Assignment 16: Prototype. 
     You will need to replace the contents of this JavaScript file with your own work, 
     and create any other files, if any, required for the assignment.
     When you are done, be certain to submit the assignment in Canvas to be graded. */
"use strict";

let game;

let config = {
  type: Phaser.AUTO,
  pixelArt: true,
  roundPixels: false,
  fps: {
    target: 60,
    smoothStep: true,
    forceSetTimeOut: true
  },
  scale: {
    mode: Phaser.Scale.FIT,
    parent: 'phaser-example',
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 512, //16 by 9
    height: 288
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {
        y: 400,
        x: 0
      },
      debug: false
    }
  },
  scene: [mainMenuScene, fall, gameOver]
};

//loading fonts
WebFont.load({
  custom: {
    families: ['c64esque']
  },
  active: function() {
    game = new Phaser.Game(config);
  },
  inactive: function() {
    game = new Phaser.Game(config);
  }
});