import * as Phaser from 'phaser';

export class PreloadScene extends Phaser.Scene {
  private loadingText: Phaser.GameObjects.Text;

  private breadLogo: Phaser.GameObjects.Image;
  private logoText: Phaser.GameObjects.Text;

  constructor() {
    super({
      key: 'preload',
    });
  }

  preload(): void {
    this.loadingText = this.add.text(
      (this.game.config.width as number) / 2,
      (this.game.config.height as number) / 2,
      '0%',
      {
        align: 'center',
        fontFamily: 'Spicy Rice',
      },
    );
    this.loadingText.setOrigin(0.5, 0.5);

    this.load.on('progress', (val) => {
      console.log('PROG', val);

      this.loadingText.text = `${Math.round(val * 100)}%`;
    });

    this.load.on('complete', () => {
      console.log('COMPLETE');

      this.loadingText.destroy();
    });

    this.load.image('bread', '/assets/bread.png');

    for (let i = 0; i < 150; i++) {
      this.load.image(`bread-${i}`, '/assets/bread.png');
    }
  }

  create(): void {
    this.breadLogo = this.add.image(this.cameras.main.worldView.centerX, this.cameras.main.worldView.centerY, 'bread');
    this.logoText = this.add.text(
      this.cameras.main.worldView.centerX,
      this.cameras.main.worldView.centerY + 150,
      'Hybread',
      {
        align: 'center',
        fontFamily: 'Spicy Rice',
        fontSize: '65px',
      },
    );

    this.breadLogo.setOrigin(0.5, 0.5);
    this.logoText.setOrigin(0.5, 0.5);
  }
}
