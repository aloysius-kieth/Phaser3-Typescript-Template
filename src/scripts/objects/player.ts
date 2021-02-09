import constants from '../config/constants'
import { AnimationKeys, AudioConfig } from '../config/modules'

const INVUNERABLE = false;

export default class Player extends Phaser.Physics.Arcade.Sprite {
  invunerable: boolean
  isMovingRight: boolean
  isMovingLeft: boolean
  lives: number
  moveSpeed: number = 0.35;
  blink: boolean = false;
  //itemCollected: boolean = false;
  canMove: boolean = true;

  isIdleToRun: boolean = true;
  isRunLoop: boolean = false;

  scene: Phaser.Scene
  container: Phaser.GameObjects.Container
  glow: Phaser.GameObjects.Sprite

  constructor(scene: Phaser.Scene, x, y) {
    super(scene, x, y, AnimationKeys.CALVIN.IDLE, '001.png')
    this.scene = scene;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.body.setSize(75, 160, true);

    this.glow = this.scene.add.sprite(0, 0, AnimationKeys.CALVIN.ITEMCOLLECT, '000.png')
    //this.glow.setScale(0.2, 0.2)
    this.container = this.scene.add.container(0, 0, [this, this.glow]);
    this.container.setDepth(constants.SORTING_LAYER.GAME);
    //@ts-ignore
    //this.body.offset = new Phaser.Math.Vector2(62.5, 70)

    // idle frames
    var idleFrameNames = this.anims.generateFrameNames(AnimationKeys.CALVIN.IDLE, {
      suffix: '.png',
      start: 1,
      end: 35,
      zeroPad: 3
    });
    this.scene.anims.create({
      key: AnimationKeys.CALVIN.IDLE,
      frames: idleFrameNames,
      frameRate: 25,
      repeat: -1
    });

    // run loop frames
    var runLoopFrameNames = this.anims.generateFrameNames(AnimationKeys.CALVIN.RUNLOOP, {
      suffix: '.png',
      start: 1,
      end: 17,
      zeroPad: 3
    });
    this.scene.anims.create({
      key: AnimationKeys.CALVIN.RUNLOOP,
      frames: runLoopFrameNames,
      frameRate: 25,
      repeat: -1
    });

    // idle to run frames
    var idleToRunFrameNames = this.anims.generateFrameNames(AnimationKeys.CALVIN.IDLETORUN, {
      suffix: '.png',
      start: 1,
      end: 24,
      zeroPad: 3
    });
    this.scene.anims.create({
      key: AnimationKeys.CALVIN.IDLETORUN,
      frames: idleToRunFrameNames,
      frameRate: 25,
    });

    // Poison Hit frames
    var poisonHitFrameNames = this.anims.generateFrameNames(AnimationKeys.CALVIN.POISONHIT, {
      suffix: '.png',
      start: 1,
      end: 23,
      zeroPad: 3
    });
    this.scene.anims.create({
      key: AnimationKeys.CALVIN.POISONHIT,
      frames: poisonHitFrameNames,
      frameRate: 25,
    });

    // Death frames
    var deathFrameNames = this.anims.generateFrameNames(AnimationKeys.CALVIN.DEATH, {
      suffix: '.png',
      start: 1,
      end: 41,
      zeroPad: 3
    });
    this.scene.anims.create({
      key: AnimationKeys.CALVIN.DEATH,
      frames: deathFrameNames,
      frameRate: 25,
    });

    // item collect frames
    var itemCollectFrameNames = this.anims.generateFrameNames(AnimationKeys.CALVIN.ITEMCOLLECT, {
      suffix: '.png',
      start: 1,
      end: 20,
      zeroPad: 3
    });
    this.scene.anims.create({
      key: AnimationKeys.CALVIN.ITEMCOLLECT,
      frames: itemCollectFrameNames,
      frameRate: 25,
    });

    this.initialize();
  }
  initialize() {
    this.setDepth(constants.SORTING_LAYER.GAME);
    this.setImmovable(true);
    this.invunerable = INVUNERABLE;
    this.isMovingRight = false;
    this.isMovingLeft = false;
    this.lives = constants.GAME.MAX_LIVES;
    this.blink = false;
    this.playAnimation(AnimationKeys.CALVIN.IDLE, () => { });
  }
  update(time, delta) {
    this.glow.setPosition(this.x, this.y);
    // boundary check
    //@ts-ignore
    if (this.x >= this.scene.width - this.body.width / 2 && this.isMovingRight) {
      this.isMovingRight = false;
      //@ts-ignore
      this.x = this.scene.width - this.body.width / 2;
      return;
    } else if (this.x <= this.body.width / 2 && this.isMovingLeft) {
      this.isMovingLeft = false;
      this.x = this.body.width / 2;
      return;
    }

    // update player movement
    if (this.canMove) {
      if (this.isMovingLeft && !this.isMovingRight) {
        if (this.isIdleToRun && !this.isRunLoop) {
          this.playAnimation(AnimationKeys.CALVIN.IDLETORUN, () => {
            this.isIdleToRun = false;
            this.isRunLoop = true;
          })
          // this.anims.play(AnimationKeys.CALVIN.IDLETORUN, true)
          //   .once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
          //     this.isIdleToRun = false;
          //     this.isRunLoop = true;
          //   });
        } else if (this.isRunLoop && !this.isIdleToRun) {
          //this.anims.play(AnimationKeys.CALVIN.RUNLOOP, true);
          this.playAnimation(AnimationKeys.CALVIN.RUNLOOP, () => { })
        }
        this.move(true, delta);
      } else if (this.isMovingRight && !this.isMovingLeft) {
        if (this.isIdleToRun && !this.isRunLoop) {
          this.playAnimation(AnimationKeys.CALVIN.IDLETORUN, () => {
            this.isIdleToRun = false;
            this.isRunLoop = true;
          })
          // this.anims.play(AnimationKeys.CALVIN.IDLETORUN, true)
          //   .once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
          //     this.isIdleToRun = false;
          //     this.isRunLoop = true;
          //   });
        } else if (this.isRunLoop && !this.isIdleToRun) {
          //this.anims.play(AnimationKeys.CALVIN.RUNLOOP, true);
          this.playAnimation(AnimationKeys.CALVIN.RUNLOOP, () => { })
        }
        this.move(false, delta);
      } else if (!this.blink) {
        // idle 
        this.isIdleToRun = true;
        this.isRunLoop = false;
        this.playAnimation(AnimationKeys.CALVIN.IDLE, () => { });
      }
    }
  }
  move(isLeft, delta) {
    if (isLeft) {
      this.flipX = true;
      this.x -= this.moveSpeed * delta;
    } else {
      this.flipX = false;
      this.x += this.moveSpeed * delta;
    }
  }
  playGlow() {
    this.glow.play(AnimationKeys.CALVIN.ITEMCOLLECT);
  }
  hurtBlink() {
    if (!this.blink) {
      this.blink = true;
      this.canMove = false;
      this.anims.play(AnimationKeys.CALVIN.POISONHIT, true)
        .once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
          this.canMove = true;
          this.scene.tweens.add({
            targets: this,
            alpha: 0,
            ease: 'Cubic.easeOut',
            duration: 125,
            yoyo: true,
            repeat: 3,
            onComplete: () => {
              this.blink = false;
              this.alpha = 1;
            }
          })
        })
    }
  }
  playAnimation(anim, callback) {
    //@ts-ignore
    this.play(anim, true).once(Phaser.Animations.Events.ANIMATION_COMPLETE, callback)
  }
}
