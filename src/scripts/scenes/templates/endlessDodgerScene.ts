import PinholeSceneBase from '../../transitions/pinholeSceneBase'
import InputKeys from '../../utils/inputKeys'

import Player from '../../objects/player'
import GUIControls from '../../objects/guiControls'
import Heart from '../../objects/heart'

import { Constants, utils, AudioManager, FpsText, AudioConfig, AnimationKeys } from '../../config/modules'
import CountDownAnimator from '../../objects/countDownAnimator'
import GameTimer from '../../objects/gameTimer'
import Spawner from '../../objects/spawner'
import ObjectPooler from '../../objects/objectPooler'
import Scoreable from '../../objects/scoreable'
import Obstacle from '../../objects/obstacle'
import ScoreManager from '../../managers/scoreManager'

// list of products
var objectsFallingList = [
    { obj: 'p1' },
    { obj: 'p2' },
    { obj: 'p3' },
    { obj: 'p4' },
    { obj: 'p5' },
    { obj: 'p6' },
    { obj: 'p7' },
    { obj: 'p8' },
    { obj: 'p9' }
]

export default class EndlessDodgerScene extends PinholeSceneBase {
    fpsText: Phaser.GameObjects.Text
    inputKeys: InputKeys
    scoreManager: ScoreManager

    player: Player
    hearts: Heart[] = [];

    leftArrowBtn: GUIControls
    rightArrowBtn: GUIControls
    leftArrowInput: Phaser.Input.Keyboard.Key
    rightArrowInput: Phaser.Input.Keyboard.Key

    countdown: CountDownAnimator
    gameTimer: GameTimer

    scoreablesGrp: ObjectPooler
    obstacleGrp: ObjectPooler
    scoreableSpawner: Spawner
    obstacleSpawner: Spawner

    lastTime: number = 0;

    gameSettings = {
        pointPerProduct: 0,
        spawnRate: 0,
        maxSpawnRate: 0,
        spawnFactor: 0,
        timeToIncreaseDifficulty: 0,
    }

    constructor() {
        super(Constants.SCENES.MAIN);
    }

    preload() {
        super.preload();

        this.showLoadingCircle();

        this.load.image('gameBackground', 'assets/img/game/gameBackground.png');
        this.load.image('button', 'assets/img/game/button.png');
        this.load.image('poison', 'assets/img/game/poison.png');
        this.load.image('scoreBox', 'assets/img/game/scoreBox.png');
        this.load.image('timerBox', 'assets/img/game/timerBox.png');
        this.load.image('life-filled', 'assets/img/game/life-filled.png');
        this.load.image('life-empty', 'assets/img/game/life-empty.png');
        this.load.image('overlay', 'assets/img/overlay.png');
        this.load.image('1_inactive', 'assets/img/game/1_inactive.png');
        this.load.image('1_active', 'assets/img/game/1_active.png');
        this.load.image('2_inactive', 'assets/img/game/2_inactive.png');
        this.load.image('2_active', 'assets/img/game/2_active.png');
        this.load.image('3_inactive', 'assets/img/game/3_inactive.png');
        this.load.image('3_active', 'assets/img/game/3_active.png');
        this.load.image('rays', 'assets/img/game/rays.png');

        this.load.image('poison', 'assets/img/game/poison.png');
        this.load.image('p1', 'assets/img/game/products/p1.png');
        this.load.image('p2', 'assets/img/game/products/p2.png');
        this.load.image('p3', 'assets/img/game/products/p3.png');
        this.load.image('p4', 'assets/img/game/products/p4.png');
        this.load.image('p5', 'assets/img/game/products/p5.png');
        this.load.image('p6', 'assets/img/game/products/p6.png');
        this.load.image('p7', 'assets/img/game/products/p7.png');
        this.load.image('p8', 'assets/img/game/products/p8.png');
        this.load.image('p9', 'assets/img/game/products/p9.png');

        //#region Load Atlas 
        this.load.atlas(AnimationKeys.CALVIN.IDLE, 'assets/atlas/calvin_idle.png', 'assets/atlas/calvin_idle.json');
        this.load.atlas(AnimationKeys.CALVIN.RUNLOOP, 'assets/atlas/calvin_runLoop.png', 'assets/atlas/calvin_runLoop.json');
        this.load.atlas(AnimationKeys.CALVIN.IDLETORUN, 'assets/atlas/calvin_idleToRun.png', 'assets/atlas/calvin_idleToRun.json');
        this.load.atlas(AnimationKeys.CALVIN.POISONHIT, 'assets/atlas/calvin_poisonHit.png', 'assets/atlas/calvin_poisonHit.json');
        this.load.atlas(AnimationKeys.CALVIN.ITEMCOLLECT, 'assets/atlas/calvin_itemCollectGlow.png', 'assets/atlas/calvin_itemCollectGlow.json');
        this.load.atlas(AnimationKeys.CALVIN.DEATH, 'assets/atlas/calvin_death.png', 'assets/atlas/calvin_death.json');


        this.load.on(Phaser.Loader.Events.PROGRESS, this.onProgress, this);
        this.load.on(Phaser.Loader.Events.COMPLETE, () => {
            this.showLoadingCircle();
        }, this)

        this.cameras.main.setBackgroundColor(0x000000);
        //#endregion
    }

