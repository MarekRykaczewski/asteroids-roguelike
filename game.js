const gameWidth = 800;
const gameHeight = 600;
const shipSpeed = 200;

class MainGameScene extends Phaser.Scene {
  preload() {
      this.load.image('player', '/player.png');
  }

  create() {
      this.physics.world.setBounds(0, 0, gameWidth, gameHeight);

      const player = setupPlayer(this)

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

function setupPlayer(scene) {
  const player = scene.physics.add.image(gameWidth / 2, gameHeight / 2, 'player');
  player.setScale(1);
  player.setCollideWorldBounds(true);
  player.setDrag(100);
  return player;
}

const config = {
  type: Phaser.AUTO,
  width: gameWidth,
  height: gameHeight,
  scene: MainGameScene,
  physics: {
      default: 'arcade',
      arcade: {
          gravity: { x: 0, y: 0 },
      },
  },
};

const game = new Phaser.Game(config);