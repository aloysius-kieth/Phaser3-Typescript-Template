import constants from "../config/constants";

// Basic GUI buttons on screen (mobile)
export default class GUIControls extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture)
        scene.add.existing(this)
        this.init();
    }
    init(){
        this.setDepth(constants.SORTING_LAYER.UI);
        this.setInteractive();
    }
    onPointerDown(callback) {
        this.on(Phaser.Input.Events.POINTER_DOWN, (pointer)=>{
            callback();
        })
    }
    onPointerUp(callback) {
        this.on(Phaser.Input.Events.POINTER_UP, (pointer)=>{
            callback();
        })
    }
}