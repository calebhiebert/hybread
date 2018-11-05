/**
 * BreadHunt.scene.ts
 *
 * This file contains the minigame BreadHunt
 */
import * as Phaser from 'phaser';
import { BreadHuntBread } from './minigames/bread-hunt/bread';
import { BreadHuntScoreText } from './minigames/bread-hunt/bread-score';

export class BreadHuntScene extends Phaser.Scene {
  private _breadPool: BreadHuntBread[];

  // TODO remove texts from this array after they are destroyed to avoid extra update calls
  private _texts: BreadHuntScoreText[];

  constructor() {
    super({
      key: 'bread-hunt',
    });

    this._breadPool = [];
    this._texts = [];
  }

  create(): void {
    // Spawn new breads on an interval
    setInterval(() => {
      const bread = this.getBread();

      // Set the bread's x position somewhere along the screen width
      bread.x = this.getRandomBetween(
        (this.game.config.width as number) * 0.1,
        (this.game.config.width as number) * 0.9
      );

      // Apply a randomized force
      bread.applyForce(
        this.getRandomBetween(-750, 750),
        this.getRandomBetween(-1500, -2000)
      );
    }, 750);

    this.input.setDefaultCursor(
      'url("assets/crosshair040.png") 36 36, pointer'
    );
  }

  update(time, delta) {
    this._texts.forEach((t) => t.update(delta));
  }

  /**
   * Returns a bread from the pool, or creates one
   */
  private getBread(): BreadHuntBread {
    if (this._breadPool.length > 2) {
      this._breadPool.pop();
    }

    if (this._breadPool.length === 0) {
      const bread = new BreadHuntBread({
        scene: this,
        x: (this.game.config.width as number) / 2,
        y: this.game.config.height as number,
        physics: {
          gravity: -2560,
          drag: 60,
          angularDrag: 0.1,
        },
      });

      bread.setInteractive();

      bread.on('pointerdown', () => {
        const scoreText = new BreadHuntScoreText(
          this,
          bread.getPointsValue(),
          bread.x,
          bread.y,
          150,
          0.75
        );

        this._texts.push(scoreText);

        bread.setActive(false);
        bread.x = bread.y = -100;
        this._breadPool.push(bread);
      });

      bread.on('out-of-bounds', () => {
        bread.setActive(false);
        this._breadPool.push(bread);
      });

      bread.setActive(true);

      return bread;
    } else {
      const bread = this._breadPool.pop();

      bread.x = (this.game.config.width as number) / 2;
      bread.y = this.game.config.height as number;
      bread.resetVelocity();

      bread.setActive(true);

      return bread;
    }
  }

  /**
   * Returns a random number between two numbers
   * @param min minimum number
   * @param max maximum number
   */
  private getRandomBetween(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}
