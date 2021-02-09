import 'phaser'

import { utils } from './utils/utils'
import Constants from './config/constants'
import GlobalScene from './scenes/globalScene'
import BootScene from './scenes/bootScene'
import MainScene from './scenes/mainScene'
import ResultScene from './scenes/resultScene'
import PreloadScene from './scenes/preloadScene'
import LoadingCircle from './scenes/loadingCircle'

// Portrait Mode
var DEFAULT_WIDTH = 540
var DEFAULT_HEIGHT = 960

window.onload = function () {
  let isReady = false

  //  Check if device is mobile
  if (utils.GetBrowserPlatform() != 'desktop') {
    console.log('on mobile')
    // Check if mobile's orientation is landscape
    if (utils.isLandscape) {
      window.addEventListener('orientationchange', orientEvent)
    } else {
      // Mobile's orientation is portrait
      var windowWidth = window.innerWidth
      var windowHeight = window.innerHeight
      var ratio = windowHeight / windowWidth
      // console.log(windowWidth)
      // console.log(windowHeight)
      // console.log('ratio: ' + ratio)
      if (ratio >= 1) {
        if (ratio < 1.5) {
          DEFAULT_WIDTH = DEFAULT_HEIGHT / ratio
        } else {
          DEFAULT_HEIGHT = DEFAULT_WIDTH * ratio
        }
      }
      isReady = true
    }
  } else {
    // On desktop
    console.log('on desktop')
    var windowWidth = window.innerWidth
    var windowHeight = window.innerHeight
    var ratio = windowHeight / windowWidth
    // console.log(windowWidth)
    // console.log(windowHeight)
    // console.log('ratio: ' + ratio)
    if (ratio >= 1) {
      if (ratio < 1.5) {
        DEFAULT_WIDTH = DEFAULT_HEIGHT / ratio
      } else {
        DEFAULT_HEIGHT = DEFAULT_WIDTH * ratio
      }
    }
    isReady = true
  }

  //Wait until innerheight changes, for max 120 frames
  function orientationChanged() {
    const timeout = 120
    return new window.Promise(function (resolve) {
      const go = (i, height0) => {
        //console.log("waiting")
        window.innerHeight != height0 || i >= timeout
          ? //@ts-ignore
          resolve()
          : window.requestAnimationFrame(() => go(i + 1, height0))
      }
      go(0, window.innerHeight)
    })
  }

  function orientEvent() {
    if (utils.isLandscape) {
      orientationChanged().then(function () {
        //console.log("done")
        var windowWidth = window.innerWidth
        var windowHeight = window.innerHeight
        var ratio = windowHeight / windowWidth
        //console.log('ratio: ' + ratio)
        if (ratio >= 1) {
          if (ratio < 1.5) {
            config.scale.width = DEFAULT_WIDTH = DEFAULT_HEIGHT / ratio
          } else {
            config.scale.height = DEFAULT_HEIGHT = DEFAULT_WIDTH * ratio
          }
        }
        isReady = true
        window.removeEventListener('orientationchange', orientEvent)
      })
    }
  }

  var config = {
    type: Phaser.AUTO,
    backgroundColor: '#000000',
    scale: {
      parent: 'phaser-game',
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: DEFAULT_WIDTH,
      height: DEFAULT_HEIGHT
    },
    physics: {
      default: 'arcade',
      arcade: {
        debug: false
      }
    },
  }

  class Game extends Phaser.Game {
    constructor(config) {
      super(config)

      this.scene.add(Constants.SCENES.GLOBAL, GlobalScene)
      this.scene.add(Constants.SCENES.BOOT, BootScene)
      this.scene.add(Constants.SCENES.PRELOAD, PreloadScene)
      this.scene.add(Constants.SCENES.MAIN, MainScene)
      this.scene.add(Constants.SCENES.RESULT, ResultScene)
      this.scene.add(Constants.SCENES.LOADING_CIRCLE, LoadingCircle)

      this.scene.start(Constants.SCENES.BOOT)
    }
  }

  function checkReady() {
    if (!isReady) {
      setTimeout(checkReady, 100)
    } else {
      new Game(config)
    }
  }

  checkReady()
}
