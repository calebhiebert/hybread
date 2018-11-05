/**
 * bread-score.ts
 *
 * This file contains the logic for score text when hitting a bread
 */
import * as Phaser from 'phaser';

export class BreadHuntScoreText {
  // What time the text was born
  private _birth: number;

  // The actual score text game object
  private _text: Phaser.GameObjects.Text;

  constructor(
    private scene: Phaser.Scene,
    score: number,
    x: number = 0,
    y: number = 0,
    private speed: number = 30,
    private lifeTime = 1
  ) {
    this._text = scene.add.text(x, y, `+${score}`, {
      align: 'center',
      fontFamily: 'Spicy Rice',
      fontSize: score > 100 ? '48px' : '32px',
    });

    this._text.setOrigin(0.5, 0.5);

    this._birth = Date.now();
  }

  /**
   * Update the text
   * This will move the text upwards in a pleasing way
   * @param delta delta time, ms since the last frame
   */
  public update(delta: number) {
    this._text.y -= (delta / 1000) * this.speed;

    this.scene.add.tween({
      targets: this._text,
      alpha: 0,
      ease: 'Power2',
      delay: (this.lifeTime / 2) * 1000,
    });

    // Check how long this text has existed
    if ((Date.now() - this._birth) / 1000 > this.lifeTime) {
      this._text.destroy(true);
    }
  }
}
