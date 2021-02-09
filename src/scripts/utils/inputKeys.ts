class InputKeys extends Phaser.Input.InputPlugin {
    KEY_SPACE: Phaser.Input.Keyboard.Key;
    RIGHT_ARROW: Phaser.Input.Keyboard.Key;
    LEFT_ARROW: Phaser.Input.Keyboard.Key;

    constructor(scene){
        super(scene)
        this.scene = scene

        this.init()
    }
    init(){
        this.KEY_SPACE = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
        this.RIGHT_ARROW = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)
        this.LEFT_ARROW = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
    }
}
export default InputKeys