import * as Phaser from 'phaser';

export class BakingBreadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'baking-bread' });
  }

  create() {
    const text = this.add.text(
      (this.game.config.width as number) / 2,
      (this.game.config.height as number) / 2,
      'Bread is Baking yo',
      {
        fontFamily: 'Spicy Rice',
        fontSize: '48px',
      },
    );
    text.setOrigin(0.5);

    setTimeout(() => {
      const rand = Math.random();

      if (rand > 0.5) {
        this.scene.start('good-bread');
      } else {
        this.scene.start('bad-bread');
      }
    }, 1000);
  }
}
