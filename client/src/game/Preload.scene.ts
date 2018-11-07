import * as Phaser from 'phaser';
import { HybreadAPI } from 'src/api';
import { ITitleCardConfig } from './MinigameTitleCard.scene';

export class PreloadScene extends Phaser.Scene {
  private loadingText: Phaser.GameObjects.Text;

  constructor() {
    super({
      key: 'preload',
    });
  }

  preload(): void {
    // Create some text to show the loading percentage
    this.loadingText = this.add.text(
      (this.game.config.width as number) / 2,
      (this.game.config.height as number) / 2,
      '0%',
      {
        align: 'center',
        fontFamily: 'Spicy Rice',
      }
    );

    // Set the rendering anchor to the center of the text
    this.loadingText.setOrigin(0.5, 0.5);

    // Called when the loading percent is updated
    this.load.on('progress', (val) => {
      this.loadingText.text = `${Math.round(val * 100)}%`;
    });

    // Called when game loading is complete
    this.load.on('complete', () => {
      // Destroy the loading text as we do not need it anymore
      this.loadingText.destroy();
      this.scene.start('menu');
    });

    /**
     * START ASSET LOADING
     */
    this.load.image('bread', '/assets/bread.png');
    this.load.image('sunrise', '/assets/sunrise.png');
    this.load.image('tc-bread-hunt', '/assets/tc/bread-hunt.png');
    this.load.image('ui-button', '/assets/ui/buttonLong_brown.png');
    this.load.image(
      'ui-button-pressed',
      '/assets/ui/buttonLong_brown_pressed.png'
    );
  }
}
