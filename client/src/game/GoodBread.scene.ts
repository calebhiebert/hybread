import * as Phaser from 'phaser';
import { Rays } from './rays';

export class GoodBreadScene extends Phaser.Scene {
  private rays: Rays;

  constructor() {
    super({
      key: 'godrays',
    });
  }

  create() {
    const midX = (this.game.config.width as number) / 2;
    const midY = (this.game.config.height as number) / 2;

    const sunrise = this.add.image(midX, midY, 'sunrise');
    // sunrise.setScaleMode(Phaser.ScaleModes.NEAREST);
    sunrise.setScale(10);

    this.rays = new Rays(this, 1000, 10, 15);
    this.rays.draw(0xfff2aa);
    this.rays.setPosition(midX, midY);
    this.rays.setAlpha(0);
    this.rays.setBlendMode(Phaser.BlendModes.HARD_LIGHT);

    const text = this.add.text(midX, midY + 200, 'Nice 👌', {
      fontFamily: 'Spicy Rice',
      fontSize: '86px',
      stroke: '#000',
      strokeThickness: 10,
    });
    text.setOrigin(0.5, 0.5);

    const bread = this.add.image(midX, 0 - 250, 'bread');

    const breadTween = this.add.tween({
      targets: bread,
      duration: 700,
      y: midY - 50,
      ease: 'Back',
      easeParams: [0.8],
    });

    const raysTween = this.add.tween({
      targets: this.rays,
      duration: 350,
      alpha: 0.8,
      ease: 'Linear',
    });
  }

  update(time, delta) {
    this.rays.angle += (10 * delta) / 1000;
  }
}
