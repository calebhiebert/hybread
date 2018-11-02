import * as Phaser from 'phaser';

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'preload',
    });
  }

  preload(): void {
    this.load.on('progress', (val) => {
      console.log('PROG', val);
    });

    this.load.on('fileprogress', (val) => {
      console.log('F PROG', val);
    });

    this.load.on('complete', () => {
      console.log('COMPLETE');
    });
  }

  create(): void {}
}
