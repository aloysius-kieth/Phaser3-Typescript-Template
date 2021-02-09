import Constants from '../config/constants'
import Global from '../config/global'
import APICall from '../utils/apiCall';

export default class BootScene extends Phaser.Scene {
    global: Global;
    apicall: APICall;

    constructor() {
        super(Constants.SCENES.BOOT);
    }
    preload() {
        this.load.json('settings', 'assets/json/settings.json');
    }
    create() {
        this.global = new Global();
        let jsonStr = JSON.stringify(this.cache.json.get('settings'));
        let jsonObj = JSON.parse(jsonStr);
        this.global.init(jsonObj, this.sys.game.config.width, this.sys.game.config.height);
        console.log(this.global.settings);

        this.apicall = new APICall(this.global.settings.getAPISettings())

        this.scene.start(Constants.SCENES.PRELOAD);
    }
}