import constants from '../config/constants'

class RotatingRays extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'rays')
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setScale(0.8, 0.8);
        this.setDepth(constants.SORTING_LAYER.GAME - 1)
    }
    update(time, delta) {
        this.angle += 0.1 * delta;
    }
}

class FallingObject extends Phaser.Physics.Arcade.Sprite {
    speed: number;
    ray: RotatingRays;

    constructor(scene, x, y) {
        super(scene, x, y, '')
        this.scene = scene;

        this.speed = 0;
        this.depth = constants.SORTING_LAYER.GAME;
    }
    spawn(x, y, texture) {
        this.setTexture(texture);
        if (texture != 'poison') {
            this.ray = new RotatingRays(this.scene, this.x, this.y)
        }

        // @ts-ignore
        this.body.syncBounds = true;

        this.setPosition(x, y);
        this.setActive(true);
        this.setVisible(true);
    }
    update(time, delta) {
        if (this.active && this.visible) {
            if (this.ray != null) {
                this.ray.update(time, delta);
                this.ray.setPosition(this.x, this.y);
            }
            this.y += this.speed * delta;
            // if (this.y > this.scene.height) {
            //     this.visible = false
            //     this.active = false
            //     //this.destroy()
            // }
        }
    }
    kill() {
        if (this.ray != null) {
            this.ray.destroy();
        }
        this.destroy();
    }
}

export default FallingObject