    onProgress(value) {
        //console.log(value);
    }

    create() {
        super.create();
        this.inputKeys = new InputKeys(this);

        this.initSettings();

        this.scoreManager = new ScoreManager(this, 0, 0, {
            fill: '#FDCA04',
            fontFamily: 'Merck'
        });
        var scoreBoxWidth = this.textures.get('scoreBox').getSourceImage().width;
        var scoreBoxHeight = this.textures.get('scoreBox').getSourceImage().height;
        this.scoreManager.addScorebox(this.width - scoreBoxWidth / 2, scoreBoxHeight / 1.8);

        // add background
        var bg = this.add.sprite(0, 0, 'gameBackground');
        bg.displayWidth = this.width;
        bg.displayHeight = this.height;
        bg.setOrigin(0);

        this.countdown = new CountDownAnimator(this);

        this.addGameTimer();
        this.addPlayer();
        if (!utils.CheckDesktopBrowser()) {
            this.addGUIControls();
        }

        // add objectPoolers
        this.scoreablesGrp = new ObjectPooler(this, Scoreable, Constants.GAME.SCOREABLES_POOL_SIZE);
        this.obstacleGrp = new ObjectPooler(this, Obstacle, Constants.GAME.OBSTACLE_POOL_SIZE);

        // add spawners
        this.scoreableSpawner = new Spawner(this, -50);
        this.obstacleSpawner = new Spawner(this, -50);

        //this.fpsText = new FpsText(this)

        this.addCollisions();
        this.initEventEmitters();
        this.leftArrowInput = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.rightArrowInput = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        this.events.on(Phaser.Scenes.Events.CREATE, () => {
            this.time.delayedCall(4000, () => {
                this.time.delayedCall(1250, () => {
                    this.countdown.startCount();
                })
            })
        })
    }

    initSettings() {
        this.gameSettings.timeToIncreaseDifficulty = this.global.settings.getGame('timeToIncreaseDifficulty');
        this.gameSettings.pointPerProduct = this.global.settings.getGame('pointsPerProduct');
        this.gameSettings.maxSpawnRate = this.global.settings.getGame('maxSpawnRate');
        this.gameSettings.spawnRate = this.global.settings.getGame('spawnRate');
        this.gameSettings.spawnFactor = this.global.settings.getGame('spawnFactor');
    }

    initEventEmitters() {
        this.gameTimer.emitter.on(Constants.EVENTS.ON_START, this.onGamestart, this);
        this.gameTimer.emitter.on(Constants.EVENTS.ON_GAMEOVER, this.onGameover, this);
        this.countdown.countEmit.on(Constants.EVENTS.ON_COUNT, this.onCountdown, this);
        this.countdown.countEmit.on(Constants.EVENTS.FINISH_COUNTDOWN, this.onCountdownFinished, this);
        this.scoreableSpawner.emitter.on('onSpawned', this.onScoreableSpawned, this);
        this.obstacleSpawner.emitter.on('onSpawned', this.onObstacleSpawned, this);
    }

