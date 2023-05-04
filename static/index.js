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
    pixelArt: true,
    roundPixels: false,
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
let monsterSize;
let hero;
let cursors;
let platforms;
let keyQ;
let hitbox;
let overlapTriggered = false;
let overlapTriggeredEnemy = false;
let runOnce = false;
let isAttacking;
let callOnce = false;
let callOnceTwo = false;
let enemyHitBox;
let enemyHitBox2;
let fireball = [];
let fireball2 = [];
let projectileSpam = false;
let inventory;
let inventoryOpen = false;
let tab;
let cursor;
let statArray = [9880, 9930, 9980, 10030, 10080, 10130]
let i = 0
let cursorRunOnce = false
let enterRunOnce = false
let enter;
let health
let stamina
let mana
let luck
let strength
let speed


class hitBoxes {
  constructor({ position, size }) {
    this.position = position;
    this.size = size;
  }
}

function preload() {
  this.load.image("background", "/assets/drake.jpg");
  this.load.image("inventory", "/assets/UI/updatedInventory.png");
  this.load.tilemapTiledJSON("inventoryJSON", "/assets/UI/inventory.json");
  this.load.image("cursor", "assets/cursor.png");
  this.load.audio("swing", "/assets/sounds/swing3.wav");
  this.load.image("tile", "/assets/Tile_1.png");
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
  this.load.spritesheet(
    "projectile",
    "/assets/projectile-SpriteSheet_32x32.png",
    {
      frameWidth: 32,
      frameHeight: 32,
      frames: 6,
    }
  );
}
function create() {
  inventory = this.add.image(0, 1000, "inventory");
  cursor = this.add.image(0, 1000, "cursor");
  // create tilemap
  // ** INVENTORY ** REMEMBER FOR LATER!!! //
  // inventory = this.make.tilemap({key: 'inventoryJSON'})
  // const tileset = inventory.addTilesetImage("gui", "inventory");
  // inventory.createLayer("Tile Layer 1", tileset);
  // inventory.createLayer("Tile Layer 2", tileset);
  tab = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TAB);
  keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
  enter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
  //   this.add.image(0, 0, "background").setOrigin(0, 0);
  platforms = this.physics.add.staticGroup({
    key: "tile",
    repeat: 50,
    setXY: { x: 0, y: 580, stepX: 32.5 },
  });
  // MONSTER SPRITES //
  monster = this.physics.add.sprite(0, 150, "demon");
  // monster.setSize(70, 70); // REMEMBER THESE FOR LATER
  // monster.setOffset(110, 90); // REMEMBER FOR LATER!!!

  monster.setSize(15, 15);
  monster.setOffset(138, 145);
  // monster.body.setGravityY(300);
  // monster.setCollideWorldBounds(true)
  monster.health = 10;
  monster.isDead = false;
  monster.name = "slime";
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
      end: 107, //128 max
    }), // key and then config object for frames
    frameRate: 7,
    repeat: 0, // means that it will be infinite
  });
  this.anims.create({
    key: "slimePhaseTwo",
    frames: this.anims.generateFrameNumbers("demon", {
      start: 107,
      end: 128, //128 max
    }), // key and then config object for frames
    frameRate: 7,
    repeat: 0, // means that it will be infinite
  });
  this.anims.create({
    key: "demonIdle",
    frames: this.anims.generateFrameNumbers("demon", {
      start: 128,
      end: 133,
    }), // key and then config object for frames
    frameRate: 5,
    repeat: -1, // means that it will be infinite
  });
  this.anims.create({
    key: "demonJump",
    frames: this.anims.generateFrameNumbers("demon", {
      start: 224,
      end: 241,
    }), // key and then config object for frames
    frameRate: 7,
    repeat: 0, // means that it will be infinite
  });
  // HERO SPRITES //
  hero = this.physics.add.sprite(100, 520, "hero");
  hero.setSize(25, 52);
  hero.facingRight = true;
  hero.isHit = false;
  hero.level = {
    xp: 0,
    xpForNextLevel: 100,
    currentLevel: 1,
  };
  hero.stats = {
    health: 100,
    strength: 10,
    mana: 100,
    luck: 10,
    speed: 20,
    stamina: 100,
  };
  hero.skillPoints = 0;
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
    repeat: 0, // means that it will be infinite
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
  this.anims.create({
    key: "firebolt",
    frames: this.anims.generateFrameNumbers("projectile", {
      start: 0,
      end: 2,
    }),
    frameRate: 5,
    repeat: -1,
  });
  this.physics.add.collider(hero, platforms); // adds colission between tile and player
  this.physics.add.collider(monster, platforms);
  this.cameras.main.startFollow(hero, true, 1, 1, 0, 200);
  monster.anims.play("slimeIdle", false);
  hitbox = this.add.circle(hero.x + 18, hero.y + 18, 18, 0x0033ff, 0);
  enemyHitBox = this.add.circle(0, 0, 18, 0x0033ff, 0);
  enemyHitBox2 = this.add.circle(0, 0, 18, 0x0033ff, 0);
  this.physics.add.existing(hitbox, true);
  this.physics.add.overlap(monster, hitbox, () => {
    console.log("hit");
  });

  this.physics.add.overlap(hero, monster, () => {
    if (hero.anims.currentAnim.key !== "heroRoll") {
      if (overlapTriggeredEnemy) {
        this.physics.world.removeCollider(
          this.physics.add.collider(monster, hitbox)
        ); // removes collider instantly so code only runs once
        return;
      }
      overlapTriggeredEnemy = true;
      if (hero.x > monster.x) {
        hero.setVelocityX(100);
        hero.setVelocityY(-100);
      } else {
        hero.setVelocityX(-100);
        hero.setVelocityY(-100);
      }
      hero.setTint(0xff0000);
      console.log("hit");
      hero.stats.health -= 10;
      hero.isHit = true;
      setTimeout(() => {
        hero.clearTint();
        hero.isHit = false;
      }, 200);
      setTimeout(() => {
        overlapTriggeredEnemy = false;
      }, 500);
    }
  });

  setInterval(() => {
    if (!monster.isDead && monster.name === "slime") {
      monster.setVelocityY(-300);
    }
  }, 3000);
  setInterval(() => {
    if (monster.name === "demon") {
      demonJumpHandle();
    }
  }, 5000);
}

