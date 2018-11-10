import * as Phaser from 'phaser';
import { Rays } from './rays';
import { Button } from './ui/button';

export class GoodBreadScene extends Phaser.Scene {
  private rays: Rays;

  constructor() {
    super({
      key: 'good-bread',
    });
  }

  create() {
    const midX = (this.game.config.width as number) / 2;
    const midY = (this.game.config.height as number) / 2;

    // Place the background image
    const sunrise = this.add.image(midX, midY, 'sunrise');
    sunrise.setScaleMode(Phaser.ScaleModes.NEAREST);
    sunrise.setScale(10);

    // Create the rays behind the bread
    this.createRays();

    // Add the game baked text
    const bakedText = this.add.text(midX, midY + 125, 'You Baked:', {
      fontFamily: 'Spicy Rice',
      fontSize: '48px',
      stroke: '#000',
      strokeThickness: 5,
    });
    bakedText.setOrigin(0.5);
    bakedText.alpha = 0;

    // Add the bread name text
    const text = this.add.text(midX, midY + 200, 'Holy Garlic Bread', {
      fontFamily: 'Spicy Rice',
      fontSize: '86px',
      stroke: '#000',
      strokeThickness: 10,
    });
    text.setOrigin(0.5, 0.5);
    text.alpha = 0;

    // Add the bread image, animate it flying in
    const bread = this.add.image(midX, 0 - 250, 'bread');
    const breadTween = this.add.tween({
      targets: bread,
      duration: 700,
      y: midY - 50,
      ease: 'Back',
      easeParams: [0.8],
    });

    // Animate the text
    const textTween = this.add.tween({
      targets: [bakedText, text],
      duration: 700,
      delay: 500,
      alpha: 1,
    });

    this.createButton();
  }

  update(time, delta) {
    this.rays.angle += (10 * delta) / 1000;
  }

  private createRays() {
    const midX = (this.game.config.width as number) / 2;
    const midY = (this.game.config.height as number) / 2;

    this.rays = new Rays(this, 1000, 10, 15);
    this.rays.draw(0xfff2aa);
    this.rays.setPosition(midX, midY);
    this.rays.setAlpha(0);
    this.rays.setBlendMode(Phaser.BlendModes.HARD_LIGHT);
    this.rays.setScale(0);

    const raysTween = this.add.tween({
      targets: this.rays,
      duration: 350,
      alpha: 0.8,
      ease: 'Linear',
    });

    const rayScaleTween = this.add.tween({
      targets: this.rays,
      duration: 1000,
      delay: 275,
      scaleX: 1,
      scaleY: 1,
    });
  }

  private createButton() {
    const button = new Button(
      this,
      (this.game.config.width as number) - (190 / 2 + 10),
      (this.game.config.height as number) - (45 / 2 + 10),
      'Yay ->'
    );

    button.on('click', () => {
      this.scene.start('menu');
    });
  }
}
