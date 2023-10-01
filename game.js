class MainGameScene extends Phaser.Scene {
  preload() {
      this.load.image('player', '/player.png');
  }

  create() {
      this.physics.world.setBounds(0, 0, 800, 600);

      const player = this.physics.add.image(400, 300, 'player');
      player.setScale(1);
      player.setDrag(100);

      // Define the ship's movement speed
      const shipSpeed = 200;

      // Variable to track if the left mouse button is currently down
      let isMouseDown = false;

      // Handle player ship movement
      this.input.on('pointerdown', () => {
          isMouseDown = true;
      });

      this.input.on('pointerup', () => {
          isMouseDown = false;
      });

      this.input.on('pointermove', (pointer) => {
          // Calculate the angle between the ship and the cursor
          const angle = Phaser.Math.Angle.Between(player.x, player.y, pointer.x, pointer.y);

          // Set the ship's rotation to face the cursor with the top of the image as front
          player.rotation = angle + Math.PI / 2; // Add 90 degrees (PI/2 radians)
      });


      this.update = () => {
          // Apply acceleration
          if (isMouseDown) {
              // Move the player ship towards the pointer's location
              this.physics.moveTo(player, this.input.x, this.input.y, shipSpeed);
          }

          // Check if the player has gone out of bounds
          if (player.x < 0) {
              player.x = 800; // Wrap to the right side
          } else if (player.x > 800) {
              player.x = 0; // Wrap to the left side
          }

          if (player.y < 0) {
              player.y = 600; // Wrap to the bottom
          } else if (player.y > 600) {
              player.y = 0; // Wrap to the top
          }          
      };
  }
}

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: MainGameScene,
  physics: {
      default: 'arcade',
      arcade: {
          gravity: { x: 0, y: 0 },
      },
  },
};

const game = new Phaser.Game(config);