const enemyHandle = function () {
  if (hero.x > monster.x) {
    monster.flipX = true;
  } else if (hero.x < monster.x) {
    monster.flipX = false;
  }
  if (!monster.isDead) {
    if (monster.body.touching.down) {
      monster.setVelocityX(0);
    }

    if (monster.x - hero.x <= 10 && monster.x - hero.x >= -10) {
      monster.setVelocityX(0);
    } else {
      if (!monster.body.touching.down && monster.name === "slime") {
        if (hero.x < monster.x) {
          monster.flipX = false;
          monster.setVelocityX(-150);
        } else if (hero.x > monster.x) {
          monster.setVelocityX(150);
          monster.flipX = true;
        }
      }
    }
  }
};

const demonJumpHandle = function () {
  if (monster.body.touching.down) {
    monster.anims.play("demonJump", false);
  }
};

function update() {
  if (hero.body.touching.down) {
    hero.isHit = false;
  }
  if (!hero.isHit) {
    hero.setVelocityX(0);
  }
  cursors = this.input.keyboard.createCursorKeys();
  if (cursors.right.isDown) {
    hero.facingRight = true;
    isAttacking = false;
    if (cursors.right.isDown && !cursors.shift.isDown) {
      hero.setVelocityX(100);
      hero.flipX = false;
      hero.anims.play("heroWalkRight", true);
    }
    if (cursors.right.isDown && cursors.shift.isDown) {
      if (hero.stats.stamina > 0) {
        hero.setVelocityX(200);
        hero.flipX = false;

        hero.anims.play("heroRoll", true);
        hero.stats.stamina -= 1;
        // console.log('godbye world')
      } else {
        hero.setVelocityX(100);
        hero.flipX = false;
        hero.anims.play("heroWalkRight", true);
      }
    }
  } else if (cursors.left.isDown) {
    hero.facingRight = false;
    isAttacking = false;
    if (cursors.left.isDown && !cursors.shift.isDown) {
      hero.setVelocityX(-100);
      hero.flipX = true;
      hero.anims.play("heroWalkRight", true);
    }
    if (cursors.left.isDown && cursors.shift.isDown) {
      if (hero.stats.stamina > 0) {
        hero.setVelocityX(-200);
        hero.flipX = true;
        hero.anims.play("heroRoll", true);
        hero.stats.stamina -= 1;
        // console.log('godbye world')
      } else {
        hero.setVelocityX(-100);
        hero.flipX = true;
        hero.anims.play("heroWalkRight", true);
      }
    }
  } else {
    if (!keyQ.isDown) {
      if (!hero.anims.currentAnim) {
        hero.anims.play("heroIdle", true);
      }
    } else if (keyQ.isDown) {
      // for now, we'll just make it key down
      isAttacking = true;

      hero.anims.play("heroAttack", true);

      // hitbox.x = player.x + 27
      // hitbox.y = player.y + 20
    }
  }

  if (
    hero.anims.currentFrame?.index === 3 &&
    hero.anims.currentAnim?.key === "heroAttack"
  ) {
    if (hero.facingRight) {
      hero.setVelocityX(100);
      hitbox.destroy();
      this.sound.play("swing");
      hitbox = this.add.circle(hero.x + 30, hero.y, 18, 0x0033ff, 0);
      this.physics.add.existing(hitbox, true);
      this.physics.add.overlap(monster, hitbox, () => {
        if (overlapTriggered) {
          this.physics.world.removeCollider(
            this.physics.add.collider(monster, hitbox)
          ); // removes collider instantly so code only runs once
          return;
        }
        overlapTriggered = true;
        hitbox.destroy();
        monster.health -= 10;
        monster.setTint(0x1fffff);
        setTimeout(() => {
          monster.clearTint();
        }, 200);
      });
      setTimeout(() => {
        hitbox.destroy();
        overlapTriggered = false;
      }, 500);
    } else if (
      !hero.facingRight &&
      hero.anims.currentAnim?.key === "heroAttack"
    ) {
      hero.setVelocityX(-100);

      hitbox.destroy();
      hitbox = this.add.circle(hero.x - 30, hero.y, 18, 0x0033ff, 0);
      this.physics.add.existing(hitbox, true);
      this.physics.add.overlap(monster, hitbox, () => {
        if (overlapTriggered) {
          this.physics.world.removeCollider(
            this.physics.add.collider(monster, hitbox)
          ); // removes collider instantly so code only runs once
          return;
        }
        overlapTriggered = true;
        hitbox.destroy();
        monster.health -= 10;
        monster.setTint(0x1fffff);
        setTimeout(() => {
          monster.clearTint();
        }, 200);
      });
      setTimeout(() => {
        hitbox.destroy();
        overlapTriggered = false;
      }, 500);
    }
  }

  // if (hero.anims.currentFrame?.index === hero.anims.currentAnim.frames.length && hero.anims.currentAnim.key !== 'heroIdle') {
  //   console.log("hey");
  //   hero.anims.play("heroIdle", true);
  // }
  if (cursors.up.isDown && hero.body.touching.down) {
    // means that if that body is on a floor
    if (inventoryOpen) {
      
    }
    isAttacking = false;
    hero.setVelocityY(-200);
    hero.anims.play("heroJump", true);
  }

  if (cursors.down.isDown) {
    if (!inventoryOpen) {
      console.log('hey')
      if (cursorRunOnce) {
        return;
      }
      cursorRunOnce = true
      i++
      if (i > 5) {
        i = 0
      }
      cursor.y = statArray[i]
      setTimeout(() => {
        cursorRunOnce = false
      }, 100)
    }
  }

  if (enter.isDown && !inventoryOpen) {
    console.log('hey')
    if (enterRunOnce) {
      return;
    }
    enterRunOnce = true
    if (i === 0 && hero.skillPoints > 0) {
      hero.stats.health += 10;
      hero.skillPoints -= 1;
      health.destroy()
      health = this.add.text(
          inventory.x + 10,
          inventory.y - 140,
          `HEALTH: ${hero.stats.health}`,
          { fontsize: 50, color: "black" }
        );
    } else if (i === 1 && hero.skillPoints > 0) {
      hero.stats.mana += 10;
      hero.skillPoints -= 1;
      mana.destroy()
      mana = this.add.text(
          inventory.x + 10,
          inventory.y - 90,
          `MANA: ${hero.stats.mana}`,
          { fontsize: 50, color: "black" }
        );
    } else if (i === 2 && hero.skillPoints > 0) {
      hero.stats.strength += 10;
      hero.skillPoints -= 1;
      strength.destroy()
      strength = this.add.text(
          inventory.x + 10,
          inventory.y - 40,
          `STRENGTH: ${hero.stats.strength}`,
          { fontsize: 50, color: "black" }
        );
    } else if (i === 3 && hero.skillPoints > 0) {
      hero.stats.speed += 10;
      hero.skillPoints -= 1;
      speed.destroy()
      speed = this.add.text(
          inventory.x + 10,
          inventory.y + 10,
          `SPEED: ${hero.stats.speed}`,
          { fontsize: 50, color: "black" }
        );
    } else if (i === 4 && hero.skillPoints > 0) {
      hero.stats.luck += 10;
      hero.skillPoints -= 1;
      luck.destroy()
      luck = this.add.text(
          inventory.x + 10,
          inventory.y + 50,
          `LUCK: ${hero.stats.luck}`,
          { fontsize: 50, color: "black" }
        );
    } else if (i === 5 && hero.skillPoints > 0) {
      hero.stats.stamina += 10
      hero.skillPoints -= 1
      stamina.destroy()
      stamina = this.add.text(
          inventory.x + 10,
          inventory.y + 100,
          `LUCK: ${hero.stats.stamina}`,
          { fontsize: 50, color: "black" }
        );
    }
    setTimeout(() => {
      enterRunOnce = false
    }, 200)
  }

  if (tab.isDown) {
    if (!runOnce) {
      if (inventoryOpen) {
        this.physics.pause();
        inventory = this.add.image(190, 10000, "inventory");
        cursor = this.add.image(350, inventory.y - 120, "cursor");
        this.cameras.main.startFollow(inventory, true, 1, 1);
        health = this.add.text(
          inventory.x + 10,
          inventory.y - 140,
          `HEALTH: ${hero.stats.health}`,
          { fontsize: 50, color: "black" }
        );
        mana = this.add.text(
          inventory.x + 10,
          inventory.y - 90,
          `MANA: ${hero.stats.mana}`,
          {
            fontsize: 50,
            color: "black",
          }
        );
        strength = this.add.text(
          inventory.x + 10,
          inventory.y - 40,
          `STRENGTH: ${hero.stats.strength}`,
          {
            fontsize: 50,
            color: "black",
          }
        );
        speed = this.add.text(
          inventory.x + 10,
          inventory.y + 10,
          `SPEED: ${hero.stats.speed}`,
          {
            fontsize: 50,
            color: "black",
          }
        );
        luck = this.add.text(
          inventory.x + 10,
          inventory.y + 50,
          `LUCK: ${hero.stats.luck}`,
          {
            fontsize: 50,
            color: "black",
          }
        );
        stamina = this.add.text(
          inventory.x + 10,
          inventory.y + 100,
          `STAMINA: ${hero.stats.stamina}`,
          {
            fontsize: 50,
            color: "black",
          }
        );
        this.add.text(
          inventory.x - 220,
          inventory.y + 70,
          `LEVEL ${hero.level.currentLevel} | ${hero.level.xp}/${hero.level.xpForNextLevel}`,
          {
            fontsize: 50,
            color: "black",
          }
        );
        this.add.text(
          inventory.x - 220,
          inventory.y + 120,
          `SKILL POINTS: ${hero.skillPoints}`,
          {
            fontsize: 50,
            color: "black",
          }
        );
      } else if (!inventoryOpen) {
        inventory.destroy();
        this.cameras.main.startFollow(hero, true, 1, 1, 0, 200);
        this.physics.resume();
      }
      runOnce = true;
      inventoryOpen = !inventoryOpen;
      console.log(inventoryOpen);
    }
    setTimeout(() => {
      runOnce = false;
    }, 1000);
  }

  if (
    hero.anims.currentFrame.isLast &&
    hero.anims.currentAnim.key === "heroAttack"
  ) {
    hero.anims.play("heroIdle", true);
  }

  if (hero.body.newVelocity.x === 0 && !isAttacking) {
    hero.anims.play("heroIdle", true);
  }

  if (hero.stats.stamina < 100) {
    hero.stats.stamina += 0.3;
  }
  if (hero.level.xp >= hero.level.xpForNextLevel) {
    hero.level.currentLevel++;
    hero.level.xp -= hero.level.xpForNextLevel;
    hero.level.xpForNextLevel = Math.floor(hero.level.xpForNextLevel * 1.2);

    hero.skillPoints++;
  }

  // ENEMY HANDLES //

  enemyHandle();

  if (monster.health <= 0) {
    if (monster.body.touching.down && !callOnce) {
      hero.anims.play("heroIdle", true);
      monster.anims.play("slimeDeath", false);
      callOnce = true;
      monster.isDead = true;
      hero.level.xp += 1000;
    }
    setTimeout(() => {
      if (!callOnceTwo) {
        monster.anims.play("slimePhaseTwo", true);
        callOnceTwo = true;
      }
    }, 5000);
    if (
      monster.anims.currentFrame.isLast &&
      monster.anims.currentAnim.key === "slimePhaseTwo"
    ) {
      monster.isDead = false;
      monster.name = "demon";
      monster.anims.play("demonIdle", true);
    }
    monster.setSize(70, 70); // REMEMBER THESE FOR LATER
    monster.setOffset(110, 90); // REMEMBER FOR LATER!!!
  }
  if (
    monster.name === "demon" &&
    monster.anims.currentFrame.isLast &&
    monster.anims.currentAnim.key !== "demonIdle"
  ) {
    enemyHitBox.destroy();
    monster.anims.play("demonIdle", true);
  }

  if (
    monster.anims.currentFrame.index === 6 &&
    monster.anims.currentAnim.key === "demonJump"
  ) {
    monster.setVelocityY(-100);
    if (hero.x > monster.x) {
      monster.setVelocityX(400);
    } else {
      monster.setVelocityX(-400);
    }
  }
  if (
    monster.anims.currentFrame.index === 13 &&
    monster.anims.currentAnim.key === "demonJump"
  ) {
    enemyHitBox.destroy();
    enemyHitBox2.destroy();
    if (!projectileSpam) {
      for (let i = 0; i < 10; i++) {
        fireball.push(
          this.physics.add.sprite(
            monster.x + i * 10,
            monster.y + 70,
            "projectile"
          )
        );
      }
      for (let i = 0; i < fireball.length; i++) {
        fireball[i].play("firebolt", true);
        fireball[i].setVelocityX(100 + i * 20);
        fireball[i].setVelocityY(-200 - i * 20);
        fireball[i].setGravity(100 / i);
        this.physics.add.overlap(fireball, hero, () => {
          if (overlapTriggeredEnemy) {
            this.physics.world.removeCollider(
              this.physics.add.collider(hero, fireball)
            ); // removes collider instantly so code only runs once
            return;
          }
          hero.setTint(0xff0000);
          hero.stats.health -= 10;
          hero.setVelocityX(100);
          hero.setVelocityY(-200);
          overlapTriggeredEnemy = true;
          console.log("hit");
          setTimeout(() => {
            hero.clearTint();
          }, 200);
        });
      }
      for (let i = 0; i < 10; i++) {
        fireball2.push(
          this.physics.add.sprite(
            monster.x - i * 10,
            monster.y + 70,
            "projectile"
          )
        );
      }
      for (let i = 0; i < fireball2.length; i++) {
        fireball2[i].play("firebolt", true);
        fireball2[i].setVelocityX(-100 - i / 20);
        fireball2[i].setVelocityY(-200 - i * 20);
        fireball2[i].setGravity(100 / i);
        this.physics.add.overlap(fireball2, hero, () => {
          if (overlapTriggeredEnemy) {
            this.physics.world.removeCollider(
              this.physics.add.collider(hero, fireball2)
            ); // removes collider instantly so code only runs once
            return;
          }
          hero.setTint(0xff0000);
          hero.stats.health -= 10;
          hero.setVelocityX(100);
          hero.setVelocityY(-200);
          overlapTriggeredEnemy = true;
          console.log("hit");
          setTimeout(() => {
            hero.clearTint();
          }, 200);
        });
      }
      projectileSpam = true;
    }
    setTimeout(() => {
      projectileSpam = false;
      fireball = [];
      fireball2 = [];
      overlapTriggeredEnemy = false;
    }, 200);
    enemyHitBox = this.add.circle(
      monster.x + 50,
      monster.y + 70,
      18,
      0x0033ff,
      0
    );
    this.physics.add.existing(enemyHitBox, true);
    this.physics.add.overlap(enemyHitBox, hero, () => {
      if (overlapTriggeredEnemy) {
        this.physics.world.removeCollider(
          this.physics.add.collider(hero, enemyHitBox)
        ); // removes collider instantly so code only runs once
        return;
      }
      overlapTriggeredEnemy = true;
      hero.stats.health -= 10;
      hero.setTint(0xff0000);
      hero.setVelocityX(100);
      hero.setVelocityY(-100);
      setTimeout(() => {
        hero.clearTint();
        overlapTriggeredEnemy = false;
      }, 200);
    });
    enemyHitBox2 = this.add.circle(
      monster.x - 50,
      monster.y + 70,
      18,
      0x0033ff,
      0
    );
    this.physics.add.existing(enemyHitBox2, true);
    this.physics.add.overlap(enemyHitBox2, hero, () => {
      if (overlapTriggeredEnemy) {
        this.physics.world.removeCollider(
          this.physics.add.collider(hero, enemyHitBox2)
        ); // removes collider instantly so code only runs once
        return;
      }
      overlapTriggeredEnemy = true;
      hero.stats.health -= 10;
      hero.setTint(0xff0000);
      hero.setVelocityX(-100);
      hero.setVelocityY(-100);
      setTimeout(() => {
        hero.clearTint();
        overlapTriggeredEnemy = false;
      }, 200);
    });
  }
  if (monster.anims.currentFrame.index === 15) {
    enemyHitBox.destroy();
    enemyHitBox2.destroy();
  }
}

const game = new Phaser.Game(config);