    addGameTimer() {
        var config = {
            fontSize: '26px',
            fill: '#532F91',
            fontFamily: 'Merck'
        }
        this.gameTimer = new GameTimer(
            {
                scene: this,
                x: this.width / 1.85,
                y: this.textures.get('timerBox').getSourceImage().height / 2,
                texture: 'timerBox'
            },
            '00:00',
            config
        );
        this.gameTimer.timerText.setPadding(0, 0, 33, 35);
    }

    addCollisions() {
        this.physics.add.collider(this.player, this.scoreablesGrp, this.onScoreablesCollidePlayer, undefined, this);
        this.physics.add.collider(this.player, this.obstacleGrp, this.onObstaclesCollidePlayer, undefined, this);
    }

    updateGameTimer() {
        let elapsedTime = this.gameTimer.timer.getElapsedSeconds();
        let minutes: any = Math.floor(elapsedTime / 60);
        let seconds: any = Math.floor(elapsedTime - minutes * 60);
        // let fraction = elapsedTime * 1000
        // fraction = (fraction % 1000)
        if (minutes < 10) {
            minutes = '0' + minutes;
        }
        if (seconds < 10) {
            seconds = '0' + seconds;
        }

        this.gameTimer.timerText.text = minutes.toString() + ':' + seconds.toString();
    }

    addPlayer() {
        // Init player
        this.player = new Player(this, this.width / 2, 0);
        this.player.y = this.height - this.player.displayHeight / 2;

        // Init player's healthbar
        var heartWidth = this.textures.get('life-filled').getSourceImage().width;
        var heartHeight = this.textures.get('life-filled').getSourceImage().height;
        for (var i = 0; i < Constants.GAME.MAX_LIVES; i++) {
            var heart = new Heart({
                scene: this,
                x: heartWidth / 0.9
            });
            this.hearts.push(heart)
        }

        for (var i = 0; i < this.hearts.length; i++) {
            var h = this.hearts[i]
            h.y += i * heartHeight * 1.1
        }
    }
    addGUIControls() {
        this.leftArrowBtn = new GUIControls(this, 0, 0, 'button');
        this.leftArrowBtn.flipX = true;
        this.leftArrowBtn.setPosition(
            (this.leftArrowBtn.x = this.leftArrowBtn.displayWidth / 2),
            (this.leftArrowBtn.y = this.height - this.leftArrowBtn.displayWidth / 1.2)
        );
        this.leftArrowBtn.onPointerDown(() => {
            this.player.isMovingLeft = true
            this.player.isMovingRight = false
        });
        this.leftArrowBtn.onPointerUp(() => {
            this.player.isMovingLeft = this.player.isMovingRight = false
        });
        this.rightArrowBtn = new GUIControls(this, 0, 0, 'button')
        this.rightArrowBtn.setPosition(
            this.width - this.rightArrowBtn.displayWidth / 2,
            this.height - this.rightArrowBtn.displayWidth / 1.2
        );
        this.rightArrowBtn.onPointerDown(() => {
            this.player.isMovingLeft = false
            this.player.isMovingRight = true
        });
        this.rightArrowBtn.onPointerUp(() => {
            this.player.isMovingLeft = this.player.isMovingRight = false
        });
    }

    // Update Func
    update(time, delta) {
        if (this.gameTimer.gameOver) return;

        if (this.gameTimer.timer) {
            this.updateGameTimer();
        }

        if (this.player) {
            this.player.update(time, delta);
        }

        this.scoreablesGrp.update(time, delta);
        this.scoreablesGrp.getChildren().forEach((e) => {
            e.update(time, delta);
        })
        this.obstacleGrp.update(time, delta);
        this.obstacleGrp.getChildren().forEach((e) => {
            e.update(time, delta);
        })

        if (utils.CheckDesktopBrowser()) {
            if (this.leftArrowInput.isDown) {
                this.player.isMovingLeft = true;
                this.player.isMovingRight = false;
            } else {
                this.player.isMovingLeft = false;
            }
            if (this.rightArrowInput.isDown) {
                this.player.isMovingLeft = false;
                this.player.isMovingRight = true;
            } else {
                this.player.isMovingRight = false;
            }
        }
        // if (Phaser.Input.Keyboard.JustDown(this.inputKeys.KEY_SPACE)) {
        //   this.showLoadingCircle();
        // }

        //this.fpsText.update();
    }

