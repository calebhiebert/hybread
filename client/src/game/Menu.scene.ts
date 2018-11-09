/**
 * Menu.scene.ts
 *
 * This file contains the Hybread menu scene
 */

import * as Phaser from 'phaser';
import { HybreadAPI } from 'src/api';
import { Button } from './ui/button';
import { ITitleCardConfig } from './MinigameTitleCard.scene';
import { MessageService } from 'src/app/message.service';

export class MenuScene extends Phaser.Scene {
  private breadLogo: Phaser.GameObjects.Image;
  private logoText: Phaser.GameObjects.Text;
  private api: HybreadAPI;

  private messageService: MessageService;

  constructor() {
    super({
      key: 'menu',
    });

    this.messageService = (window as any).messageBus;

    this.api = new HybreadAPI(localStorage.getItem('auth-token'));
  }

  preload() {
    this.api.checkAuthenticationStatus().then((auth) => {
      this.add.text(5, 5, `${auth.user.id} - ${auth.user.username}`);
    });
  }

  create() {
    // Render the bread logo
    this.breadLogo = this.add.image(
      (this.game.config.width as number) / 2,
      100,
      'bread'
    );

    // Render the logo text
    this.logoText = this.add.text(
      (this.game.config.width as number) / 2,
      250,
      'Hybread',
      {
        fontFamily: 'Spicy Rice',
        fontSize: '65px',
      }
    );

    this.breadLogo.setOrigin(0.5, 0.5);
    this.logoText.setOrigin(0.5, 0.5);

    // Create bread hunt button
    const storeButton = new Button(
      this,
      (this.game.config.width as number) / 2,
      (this.game.config.height as number) / 2,
      'Store'
    );

    storeButton.on('click', () => {
      this.messageService.sendMessage({ type: 'store-open' });
    });

    // Create button
    const button = new Button(
      this,
      (this.game.config.width as number) / 2,
      (this.game.config.height as number) / 2 - 120,
      'Bread Hunt'
    );

    button.on('click', () => {
      const titleCardConfig: ITitleCardConfig = {
        image: 'tc-bread-hunt',
        minDuration: 4.0,
        scale: 1.35,
        sceneAfter: 'bread-hunt',
        title: 'Bread Hunt',
        subtitle: "They're after your recipe, what will you do to defend it?",
      };

      this.scene.start('title-card', titleCardConfig);
    });

    // Create logout button
    const logout = new Button(
      this,
      (this.game.config.width as number) / 2,
      (this.game.config.height as number) / 2 - 50,
      'Logout',
    );

    //Logs the user out of the game
    logout.on('click', () => {
      this.api.logout();
      window.location.reload();
    });
  }
}
