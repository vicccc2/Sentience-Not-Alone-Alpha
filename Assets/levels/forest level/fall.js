// first part of the first level of teh game

class fall extends UIScene {

  constructor() {
    super({
      key: 'fall'
    });
  }

  preload = function() {
    // music
    this.load.audio('snowMusic', 'Assets/Audio/music/Black Diamond.mp3');

    //characters
    this.load.image('PC', 'Assets/Sprites/Characters/player/pc.png');

    this.load.image('june', 'Assets/Sprites/Characters/june/june_portrait.png');
    this.load.image('juneSprite', 'Assets/Sprites/Characters/june/june.png');

    this.load.image('jay', 'Assets/Sprites/Characters/john/john_portrait.png');
    this.load.image('jaySprite', 'Assets/Sprites/Characters/john/john.png');

    // BG
    this.load.image('moon', 'Assets/levels/forest level/tileset/moon.png');
    this.load.image('mountains', 'Assets/levels/forest level/mountains.png');

    // tile map
    this.load.image('tiles', 'Assets/levels/forest level/tileset/snowTileSet_Padded.png');
    this.load.tilemapTiledJSON('map', 'Assets/levels/forest level/tileset/forest.json');

    // bullet
    this.load.image('laser', 'Assets/Sprites/weapons/laser.png');
    this.load.audio('laserSound', 'Assets/Audio/8Bit Retro Game SFX Pack - 96kHz 24Bit/02Traditional/Weapons/Gun/8BitRetroSFXPack1_Traditional_Weapon_Gun09.wav');
    this.load.audio('damage', 'Assets/Audio/8Bit Retro Game SFX Pack - 96kHz 24Bit/02Traditional/DamageDealtTaken/8BitRetroSFXPack1_Traditional_Damage10.wav');
    this.load.audio('jump', 'Assets/Audio/8Bit Retro Game SFX Pack - 96kHz 24Bit/02Traditional/Jump/8BitRetroSFXPack1_Traditional_Jump02.wav');

    // enemies
    this.load.image('enemy', 'Assets/Sprites/enemies/MPU/MPU.png');
    this.load.image('enemyDamaged', 'Assets/Sprites/enemies/MPU/MPU_damaged.png')
    this.load.audio('explode', 'Assets/Audio/8Bit Retro Game SFX Pack - 96kHz 24Bit/01Contemporary/Explosions/8BitRetroSFXPack1_Contemporary_Explosion03.wav');

    // item
    this.load.image('part', 'Assets/Sprites/enemies/MPU/part.png');
    this.load.audio('pickUp', 'Assets/Audio/8Bit Retro Game SFX Pack - 96kHz 24Bit/02Traditional/Item PickUp/8BitRetroSFXPack1_Traditional_ItemPickUp40.wav');

    // UI  
    this.loadUI();
  }

  jay = new Actor('Jay', 'jay', '#52965d');
  jaySprite;
  june = new Actor('June', 'june', '#c6e6c1');
  juneSprite;

