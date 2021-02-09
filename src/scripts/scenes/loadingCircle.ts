import Constants from '../config/constants'

class LoadingCircle extends Phaser.Scene {
    barContainer: Phaser.GameObjects.Container;
    isVisible: boolean = false;

    constructor() {
        super(Constants.SCENES.LOADING_CIRCLE)
    }

    create() {
        this.createLoadingAnimation();
    }

    createLoadingAnimation() {
        this.barContainer = this.add.container(0, 0);
        const radius = 64;
        const height = radius * 0.5;
        const width = 10

        // the center of the loading animation
        //@ts-ignore
        const cx = this.sys.game.config.width / 2;
        //@ts-ignore
        const cy = this.sys.game.config.height / 2;

        // start at top
        let angle = -90

        // create 12 bars each rotated and offset from the center
        for (let i = 0; i < 12; ++i) {
            const { x, y } = Phaser.Math.RotateAround({ x: cx, y: cy - (radius - (height * 0.5)) }, cx, cy, Phaser.Math.DEG_TO_RAD * angle)

            // create each bar with position, rotation, and alpha
            const bar = this.add.rectangle(x, y, width, height, 0xffffff, 1)
                .setAngle(angle)
                .setAlpha(0.2)

            //bars.push(bar)
            this.barContainer.add(bar);

            // increment by 30 degrees for next bar
            angle += 30

            let index: number = 0

            // save created tweens for reuse
            const tweens = []

            // create a looping TimerEvent
            this.time.addEvent({
                delay: 70,
                loop: true,
                callback: () => {
                    // if we already have a tween then reuse it
                    if (index < tweens.length) {
                        const tween = tweens[index]
                        //@ts-ignore
                        tween.restart()
                    }
                    else {
                        // make a new tween for the current bar
                        const bar = this.barContainer.getAt(index);
                        const tween = this.tweens.add({
                            targets: bar,
                            alpha: 0.2,
                            duration: 400,
                            onStart: () => {
                                //@ts-ignore
                                bar.alpha = 1
                            }
                        })

                        //@ts-ignore
                        tweens.push(tween)
                    }

                    // increment and wrap around
                    ++index

                    if (index >= this.barContainer.length) {
                        index = 0
                    }
                }
            })
        }
        this.scene.setVisible(false);
    }
    test() {
        console.log('test');
    }
}
export default LoadingCircle