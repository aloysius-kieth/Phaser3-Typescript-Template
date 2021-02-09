import Constants from '../config/constants'

export default class Heart extends Phaser.GameObjects.Image {
  constructor(config) {
    super(config.scene, config.x, config.y, 'life-filled')

    config.scene.add.existing(this)

    // this.x = config.scene.width - this.displayWidth
    this.y = this.displayHeight
    this.setDepth(Constants.SORTING_LAYER.UI)
  }
  onHurt() {
    this.setTexture('life-empty')
  }
}
