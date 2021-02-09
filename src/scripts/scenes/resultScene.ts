import Constants from '../config/constants'
import FadeSceneBase from '../transitions/fadeSceneBase'
import PineholeSceneBase from '../transitions/pinholeSceneBase'
import { utils } from '../utils/utils'

export default class ResultScene extends FadeSceneBase {
  constructor() {
    super(Constants.SCENES.RESULT)
  }
  preload() {
    super.preload()
    this.cameras.main.setBackgroundColor(0x000000)
  }
  create() {
    super.create()

    // add background
    var bg = this.add.sprite(0, 0, 'gameBackground');
    bg.displayWidth = this.width;
    bg.displayHeight = this.height;
    bg.setOrigin(0);


    this.events.on(Phaser.Scenes.Events.TRANSITION_COMPLETE, () => {
      this.time.delayedCall(2000, () => {
        alert('go to result page')
        // if (this.global.settings.getGame('debugMode')) {
        //   alert('go to result page')
        // } else {
        //   //@ts-ignore
        //   var stringFn = /*"console.log('mee');"*/this.global.settings.getAPI('stringFn');
        //   var fn = `function (){ ${stringFn}}`;
        //   var executeByString = new Function("return (" + fn + ")")();
        //   executeByString();
        // }
      })
    })
  }
}