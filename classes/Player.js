export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'player');
    scene.add.existing(this);
    scene.physics.world.enable(this);
    this.setScale(1);
    this.setDrag(100);

    console.log("player created")
  }
}