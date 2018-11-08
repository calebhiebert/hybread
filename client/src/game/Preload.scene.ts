import * as Phaser from 'phaser';
import { HybreadAPI } from 'src/api';
import { ITitleCardConfig } from './MinigameTitleCard.scene';
import { ImageAssets } from './assets';

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
    for (const asset of ImageAssets.IMAGE_ASSETS) {
      this.load.image(asset.key, asset.path);
    }
  }
}
