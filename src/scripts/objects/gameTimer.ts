import constants from '../config/constants'

class TimerText extends Phaser.GameObjects.Text {
    constructor(scene, x, y, startTime, config) {
        super(scene, x, y, startTime, config)
        scene.add.existing(this)

        this.setOrigin(0.5)
        this.setDepth(constants.SORTING_LAYER.UI)
    }
}

export default class GameTimer extends Phaser.GameObjects.Image {
    count: number;
    countUp: boolean;
    gameOver: boolean;
    timerText: TimerText;
    emitter: Phaser.Events.EventEmitter;
    timer: Phaser.Time.TimerEvent;
    difficultyTimer: Phaser.Time.TimerEvent;

    constructor(config, startTime, textConfig) {
        super(config.scene, config.x, config.y, config.texture)
        config.scene.add.existing(this)
        this.scene = config.scene

        this.setDepth(constants.SORTING_LAYER.UI)

        this.count = 0
        this.countUp = true
        this.gameOver = true

        this.timerText = new TimerText(config.scene, 0, 0, startTime, textConfig)

        Phaser.Display.Align.In.Center(this.timerText, this)
        this.emitter = new Phaser.Events.EventEmitter()
    }
    startClock() {
        this.timer = this.scene.time.addEvent({
            delay: Phaser.Math.MAX_SAFE_INTEGER,
            // @ts-ignore
            callback: this.onStartClock(),
            callbackScope: this,
            loop: true
        })

        this.difficultyTimer = this.scene.time.addEvent({
            //@ts-ignore
            delay: this.scene.gameSettings.timeToIncreaseDifficulty,
            // @ts-ignore
            callback: () => {
                //@ts-ignore
                // max spawn rate difficulty acheived
                if (this.scene.gameSettings.spawnRate <= this.scene.gameSettings.maxSpawnRate) {
                    return;
                }
                //@ts-ignore
                this.scene.gameSettings.spawnRate -= this.scene.gameSettings.spawnFactor;
                //@ts-ignore
                //console.log(this.scene.gameSettings.spawnRate)
            },
            callbackScope: this,
            loop: true
        })
    }
    onStartClock() {
        this.emitter.emit(constants.EVENTS.ON_START, false)
    }
    stopClock() {
        this.timer.paused = true
        this.difficultyTimer.paused = true;
        this.gameOver = true
        this.emitter.emit(constants.EVENTS.ON_GAMEOVER, true)
        // this.timer.remove()
    }
    getElapsedTime() {
        return this.timer.elapsed.toFixed()
    }
}