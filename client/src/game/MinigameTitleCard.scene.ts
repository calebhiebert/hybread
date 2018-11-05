/**
 * MinigameTitleCard.scene.ts
 *
 * This file is a Phaser scene that will display title cards
 */
import * as Phaser from 'phaser';

export class MinigameTitleCard extends Phaser.Scene {
  private config: ITitleCardConfig;

  constructor() {
    super({
      key: 'title-card',
    });
  }

  init(config: ITitleCardConfig) {
    this.config = config;

    setTimeout(() => {
      this.scene.start(config.sceneAfter);
    }, config.minDuration * 1000);
  }

  preload() {}

  create() {
    const image = this.add.image(
      (this.game.config.width as number) / 2,
      (this.game.config.height as number) / 2,
      this.config.image,
    );

    image.setScaleMode(Phaser.ScaleModes.NEAREST);
    image.setScale(this.config.scale || 1, this.config.scale || 1);

    const text = this.add.text(
      (this.game.config.width as number) - 50,
      (this.game.config.height as number) - 60,
      this.config.title,
      {
        fontSize: '86px',
        fontFamily: 'Spicy Rice',
        stroke: '#000',
        strokeThickness: 8,
      },
    );

    text.setOrigin(1, 1);

    const subtitleText = this.add.text(
      (this.game.config.width as number) - 50,
      (this.game.config.height as number) - 30,
      this.config.subtitle,
      {
        fontSize: '32px',
        fontFamily: 'Spicy Rice',
        stroke: '#000',
        strokeThickness: 6,
      },
    );

    subtitleText.setOrigin(1, 1);
  }
}

export interface ITitleCardConfig {
  // Background image to show
  image: string;

  // Minimum number of seconds to show the title card
  minDuration: number;

  // Image scale, some images are too small
  scale?: number;

  // The key of the scene to load after the title card is done
  sceneAfter: string;

  // The title text that will be displayed
  title: string;

  // Some subtitle text
  subtitle: string;
}
