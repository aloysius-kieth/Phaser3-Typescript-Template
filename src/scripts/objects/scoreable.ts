import FallingObject from './fallingObject'
import AudioConfig from '../config/audioConfig'

class Scoreable extends FallingObject {
  constructor(scene, x, y) {
    super(scene, x, y)
  }
  playSound() {
    var rand = Phaser.Math.Between(1, 4)
    //@ts-ignore
    this.scene.audioManager.playSFX(AudioConfig.SFX.GAIN_POINT.KEY)
  }
}

export default Scoreable
