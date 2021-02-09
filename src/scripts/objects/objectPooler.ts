export default class ObjectPooler extends Phaser.Physics.Arcade.Group {
    constructor(scene, type, size) {
        super(scene.physics.world, scene)
        this.scene = scene

        this.classType = type
        this.maxSize = size
        this.setVisible(false)
        this.setActive(false)
        //this.runChildUpdate = true
    }
    update(time, delta) {
        if (this.getChildren().length > 0) {
            this.getChildren().forEach((e) => {
                //e.update(time, delta)

                //@ts-ignore
                if (e.body.position.y > this.scene.height) {
                    //@ts-ignore
                    e.kill();
                }
            })
        }
    }
}