  create = function() {

    // music
    music = this.sound.add('snowMusic');
    music.play({
      volume: 0,
      loop: true
    });

    // enemy death sound
    this.pickUp = this.sound.add('pickUp');
    this.deathSound = this.sound.add('explode');

    this.tweens.add({
      targets: music,
      volume: musicVolume,
      duration: 2000
    });

    // BG
    this.add.image(256, 144, 'moon').setScrollFactor(0);
    this.add.tileSprite(0, 80, 5120, 512, 'mountains').setScrollFactor(0.3, 0.1);

    // tile map
    let mymap = this.make.tilemap({ key: "map" });
    let mytileset = mymap.addTilesetImage("snowTileSet", "tiles", 16, 16, 1, 2);

    let mybelowlayer1 = mymap.createLayer("trees 1", mytileset, 0, 0);
    let mybelowlayer2 = mymap.createLayer("trees 2", mytileset, 0, 0);
    let myworldlayer = mymap.createLayer("map", mytileset, 0, 0);

    myworldlayer.setCollisionByProperty({ collides: true });

    // characters
    this.juneSprite = this.physics.add.sprite(1468, 660 - 2, 'juneSprite');
    this.jaySprite = this.physics.add.sprite(1510, 660 - 2, 'jaySprite');
    this.jaySprite.body.setAllowGravity(false);
    this.juneSprite.body.setAllowGravity(false);

    // player
    player = new Player(368, 725, 'PC', 'jump', 'damage');

    this.physics.add.collider(player.sprite, myworldlayer);

    // player's weapon
    weapon1 = new Weapon(this.physics.add.group({
      defaultKey: 'laser',
      maxSize: 10,
    }), 1, 300, 500, 500, 180, 'laserSound');

    this.physics.add.collider(weapon1.bullets, myworldlayer, function(bullet, world) {
      weapon1.shootOver(bullet);
      world.destroy();
    });

    // add overlap with NPCS
    this.physics.add.overlap(player.sprite, this.jaySprite, function(p, john) {
      if (p.body.blocked.down === true) {
        conversationManager.listen(1);
      }
    });
    this.physics.add.collider(this.jaySprite, myworldlayer);

    this.physics.add.overlap(player.sprite, this.juneSprite, function(p, june) {
      if (p.body.blocked.down === true) {
        conversationManager.listen(2);
      }
    });
    this.physics.add.collider(this.juneSprite, myworldlayer);


    // enemy
    enemies = this.physics.add.group({
      defaultKey: 'enemy',
      maxSize: 30,
    });

    this.physics.add.collider(enemies, myworldlayer);
    this.physics.add.collider(enemies, enemies);
    this.physics.add.collider(player.sprite, enemies, function(p, enemy) {
      player.damagePlayer(1);
    });

    for (let i = 0; i < 11; i++) {
      let enemySpawn = mymap.findObject("enemySpawnPoints", obj => obj.name === ("spawn" + (1 + i)));
      let en = enemies.get();
      en.x = enemySpawn.x
      en.y = enemySpawn.y - 8;
      if (en) {
        en.health = 2;
        en.setActive(true);
        en.setVisible(true);
        en.body.setAllowGravity(true);
        en.setCollideWorldBounds(true);
        en.body.onWorldBounds = true;
      }
    }

    // collectibles
    parts = this.physics.add.group({
      defaultKey: 'part',
      maxSize: 20
    });

    this.physics.add.collider(parts, myworldlayer);
    this.physics.add.overlap(parts, player.sprite, function(p, part) {
      computerParts += 1;
      computerPartsText.setText('Parts: ' + computerParts);
      part.destroy();
      currentScene.pickUp.play({
        volume: soundEffectsVolume,
        loop: false
      });
    });

    this.physics.add.overlap(weapon1.bullets, enemies, function(bullet, enemy) {
      enemy.health -= 1;
      weapon1.shootOver(bullet);
      currentScene.deathSound.play({
        volume: soundEffectsVolume,
        loop: false
      });

      if (enemy.health <= 0) {
        let part = parts.get();
        if (part) {
          part.x = enemy.x;
          part.y = enemy.y;

        }
        enemy.destroy(0);
      }
      else {
        enemy.setSize(16, 12).setOffset(0, 4);
        enemy.setTexture('enemyDamaged');
      }
    });

    // camera   
    camera = this.cameras.main;
    camera.startFollow(player.cameraBox, false, 1, 1, 0, 0);
    this.cameras.main.setBounds(0, 0, 2864, 784 - 2);
    this.physics.world.setBounds(0, 0, 2864, 784 - 2);

    // creates UI
    this.createUI(); // always at the end

    // converastions
    conversationManager.newConversation(new Conversation([this.jay, this.june], ['You okay?, that was quite the fall...', '...']));
    conversationManager.newConversation(new Conversation([this.june, this.june], ['hello, your one of the ones that fell...', 'Sorry you had to see that.']));

  }

  update = function() {
    enemies.children.iterate(function(en) {
      if (Phaser.Math.Distance.Between(en.x, en.y, player.sprite.x, player.sprite.y) < 200) {
        if (player.sprite.x > en.x) {
          en.flipX = true;
          en.setVelocityX(60);
        }
        else if (player.sprite.x < en.x) {
          en.flipX = false;
          en.setVelocityX(-60);
        }
      }
      else {
        en.setVelocityX(0);
      }
    });
    weapon1.listen();
    player.updatePlayer();
    this.updateUI();

    if ((player.sprite.x > this.juneSprite.x) && Phaser.Math.Distance.BetweenPoints(player.sprite, this.juneSprite) < 80) {
      this.juneSprite.flipX = false;
    }
    else {
      this.juneSprite.flipX = true;
    }

    if ((player.sprite.x > this.jaySprite.x) && Phaser.Math.Distance.BetweenPoints(player.sprite, this.jaySprite) < 80) {
      this.jaySprite.flipX = false;
    }
    else {
      this.jaySprite.flipX = true;
    }
  }

}