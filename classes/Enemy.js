export default class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'enemy');
    scene.add.existing(this);
    scene.physics.world.enable(this);
    this.setScale(0.3); 
    this.setCollideWorldBounds(true);
  }

  update() {

  }
}
