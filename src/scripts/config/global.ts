class Global {
    private static instance: Global;
    userID: string;
    currentScene: string;
    settings: Settings;

    width;
    height;

    constructor() {
        if (!Global.instance) {
            Global.instance = this;
        }
        this.userID = '';
        this.currentScene = '';

        return Global.instance;
    }
    static getInstance(): Global {
        if (!Global.instance) {
            Global.instance = new Global();
        }
        return Global.instance;
    }
    init(_settings, _width, _height) {
        this.settings = new Settings(_settings);
        this.width = _width;
        this.height = _height;
    }
}

class Settings {
    game: object;
    audio: object;
    api: object;

    constructor(data) {
        Object.assign(this, data);

        this.game = data.game;
        this.audio = data.audio;
        this.api = data.api;
    }
    getGameSettings() {
        return this.game;
    }
    getAudioSettings() {
        return this.audio;
    }
    getAPISettings() {
        return this.api;
    }
    getAPI(key) {
        if (this.api.hasOwnProperty(key)) {
            return this.api[key];
        } else {
            console.log(`${key} does not exist`);
        }
    }
    getGame(key) {
        if (this.game.hasOwnProperty(key)) {
            return this.game[key];
        } else {
            console.log(`${key} does not exist`);
        }
    }
    getAudio(key) {
        if (this.audio.hasOwnProperty(key)) {
            return this.audio[key];
        } else {
            console.log(`${key} does not exist`);
        }
    }
}
export default Global