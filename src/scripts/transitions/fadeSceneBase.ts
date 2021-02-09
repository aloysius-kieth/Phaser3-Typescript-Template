import BaseScene from '../scenes/baseScene'

export default class FadeSceneBase extends BaseScene {

    duration: number = 1000;

    create() {
        super.create();
        // fade to black instantly if not from scene transition
        this.cameras.main.fadeOut(1, 0, 0, 0)


        this.cameras.main.on(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
            // when camera fades out completed
        })
        this.cameras.main.on(Phaser.Cameras.Scene2D.Events.FADE_OUT_START, (cam, effect) => {
            // when camera fades out start
        })

        this.cameras.main.on(Phaser.Cameras.Scene2D.Events.FADE_IN_COMPLETE, (cam, effect) => {
            // when camera fades in completed
        })

        this.cameras.main.on(Phaser.Cameras.Scene2D.Events.FADE_IN_START, (cam, effect) => {
            // when camera fades in start
        })

        // Upon create method run, fade in from black
        this.events.on(Phaser.Scenes.Events.CREATE, () => {
            this.time.delayedCall(2000, () => {
                this.cameras.main.fadeIn(this.duration, 0, 0, 0);
            })
        });

        // fade to black if from scene transition
        this.events.once(Phaser.Scenes.Events.TRANSITION_START, () => {
            this.cameras.main.fadeOut(this.duration, 0, 0, 0)
        });
    }
}