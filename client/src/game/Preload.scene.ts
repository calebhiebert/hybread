import * as Phaser from 'phaser';
import { HybreadAPI } from 'src/api';

export class PreloadScene extends Phaser.Scene {
  private loadingText: Phaser.GameObjects.Text;

  private breadLogo: Phaser.GameObjects.Image;
  private logoText: Phaser.GameObjects.Text;
  private api: HybreadAPI;

  constructor() {
    super({
      key: 'preload',
    });

    this.api = new HybreadAPI(localStorage.getItem('auth-token'));
  }

  preload(): void {
    this.api.checkAuthenticationStatus().then((auth) => {
      this.add.text(5, 5, `${auth.user.id} - ${auth.user.username}`);
    });

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

      // Temporary, for development purposes
      setTimeout(() => {
        this.scene.start('bread-hunt');
      }, 250);
    });

    /**
     * START ASSET LOADING
     */
    this.load.image('bread', '/assets/bread.png');
  }

  create(): void {
    // Render the bread logo
    this.breadLogo = this.add.image(
      (this.game.config.width as number) / 2,
      (this.game.config.height as number) / 2 - 30,
      'bread'
    );

    // Render the logo text
    this.logoText = this.add.text(
      (this.game.config.width as number) / 2,
      (this.game.config.height as number) / 2 + 120,
      'Hybread',
      {
        align: 'center',
        fontFamily: 'Spicy Rice',
        fontSize: '65px',
      }
    );

    this.breadLogo.setOrigin(0.5, 0.5);
    this.logoText.setOrigin(0.5, 0.5);
  }
}
