import BaseScene from './baseScene'
import { AudioConfig, AudioManager, Constants, utils } from '../config/modules'

const LOADING_BAR_COLOR = 0xed3b98
const LOADING_TEXT = '#532F91'
const TEST_ID = '123'

export default class PreloadScene extends BaseScene {
  loadTextTween: Phaser.Tweens.Tween;
  readyCount: number;
  delay: Phaser.Time.TimerEvent;
  percentText: Phaser.GameObjects.Text;
  loadingText: Phaser.GameObjects.Text;
  loadingCircle: Phaser.GameObjects.Graphics;

  width: number;
  height: number;

  constructor() {
    super(Constants.SCENES.PRELOAD)
  }
  preload() {
    super.preload()

    this.cameras.main.setBackgroundColor(0xffc732)
    this.scene.launch(Constants.SCENES.GLOBAL)
    this.scene.launch(Constants.SCENES.LOADING_CIRCLE)
    // this.scene.get(Constants.SCENES.LOADING_CIRCLE).scene.setVisible(false);

    this.width = this.cameras.main.centerX
    this.height = this.cameras.main.centerY

    this.percentText = this.add.text(this.width, this.height, '0 %', {
      font: '36px Merck',
      color: LOADING_TEXT
    })
    this.percentText.setOrigin(0.5, 0.45)

    this.loadingCircle = this.add.graphics()
    this.loadingCircle.lineStyle(13, LOADING_BAR_COLOR)

    this.loadingText = this.make.text({
      x: this.width,
      y: this.height - 120,
      text: 'Loading...',
      style: {
        font: '34px Merck',
        color: LOADING_TEXT
      }
    })
    this.loadingText.setOrigin(0.5, 0.5)

    this.loadTextTween = this.tweens.add({
      targets: this.loadingText,
      ease: 'Linear',
      loop: -1,
      duration: 500,
      alpha: { from: 0, to: 1 },
      yoyo: true,
    })

    // load sprites
    this.loadSprites()

    this.loadPNGSeq()

    // load json files
    this.loadJsonFiles()

    // load audio
    this.loadAudio()

    // on update
    this.load.on(Phaser.Loader.Events.PROGRESS, this.onProgress, this)

    // on update file progress
    this.load.on(Phaser.Loader.Events.FILE_PROGRESS, this.onFileProgress, this)

    // on load complete
    this.load.on(Phaser.Loader.Events.COMPLETE, this.onComplete, this)

    this.readyNow()
  }
  loadJsonFiles() {
    this.load.json('settings', 'assets/json/settings.json')
  }
  loadAudio() {
    //#region Load audio
    // this.load.audioSprite('music', 'assets/audio/music.json', 'assets/audio/music.mp3');
    // this.load.audioSprite('sfx', 'assets/audio/sfx.json', 'assets/audio/sfx.mp3');

    //#endregion
    this.load.audio(AudioConfig.MUSIC.IDLE_MUSIC.KEY, 'assets/audio/bgm/bgm_preview.mp3');
    this.load.audio(AudioConfig.SFX.COUNT3.KEY, 'assets/audio/sfx/count3.mp3');
    this.load.audio(AudioConfig.SFX.COUNT2.KEY, 'assets/audio/sfx/count2.mp3');
    this.load.audio(AudioConfig.SFX.COUNT1.KEY, 'assets/audio/sfx/count1.mp3');
    this.load.audio(AudioConfig.SFX.GAIN_POINT.KEY, 'assets/audio/sfx/gainpoint.mp3');
    this.load.audio(AudioConfig.SFX.POISON_HIT.KEY, 'assets/audio/sfx/poisonhit.mp3');
    this.load.audio(AudioConfig.SFX.GAME_OVER.KEY, 'assets/audio/sfx/gameover.mp3');
    this.load.audio(AudioConfig.SFX.DEATH.KEY, 'assets/audio/sfx/death.mp3');
    this.load.audio(AudioConfig.SFX.BUTTON_CLICK.KEY, 'assets/audio/sfx/buttonclick.wav');
  }
  loadSprites() {

  }
  loadPNGSeq() {
  }
  init() {
    this.readyCount = 0;
  }
  create() {
    super.create();

  }
  readyNow() {
    this.readyCount++
    if (this.readyCount === 2) {
      this.scene.start(Constants.SCENES.MAIN);
    }
  }
  onFileProgress(file, value) {
    //assetText.setText('Loading asset: ' + file.key);
  }
  onProgress(value) {
    this.percentText.setText(Phaser.Math.RoundTo(value * 100) + ' %')
    this.loadingCircle.beginPath()
    this.loadingCircle.arc(
      this.width,
      this.height,
      80,
      Phaser.Math.DegToRad(270),
      Phaser.Math.DegToRad(270 + value * 360),
      false,
      0.02
    )
    this.loadingCircle.strokePath()

    this.loadingText.text = value < 0.5 ? 'Preparing...' : value < 0.99 ? 'Halfway there!' : 'Done!'
  }
  onComplete() {
    this.audioManager = new AudioManager(this, this.global);

    this.loadTextTween.remove();
    this.loadingText.alpha = 1;
    this.percentText.setText("Start")
      .setInteractive()
      .once('pointerdown', () => {
        this.audioManager.playSFXCallback(AudioConfig.SFX.BUTTON_CLICK.KEY, () => {
          this.delay = this.time.delayedCall(1000, this.onLoad, [], this);
        })
      }, this);
    this.tweens.add({
      targets: this.percentText,
      ease: 'Linear',
      loop: -1,
      duration: 500,
      alpha: { from: 0, to: 1 },
      yoyo: true
    })

    if (this.global.settings?.getGame('debugMode')) {
      this.global.userID = TEST_ID;
    } else {
      // let params = new URLSearchParams(location.search)
      // if (params.has('userID')) {
      //     this.global.userID = params.get('userID')
      // }
      //this.global.userID = utils.GetSessionStorageItem(Constants.SESSION_KEYS.USER_ID)!
      var audio = utils.GetSessionStorageItem(Constants.SESSION_KEYS.AUDIO);
      if (audio != '') {
        if (audio == 'off') {
          this.sound.mute = true;
        } else if (audio == 'on') {
          this.sound.mute = false;
        }
      }
    }

    //console.log(this.global.userID)

    // if (this.global.userID != '' && this.global.userID != undefined) {

    // } else {
    //   loadingText.text = 'No User ID Found!'
    // }
  }

  onLoad() {
    this.loadingText.destroy();
    this.percentText.destroy();
    this.loadingCircle.destroy();
    this.readyNow();
  }
}
