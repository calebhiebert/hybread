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

    this.loadingText = this.add.text(
      (this.game.config.width as number) / 2,
      (this.game.config.height as number) / 2,
      '0%',
      {
        align: 'center',
        fontFamily: 'Spicy Rice',
      }
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
  }

  create(): void {
    this.breadLogo = this.add.image(
      (this.game.config.width as number) / 2,
      (this.game.config.height as number) / 2 - 30,
      'bread'
    );
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
