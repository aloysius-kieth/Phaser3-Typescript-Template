import Constants from '../config/constants'
import AudioConfig from '../config/audioConfig'

class CountdownOverlay extends Phaser.GameObjects.Sprite {
  constructor(scene) {
    super(scene, 0, 0, 'overlay')
    scene.add.existing(this)

    this.displayWidth = scene.width
    this.displayHeight = scene.height
    this.alpha = 0
    this.setOrigin(0)
    this.setDepth(Constants.SORTING_LAYER.UI + 2)
  }
}

class CountImage extends Phaser.GameObjects.Image {
  constructor(scene: Phaser.Scene, x, y, texture) {
    super(scene, x, y, texture)
    scene.add.existing(this)
    this.setOrigin(0)
  }
}

class CountDownAnimator {
  scene: Phaser.Scene
  count: number
  countEmit: Phaser.Events.EventEmitter
  overlay: CountdownOverlay

  countInactiveImages: CountImage[]
  countInactiveContainer: Phaser.GameObjects.Container

  countActiveImages: CountImage[]
  countActiveContainer: Phaser.GameObjects.Container

  constructor(scene) {
    this.scene = scene

    this.count = 3
    this.countEmit = new Phaser.Events.EventEmitter()
    this.countInactiveImages = []
    this.countActiveImages = []

    this.overlay = new CountdownOverlay(this.scene)

    for (let i = 3; i > 0; i--) {
      let img = new CountImage(this.scene, 0, 0, `${i}_inactive`)
      this.countInactiveImages.push(img)
    }

    for (let i = 3; i > 0; i--) {
      let img = new CountImage(this.scene, 0, 0, `${i}_active`)
      this.countActiveImages.push(img)
    }

    var countImgWidth = this.scene.textures.get('1_active').getSourceImage().width
    var countImgHeight = this.scene.textures.get('1_active').getSourceImage().height
    if (this.countInactiveImages.length > 0) {
      for (let i = 0; i < this.countInactiveImages.length; i++) {
        let img = this.countInactiveImages[i]
        img.y += i * countImgHeight * 1.1
        img.alpha = 0
      }
    }

    if (this.countActiveImages.length > 0) {
      for (let i = 0; i < this.countActiveImages.length; i++) {
        let img = this.countActiveImages[i]
        img.y += i * countImgHeight * 1.1
        img.alpha = 0
      }
    }

    this.countInactiveContainer = this.scene.add.container(
      //@ts-ignore
      this.scene.width / 2 - countImgWidth / 2,
      //@ts-ignore
      this.scene.height / 6,
      this.countInactiveImages
    )

    this.countActiveContainer = this.scene.add.container(
      //@ts-ignore
      this.scene.width / 2 - countImgWidth / 2,
      //@ts-ignore
      this.scene.height / 6,
      this.countActiveImages
    )
    this.countInactiveContainer.setDepth(Constants.SORTING_LAYER.UI + 3)
    this.countActiveContainer.setDepth(Constants.SORTING_LAYER.UI + 3)
  }
  startCount() {
    this.scene.add.tween({
      targets: this.overlay,
      duration: 1000,
      alpha: {
        ease: 'Expo.easeInOut',
        from: 0,
        start: 0,
        to: 1
      },
      onComplete: () => {
        this.scene.add.tween({
          targets: this.countInactiveImages,
          duration: 1000,
          alpha: {
            ease: 'Expo.easeInOut',
            from: 0,
            start: 0,
            to: 1
          },
          // count 3
          onComplete: () => {
            this.scene.add.tween({
              targets: this.countActiveImages[0],
              duration: 1000,
              alpha: {
                ease: 'Expo.easeInOut',
                from: 0,
                start: 0,
                to: 1
              },
              // count 2
              onComplete: () => {
                this.countEmit.emit(Constants.EVENTS.ON_COUNT)
                this.count--;
                this.scene.time.delayedCall(500, () => {
                  this.scene.add.tween({
                    targets: this.countActiveImages[1],
                    duration: 1000,
                    alpha: {
                      ease: 'Expo.easeInOut',
                      from: 0,
                      start: 0,
                      to: 1
                    },
                    // count 1
                    onComplete: () => {
                      this.countEmit.emit(Constants.EVENTS.ON_COUNT)
                      this.count--;
                      this.scene.time.delayedCall(500, () => {
                        this.scene.add.tween({
                          targets: this.countActiveImages[2],
                          duration: 1000,
                          alpha: {
                            ease: 'Expo.easeInOut',
                            from: 0,
                            start: 0,
                            to: 1
                          },
                          onComplete: () => {
                            this.countEmit.emit(Constants.EVENTS.ON_COUNT)
                            this.count--;
                            this.scene.time.delayedCall(1000, () => {
                              this.scene.add.tween({
                                targets: [this.overlay, this.countInactiveContainer, this.countActiveContainer],
                                duration: 1000,
                                alpha: {
                                  ease: 'Expo.easeInOut',
                                  from: 1,
                                  start: 1,
                                  to: 0
                                },
                                onComplete: () => {
                                  // countdown finished
                                  this.countEmit.emit(Constants.EVENTS.FINISH_COUNTDOWN)
                                }
                              })
                            })
                          }
                        })
                      })
                    }
                  })
                })
              }
            })
          }
        })
      }
    })
  }
}
export default CountDownAnimator
