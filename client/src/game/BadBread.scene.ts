import * as Phaser from 'phaser';
import { Rays } from './rays';
import { Button } from './ui/button';

export class BadBreadScene extends Phaser.Scene {
  private bread: Phaser.GameObjects.Sprite;

  constructor() {
    super({
      key: 'bad-bread',
    });
  }

  create() {
    const midX = (this.game.config.width as number) / 2;
    const midY = (this.game.config.height as number) / 2;

    // Place the background image
    const sunrise = this.add.image(midX, midY, 'swamp');
    sunrise.setScaleMode(Phaser.ScaleModes.NEAREST);
    sunrise.setScale(10);

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
    const text = this.add.text(midX, midY + 200, 'Smelly Mud Loaf', {
      fontFamily: 'Spicy Rice',
      fontSize: '86px',
      stroke: '#000',
      strokeThickness: 10,
    });
    text.setOrigin(0.5, 0.5);
    text.alpha = 0;

    // Add the bread image, animate it flying in
    this.bread = this.add.sprite(midX, 0 - 250, 'bread');
    const breadTween = this.add.tween({
      targets: this.bread,
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
    this.createFlyParticles();
  }

  update(time, delta) {}

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

  private createFlyParticles() {
    const breadSource = {
      getRandomPoint: (vec: Phaser.Math.Vector2) => {
        vec.setTo(Math.random() * 240 - 120, Math.random() * 64);
      },
    };

    const particles = this.add.particles('fly');
    particles.setPosition(
      (this.game.config.width as number) / 2,
      (this.game.config.height as number) / 2
    );

    const emitter = particles.createEmitter({
      // speed: 75,
      speedY: { max: -45, min: -25 },
      angle: { min: 0, max: 360 },
      frequency: 750,
      lifespan: { min: 6000, max: 18000 },
      scale: { start: 0, end: 1, ease: 'Quad.easeOut' },
      emitZone: { type: 'random', source: breadSource },
    });
  }
}
