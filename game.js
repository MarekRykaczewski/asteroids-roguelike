import Enemy from './classes/Enemy.js';
import Player from './classes/Player.js';

const gameWidth = 800;
const gameHeight = 600;
const shipSpeed = 200;
const projectileSpeed = 500;
const fireRate = 300; // Fire rate in milliseconds

class MainGameScene extends Phaser.Scene {
  preload() {
    this.load.image('player', '/player.png');
    this.load.image('projectile', '/projectile.png');
    this.load.image('enemy', '/enemy.png');
  }

  create() {
    this.physics.world.setBounds(0, 0, gameWidth, gameHeight);
    this.input.mouse.disableContextMenu();

    // Create an instance of the Player class and pass 'this'
    const player = new Player(this, gameWidth / 2, gameHeight / 2);

    const projectiles = this.physics.add.group(); // Group to manage projectiles
    const enemies = this.physics.add.group(); // Group to manage enemies

    // Variables to track mouse button states
    let isMouseLeftDown = false;
    let isMouseRightDown = false;
    let lastShotTime = 0;

    // Handle mouse state changes
    this.input.on('pointerdown', (pointer) => {
      if (pointer.leftButtonDown()) {
        isMouseLeftDown = true;
      }
      if (pointer.rightButtonDown()) {
        isMouseRightDown = true;
      }
    });

    this.input.on('pointerup', (pointer) => {
      if (!pointer.leftButtonDown()) {
        isMouseLeftDown = false;
      }
      if (!pointer.rightButtonDown()) {
        isMouseRightDown = false;
      }
    });

    this.input.on('pointermove', (pointer) => {
      // Calculate the angle between the ship and the cursor
      const angle = Phaser.Math.Angle.Between(player.x, player.y, pointer.x, pointer.y);

      // Set the ship's rotation to face the cursor with the top of the image as front
      player.rotation = angle + Math.PI / 2; // Add 90 degrees (PI/2 radians)
    });

    // Create a timer to spawn enemies every 3 seconds
    this.enemySpawnTimer = this.time.addEvent({
      delay: 3000,
      callback: () => {
        const enemyX = Phaser.Math.Between(0, gameWidth);
        const enemyY = Phaser.Math.Between(0, gameHeight);
        const enemy = new Enemy(this, enemyX, enemyY);
        enemies.add(enemy);
      },
      loop: true,
    });

    this.update = (time) => {
      // Apply acceleration
      if (isMouseLeftDown) {
        // Move the player ship towards the pointer's location
        this.physics.moveTo(player, this.input.x, this.input.y, shipSpeed);
      }

      if (isMouseRightDown && time - lastShotTime > fireRate) {
        fireProjectile(player, projectiles);
        lastShotTime = time;
      }

      // Check if the player has gone out of bounds
      if (player.x < 0) {
        player.x = gameWidth; // Wrap to the right side
      } else if (player.x > gameWidth) {
        player.x = 0; // Wrap to the left side
      }

      if (player.y < 0) {
        player.y = gameHeight; // Wrap to the bottom
      } else if (player.y > gameHeight) {
        player.y = 0; // Wrap to the top
      }

      enemies.children.iterate((enemy) => {
        enemy.update();
      });
    };
  }
}

function fireProjectile(player, projectiles) {
  const projectile = projectiles.create(player.x, player.y, 'projectile');
  const angle = player.rotation - Math.PI / 2;
  const velocityX = Math.cos(angle) * projectileSpeed;
  const velocityY = Math.sin(angle) * projectileSpeed;
  projectile.setScale(0.1);
  projectile.setVelocity(velocityX, velocityY);
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
