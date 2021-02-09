import constants from '../config/constants'

const INITIAL_FONTSIZE = 28

class ScoreText extends Phaser.GameObjects.Text {
  constructor(scene, x, y, config) {
    super(scene, x, y, '0', config)
    scene.add.existing(this)
    this.setFontSize(INITIAL_FONTSIZE)
    this.setOrigin(0.5)
    this.setDepth(constants.SORTING_LAYER.UI + 1)
  }
}

class ScoreManager {
  private static instance: ScoreManager
  scene: Phaser.Scene
  scoreText: ScoreText
  score: number = 0
  fontSize
  currentStrLength: number = 0
  scorebox: Phaser.GameObjects.Image

  constructor(scene, x, y, config) {
    this.scene = scene

    if (!ScoreManager.instance) {
      ScoreManager.instance = this
    }

    this.scoreText = new ScoreText(this.scene, x, y, config)
    this.initialize()

    return ScoreManager.instance
  }
  static getInstance(scene = null, x = 0, y = 0, config = null): ScoreManager {
    if (!ScoreManager.instance) {
      ScoreManager.instance = new ScoreManager(scene, x, y, config)
    }
    return ScoreManager.instance
  }
  initialize() {
    this.score = 0
    this.scoreText.text = this.score.toString()
    this.fontSize = INITIAL_FONTSIZE
    this.currentStrLength = this.scoreText.text.length
  }

  getScore() {
    return this.score
  }

  addScore(amt) {
    this.score += amt
    this.scoreText.setText(this.score.toString())
    if (this.scoreText.text.length > 3) {
      if (this.scoreText.text.length > this.currentStrLength) {
        this.currentStrLength = this.scoreText.text.length
        this.scoreText.setFontSize(this.fontSize * 0.8)
      }
    }
  }

  addScorebox(x, y) {
    this.scorebox = this.scene.add.image(0, 0, 'scoreBox')
    this.scorebox.x = x
    this.scorebox.y = y
    // this.scorebox.x = width / 2 - roadBackground.displayWidth / 2.3
    // this.scorebox.y = height / 2 - roadBackground.displayHeight / 2.7

    Phaser.Display.Align.In.Center(this.scoreText, this.scorebox, -13, -25)
    this.scorebox.setDepth(constants.SORTING_LAYER.UI)
  }
}

export default ScoreManager