    //#region On Countdown Events
    onCountdown() {
        switch (this.countdown.count) {
            case 3:
                this.audioManager.playSFX(AudioConfig.SFX.COUNT3.KEY);
                break;
            case 2:
                this.audioManager.playSFX(AudioConfig.SFX.COUNT2.KEY);
                break;
            case 1:
                this.audioManager.playSFX(AudioConfig.SFX.COUNT1.KEY);
                break;
        }
    }

    onCountdownFinished() {
        this.audioManager.fadeInMusic(this, AudioConfig.MUSIC.IDLE_MUSIC.KEY, this.global.settings.getAudio('musicVolume'), 2500);
        this.scoreableSpawner.startSpawn();
        this.obstacleSpawner.startSpawn();
        this.gameTimer.startClock();
    }
    //#endregion

    //#region On Game Start/Over Events
    onGamestart(gameStarted) {
        this.gameTimer.gameOver = gameStarted;
    }

    onGameover() {
        //this.audioManager.stopMusic(AudioConfig.MUSIC.IDLE_MUSIC.KEY);
        this.audioManager.stopMusic(AudioConfig.MUSIC.IDLE_MUSIC.KEY);
        this.audioManager.playSFXCallback(AudioConfig.SFX.DEATH.KEY, () => {
            this.audioManager.playSFXCallback(AudioConfig.SFX.GAME_OVER.KEY, () => {
                this.gotoResultpage();
            })
        });

    }
    //#endregion

    gotoResultpage() {
        utils.SetSessionStorageItem(Constants.SESSION_STORAGE.GAME_SCORE, this.scoreManager.getScore());
        utils.SetSessionStorageItem(Constants.SESSION_STORAGE.GAME_TIMER, this.gameTimer.getElapsedTime());
        utils.SetSessionStorageItem(Constants.SESSION_STORAGE.GAME_TIMER_FORMATTED, this.gameTimer.timerText.text);

        this.scene.transition({
            duration: 2500,
            target: Constants.SCENES.RESULT
        });
    }

    //#region On Collide Events
    onScoreablesCollidePlayer(player, scoreable) {
        player.playGlow();
        //player.itemCollected = true;
        scoreable.playSound();
        scoreable.kill();
        this.scoreManager.addScore(this.gameSettings.pointPerProduct);
    }

    onObstaclesCollidePlayer(player, obstacle) {
        if (player.invunerable || player.blink) return;

        obstacle.playSound();
        obstacle.destroy();
        player.lives--;
        for (var i = this.hearts.length; i >= 0; i--) {
            if (player.lives == i) {
                this.hearts[i].onHurt();
            }
        }

        if (player.lives <= 0) {
            this.gameTimer.stopClock();
            this.scoreableSpawner.stopSpawn();
            this.obstacleSpawner.stopSpawn();

            player.playAnimation(AnimationKeys.CALVIN.DEATH, () => { });
        } else {
            player.hurtBlink();
        }
    }
    //#endregion

    //#region On Spawn Events
    onScoreableSpawned() {
        // random object type to spawn
        var index = Phaser.Math.Between(0, objectsFallingList.length - 1);
        var obj = objectsFallingList[index].obj;

        // create instance of it
        var objectToFall = this.scoreablesGrp.get();
        if (objectToFall != null) {
            // random position to spawn
            this.scoreableSpawner.randomizePosition(objectToFall.displayWidth);
            // set it to drop
            objectToFall.spawn(this.scoreableSpawner.x, this.scoreableSpawner.y, obj);
            objectToFall.speed = Phaser.Math.GetSpeed(300, 1);
        }
    }

    onObstacleSpawned() {
        // create instance of it
        var objectToFall = this.obstacleGrp.get();
        if (objectToFall != null) {
            // random position to spawn
            this.obstacleSpawner.randomizePosition(objectToFall.displayWidth);
            // set it to drop
            objectToFall.spawn(this.obstacleSpawner.x, this.obstacleSpawner.y, 'poison');
            objectToFall.speed = Phaser.Math.GetSpeed(400, 1);
        }
    }
    //#endregion
}
