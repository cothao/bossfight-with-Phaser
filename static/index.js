const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 800,
  height: 600,
  physics: {
    // adds physics to the game, default is the style and the object is its config
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
    // extend: {
    //         drawKeyboard: drawKeyboard
    //     }
  },
};

let monster;
let hero;
let cursors;
let platforms;
let keyQ

function preload() {
//   this.load.image("background", "/assets/drake.jpg");
  this.load.image('tile', '/assets/Tile_1.png')
  this.load.spritesheet("demon", "/assets/demon_slime.png", {
    frameWidth: 288, //will be size of frames indicated on png provided
    frameHeight: 160,
    frames: 6, //amount of frames given
  });
  this.load.spritesheet("hero", "/assets/HeroKnight.png", {
    frameWidth: 100, //will be size of frames indicated on png provided
    frameHeight: 55,
    frames: 6, //amount of frames given
  });
}
function create() {
    keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
//   this.add.image(0, 0, "background").setOrigin(0, 0);
platforms = this.physics.add.staticGroup({
    key: 'tile',
    repeat: 50,
    setXY: {x:0, y: 580, stepX: 32.5}
})
  // MONSTER SPRITES //
  monster = this.physics.add.sprite(600, 450, "demon");
  monster.setCollideWorldBounds(true); // cant go outside of canvas
  monster.body.setGravityY(300);
  this.anims.create({
    key: "slimeIdle",
    frames: this.anims.generateFrameNumbers("demon", { start: 0, end: 5 }), // key and then config object for frames
    frameRate: 7,
    repeat: -1, // means that it will be infinite
  });
  this.anims.create({
    key: "slimeJump",
    frames: this.anims.generateFrameNumbers("demon", {
      start: 32,
      end: 39,
    }), // key and then config object for frames
    frameRate: 7,
    repeat: -1, // means that it will be infinite
  });
  this.anims.create({
    key: "slimeAttack",
    frames: this.anims.generateFrameNumbers("demon", {
      start: 64,
      end: 69,
    }), // key and then config object for frames
    frameRate: 7,
    repeat: -1, // means that it will be infinite
  });
  this.anims.create({
    key: "slimeDeath",
    frames: this.anims.generateFrameNumbers("demon", {
      start: 96,
      end: 128,
    }), // key and then config object for frames
    frameRate: 7,
    repeat: -1, // means that it will be infinite
  });

  // HERO SPRITES //
  hero = this.physics.add.sprite(100, 520, 'hero')
  hero.setCollideWorldBounds(true)
  this.anims.create({
    key: "heroIdle",
    frames: this.anims.generateFrameNumbers("hero", {
      start: 0,
      end: 7,
    }), // key and then config object for frames
    frameRate: 7,
    repeat: -1, // means that it will be infinite
  });
  this.anims.create({
    key: "heroWalkRight",
    frames: this.anims.generateFrameNumbers("hero", {
      start: 8,
      end: 17,
    }), // key and then config object for frames
    frameRate: 7,
    repeat: -1, // means that it will be infinite
  });
  this.anims.create({
    key: "heroJump",
    frames: this.anims.generateFrameNumbers("hero", {
      start: 37,
      end: 40,
    }), // key and then config object for frames
    frameRate: 7,
    repeat: -1, // means that it will be infinite
  });
  this.anims.create({
    key: "heroAttack",
    frames: this.anims.generateFrameNumbers("hero", {
      start: 18,
      end: 24,
    }), // key and then config object for frames
    frameRate: 7,
    repeat: -1, // means that it will be infinite
  });
  this.anims.create({
    key: "heroRoll",
    frames: this.anims.generateFrameNumbers("hero", {
      start: 71,
      end: 74,
    }), // key and then config object for frames
    frameRate: 7,
    repeat: -1, // means that it will be infinite
  });
  this.physics.add.collider(hero, platforms) // adds colission between tile and player
  this.physics.add.collider(monster, platforms)
}

function update() {
    monster.anims.play("slimeDeath", true); // inits the sprite; true PLAYS it, false pauses
    cursors = this.input.keyboard.createCursorKeys()
    // cursors.left.keyCode = 65
    // cursors.right.keyCode = 68
    // cursors.up.keyCode = 87
    // cursors.down.keyCode = 83;
    if (cursors.right.isDown) {
        hero.setVelocityX(100)
        hero.flipX = false;
        hero.anims.play('heroWalkRight', true)
    }
    else if (cursors.left.isDown) {
        hero.setVelocityX(-100);
        hero.flipX = true
        hero.anims.play("heroWalkRight", true);
    } else if (cursors.shift.isDown) {

        console.log('goodbye world')
    }
    else {
    if(!keyQ.isDown) {
        hero.setVelocityX(0)
        hero.anims.play("heroIdle", true);
    }
    else if (keyQ.isDown) { // for now, we'll just make it key down
        hero.setVelocityX(0);
      hero.anims.play("heroAttack", true);
    }
}

    if (cursors.up.isDown && hero.body.touching.down) { // means that if that body is on a floor
        hero.setVelocityY(-200)
        hero.anims.play('heroJump', true)
        console.log('hey')
    }
}
const game = new Phaser.Game(config);