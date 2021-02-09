class Spawner {
    scene: Phaser.Scene;
    x: number;
    y: number;
    emitter: Phaser.Events.EventEmitter;
    timer: Phaser.Time.TimerEvent;

    constructor(scene, y) {
        this.scene = scene;
        this.y = y;
        this.emitter = new Phaser.Events.EventEmitter()
    }
    startSpawn() {
        this.timer = this.scene.time.addEvent({
            delay: 1000,
            callback: this.onSpawn,
            callbackScope: this,
            loop: true,
        })
    }
    stopSpawn() {
        if (this.timer != null) {
            this.timer.paused = true;
        }
    }
    onSpawn() {
        if (this.timer != null) {
            //@ts-ignore
            this.timer.delay = Phaser.Math.Between(this.scene.gameSettings.spawnRate, this.scene.gameSettings.maxSpawnRate);
            //@ts-ignore
            //console.log(this.scene.gameSettings.spawnRate)
            this.emitter.emit('onSpawned');
            //console.log(this.timer.delay);
        }
    }
    randomizePosition(offset) {
        //@ts-ignore
        this.x = Phaser.Math.FloatBetween(offset, this.scene.width - offset);
    }
}
export default Spawner