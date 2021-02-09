import APICall from '../utils/apiCall'
import Global from '../config/global'
import { Constants, AudioManager } from '../config/modules';
//import d from '../utils/debugLog'

export default class Base extends Phaser.Scene {
    AUDIO = {
        bgm: 'bgm',
        buttonclick: 'buttonclick',
        gameover: 'gameover',
        explode: 'explode',
        cone: 'cone',
        coin1: 'coin1',
        coin2: 'coin2',
        coin3: 'coin3',
        coin4: 'coin4',
        countBeep: 'countdownBeep',
        countFinish: 'countdownFinish',
    }

    width;
    height;

    p_scene: string;

    global: Global;
    apicall: APICall;
    audioManager: AudioManager;

    constructor(scene: string) {
        super(scene);
        this.p_scene = scene;
    }
    preload() {
        this.global = Global.getInstance();
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;

        this.global.currentScene = this.p_scene;
        console.log(this.global.currentScene);

        this.apicall = APICall.getInstance();

    }
    create() {
        this.audioManager = AudioManager.getInstance();
    }
    showLoadingCircle() {
      this.scene.get(Constants.SCENES.LOADING_CIRCLE).scene
        .setVisible(!this.scene.isVisible(Constants.SCENES.LOADING_CIRCLE));
    }
}