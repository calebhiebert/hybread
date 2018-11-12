/**
 * button.ts
 *
 * This file contains a Phaser button implimentation
 */
import * as Phaser from 'phaser';

export class Button extends Phaser.Events.EventEmitter {
  private button: Phaser.GameObjects.Sprite;
  private text: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, x: number, y: number, text: string) {
    super();
    this.button = scene.add.sprite(x, y, 'ui-button');
    this.text = scene.add.text(x, y, text, {
      fontFamily: 'Spicy Rice',
      fontSize: '26px',
    });

    this.button.setOrigin(0.5, 0.5);
    this.text.setOrigin(0.5, 0.5);

    this.button.setInteractive({
      cursor: 'pointer',
    });
    this.button.on('pointerover', () => this.enterHover());
    this.button.on('pointerout', () => this.leaveHover());
    this.button.on('pointerdown', () => {
      this.enterHover();
      this.emit('click');
    });
    this.button.on('pointerup', () => {
      this.leaveHover();
    });
  }

  private enterHover() {
    this.button.setTexture('ui-button-pressed');
  }

  private leaveHover() {
    this.button.setTexture('ui-button');
  }
}
