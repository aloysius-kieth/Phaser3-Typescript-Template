import PinholeSceneBase from '../transitions/pinholeSceneBase'
import InputKeys from '../utils/inputKeys'

import { Constants, utils, AudioManager, FpsText, AudioConfig, AnimationKeys } from '../config/modules'
import ScoreManager from '../managers/scoreManager'
import FadeSceneBase from '../transitions/fadeSceneBase'

export default class MainScene extends FadeSceneBase {
  fpsText: Phaser.GameObjects.Text;
  inputKeys: InputKeys;
  scoreManager: ScoreManager;

  gameSettings = {

  }

  constructor() {
    super(Constants.SCENES.MAIN);
  }

  preload() {
    super.preload();

    this.showLoadingCircle();

    this.load.image('gameBackground', 'assets/img/game/gameBackground.png');
    this.load.image('button', 'assets/img/game/button.png');
    this.load.image('poison', 'assets/img/game/poison.png');
    this.load.image('scoreBox', 'assets/img/game/scoreBox.png');
    this.load.image('timerBox', 'assets/img/game/timerBox.png');
    this.load.image('life-filled', 'assets/img/game/life-filled.png');
    this.load.image('life-empty', 'assets/img/game/life-empty.png');
    this.load.image('overlay', 'assets/img/overlay.png');
    this.load.image('1_inactive', 'assets/img/game/1_inactive.png');
    this.load.image('1_active', 'assets/img/game/1_active.png');
    this.load.image('2_inactive', 'assets/img/game/2_inactive.png');
    this.load.image('2_active', 'assets/img/game/2_active.png');
    this.load.image('3_inactive', 'assets/img/game/3_inactive.png');
    this.load.image('3_active', 'assets/img/game/3_active.png');
    this.load.image('rays', 'assets/img/game/rays.png');

    this.load.image('poison', 'assets/img/game/poison.png');
    this.load.image('p1', 'assets/img/game/products/p1.png');
    this.load.image('p2', 'assets/img/game/products/p2.png');
    this.load.image('p3', 'assets/img/game/products/p3.png');
    this.load.image('p4', 'assets/img/game/products/p4.png');
    this.load.image('p5', 'assets/img/game/products/p5.png');
    this.load.image('p6', 'assets/img/game/products/p6.png');
    this.load.image('p7', 'assets/img/game/products/p7.png');
    this.load.image('p8', 'assets/img/game/products/p8.png');
    this.load.image('p9', 'assets/img/game/products/p9.png');

    //#region Load Atlas 
    this.load.atlas(AnimationKeys.CALVIN.IDLE, 'assets/atlas/calvin_idle.png', 'assets/atlas/calvin_idle.json');
    this.load.atlas(AnimationKeys.CALVIN.RUNLOOP, 'assets/atlas/calvin_runLoop.png', 'assets/atlas/calvin_runLoop.json');
    this.load.atlas(AnimationKeys.CALVIN.IDLETORUN, 'assets/atlas/calvin_idleToRun.png', 'assets/atlas/calvin_idleToRun.json');
    this.load.atlas(AnimationKeys.CALVIN.POISONHIT, 'assets/atlas/calvin_poisonHit.png', 'assets/atlas/calvin_poisonHit.json');
    this.load.atlas(AnimationKeys.CALVIN.ITEMCOLLECT, 'assets/atlas/calvin_itemCollectGlow.png', 'assets/atlas/calvin_itemCollectGlow.json');
    this.load.atlas(AnimationKeys.CALVIN.DEATH, 'assets/atlas/calvin_death.png', 'assets/atlas/calvin_death.json');


    this.load.on(Phaser.Loader.Events.PROGRESS, this.onProgress, this);
    this.load.on(Phaser.Loader.Events.COMPLETE, () => {
      this.showLoadingCircle();
    }, this)

    this.cameras.main.setBackgroundColor(0x000000);
    //#endregion
  }

  onProgress(value) {
    //console.log(value);
  }

  create() {
    super.create();
    this.inputKeys = new InputKeys(this);

    this.initSettings();

    this.scoreManager = new ScoreManager(this, 0, 0, {
      fill: '#FDCA04',
      fontFamily: 'Merck'
    });
    var scoreBoxWidth = this.textures.get('scoreBox').getSourceImage().width;
    var scoreBoxHeight = this.textures.get('scoreBox').getSourceImage().height;
    this.scoreManager.addScorebox(this.width - scoreBoxWidth / 2, scoreBoxHeight / 1.8);

    // add background
    var bg = this.add.sprite(0, 0, 'gameBackground');
    bg.displayWidth = this.width;
    bg.displayHeight = this.height;
    bg.setOrigin(0);


    //this.fpsText = new FpsText(this)

    this.initEventEmitters();

    this.events.on(Phaser.Scenes.Events.CREATE, () => {
      this.time.delayedCall(4000, () => {
      })
    })
  }

  initSettings() {

  }

  initEventEmitters() {

  }

  // Update Func
  update(time, delta) {

    if (Phaser.Input.Keyboard.JustDown(this.inputKeys.KEY_SPACE)) {
      this.scene.transition({
        duration: 2500,
        target: Constants.SCENES.RESULT
      })
    }

    //this.fpsText.update();
  }
}
