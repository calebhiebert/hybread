/**
 * rays.ts
 *
 * This file contains a rays class that will draw some nice rays on the screen
 */
import * as Phaser from 'phaser';

export class Rays extends Phaser.GameObjects.Graphics {
  /**
   * Rays constructor
   * @param scene the phaser scene to draw the rays in
   * @param rayLength the length of each ray in pixels
   * @param rayWidth the width of each ray (in degrees)
   * @param rayCount the number of rays in the circle
   */
  constructor(
    scene: Phaser.Scene,
    private rayLength: number,
    private rayWidth: number,
    private rayCount: number
  ) {
    super(scene);

    scene.add.existing(this);
  }

  /**
   * Draw the rays
   * @param color the color that the rays will be
   */
  public draw(color: number, outerColor?: number): void {
    if (outerColor) {
      this.fillGradientStyle(color, outerColor, outerColor, outerColor);
    } else {
      this.fillStyle(color);
    }

    for (let i = 0; i < this.rayCount; i++) {
      let degStart = (360 / this.rayCount) * i - this.rayWidth / 2;
      let degEnd = (360 / this.rayCount) * i + this.rayWidth / 2;

      const x1 = 0 + this.rayLength * Math.cos((degStart * Math.PI) / 180);
      const y1 = 0 + this.rayLength * Math.sin((degStart * Math.PI) / 180);

      const x2 = 0 + this.rayLength * Math.cos((degEnd * Math.PI) / 180);
      const y2 = 0 + this.rayLength * Math.sin((degEnd * Math.PI) / 180);

      this.fillTriangle(0, 0, x1, y1, x2, y2);
    }
  }
}
