import FallingObject from './fallingObject'
import AudioConfig from '../config/audioConfig'

class Obstacle extends FallingObject {
  constructor(scene, x, y) {
    //@ts-ignore
    super(scene, x, y, '')
  }
  playSound() {
    //@ts-ignore
    this.scene.audioManager.playSFX(AudioConfig.SFX.POISON_HIT.KEY)
  }
}

export default Obstacle
