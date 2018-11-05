/**
 * bread.ts
 *
 * This file contains the logic for the bread hunt bread objects
 */
import * as Phaser from 'phaser';

export class BreadHuntBread extends Phaser.GameObjects.Sprite {
  // Velocity (pixels per second moved)
  private _xVelocity = 0;
  private _yVelocity = 0;
  // Angular Velocity is in degrees per second
  private _angularVelocity = 0;

  // Amount taken away from x and y velocity per second
  private _drag: number;

  // Amount taken away from the angular velocity per second
  private _angularDrag: number;

  // Amount subtracted from the y velocity per second
  private _gravity: number;

  constructor(config: IBreadHuntBreadConfig) {
    super(config.scene, config.x, config.y, 'bread');

    this._drag = config.physics.drag;
    this._angularDrag = config.physics.angularDrag;
    this._gravity = config.physics.gravity;

    this.setScale(0.4, 0.4);

    config.scene.add.existing(this);
  }

  /**
   * Sets the current bread velocity
   * @param x x velocity in pixels per second
   * @param y y velocity in pixels per second
   */
  public applyForce(x: number, y: number): void {
    this._xVelocity = x;
    this._yVelocity = y;
  }

  /**
   * Sets the current bread velocity to 0
   */
  public resetVelocity(): void {
    this._xVelocity = this._yVelocity = 0;
  }

  /**
   * Returns the number of points this bread is worth
   *
   * TODO: Edit the points value to mean something more valuable in context
   */
  public getPointsValue(): number {
    // Have a small chacne of high points
    if (Math.random() > 0.95) {
      return 250;
    }

    return Math.round(Math.random() * 100);
  }

  public preUpdate(time, delta): void {
    // Convert the delta into seconds (phaser's delta is in milliseconds)
    const d = delta / 1000;

    // Apply movement based on the velocity
    this.x += this._xVelocity * d;
    this.y += this._yVelocity * d;
    this.angle += this._angularVelocity * d;

    // Apply world forces
    if (this._xVelocity < 0) {
      // The absolute amount required for the velocity to reach 0
      const nv = Math.abs(this._xVelocity);

      this._xVelocity += Math.min(this._drag * d, nv);
    } else if (this._xVelocity > 0) {
      // The absolute amount required for the velocity to reach 0
      const nv = this._xVelocity;

      this._xVelocity -= Math.min(this._drag * d, nv);
    }

    if (this._yVelocity < 0) {
      this._yVelocity += this._drag * d;
    } else if (this._yVelocity > 0) {
      this._yVelocity -= this._drag * d;
    }

    this._yVelocity -= this._gravity * d;

    if (this._angularVelocity > 0) {
      // The absolute amount required for the velocity to reach 0
      const nv = this._angularVelocity;

      this._angularVelocity -= Math.min(this._angularDrag * d, nv);
    } else if (this._angularVelocity < 0) {
      // The absolute amount required for the velocity to reach 0
      const nv = Math.abs(this._angularVelocity);

      this._angularVelocity += Math.min(this._angularDrag * d, nv);
    }

    // Emit out of bounds events
    // Make sure the bread is really off the screen
    const tolerance = 100;
    if (
      this.x < 0 - tolerance ||
      this.x > (this.scene.game.config.width as number) + tolerance ||
      this.y < 0 - tolerance ||
      this.y > (this.scene.game.config.height as number) + tolerance
    ) {
      this.emit('out-of-bounds');
    }
  }
}

export interface IBreadHuntBreadConfig {
  scene: Phaser.Scene;
  x: number;
  y: number;
  physics: IBreadHuntBreadPhysics;
}

export interface IBreadHuntBreadPhysics {
  drag: number;
  angularDrag: number;
  gravity: number;
}
