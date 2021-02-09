import Constants from '../config/constants'
import Global from '../config/global'
import { utils }from '../utils/utils'

export default class GlobalScene extends Phaser.Scene {
    global: Global;

    constructor() {
        super({ key: Constants.SCENES.GLOBAL })
    }

    create() {
        this.global = Global.getInstance();
    }

    update() {
        if (utils.isLandscape && !this.scene.isPaused(this.global.currentScene)) {
            this.scene.pause(this.global.currentScene);
            console.log('paused');
        } else if (!utils.isLandscape && this.scene.isPaused(this.global.currentScene)) {
            this.scene.resume(this.global.currentScene);
            console.log('resume');
        }

    }
}