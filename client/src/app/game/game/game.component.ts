import { Component, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { PreloadScene } from 'src/game/Preload.scene';
import * as Phaser from 'phaser';
import { BreadHuntScene } from 'src/game/BreadHunt.scene';
import { MinigameTitleCard } from 'src/game/MinigameTitleCard.scene';
import { MenuScene } from 'src/game/Menu.scene';
import { MessageService, IMessage } from 'src/app/message.service';
import { GoodBreadScene } from 'src/game/GoodBread.scene';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
})
export class GameComponent implements AfterViewInit {
  private ASPECT = 16.0 / 9.0;
  private WIDTH = 1600;

  public showStore = false;

  @ViewChild('gamecontainer')
  private gameContainer: HTMLElement;

  @ViewChild('gamecanvas')
  private gameCanvas: ElementRef<HTMLCanvasElement>;

  private game: Phaser.Game;
  private resizeTimer: any;

  constructor(private msgSrv: MessageService, private router: Router) {}

  ngAfterViewInit() {
    (window as any).messageBus = this.msgSrv;

    this.msgSrv.msgBus.subscribe((msg: IMessage) => {
      console.log('MSG', msg);
      switch (msg.type) {
        case 'store-open':
          this.showStore = true;
          break;
        case 'store-close':
          this.showStore = false;
          break;
        case 'logout':
          localStorage.removeItem('auth-token');
          this.router.navigate(['login']);
          break;
      }
    });

    const config: GameConfig = {
      width: this.WIDTH,
      height: this.WIDTH / this.ASPECT,
      canvas: this.gameCanvas.nativeElement,
      type: Phaser.AUTO,
      scene: [
        PreloadScene,
        MenuScene,
        MinigameTitleCard,
        GoodBreadScene,
        BreadHuntScene,
      ],
    };

    this.game = new Phaser.Game(config);
    console.log(this.game);

    window.addEventListener('resize', () => {
      this.resizeEventHandler();
    });

    setTimeout(() => {
      this.resizeGameWindow();
    }, 100);
  }

  private resizeEventHandler() {
    if (this.resizeTimer !== undefined) {
      return;
    }

    this.resizeTimer = setTimeout(() => {
      this.resizeTimer = undefined;
      this.resizeGameWindow();
    }, 10);
  }

  private resizeGameWindow() {
    if (!this.game) {
      console.warn('Game not present');
      return;
    }

    let width = window.innerWidth;
    let height = width / this.ASPECT;

    if (height > window.innerHeight) {
      height = window.innerHeight;
      width = height * this.ASPECT;
    }

    if (this.game && this.game.renderer) {
      this.gameCanvas.nativeElement.style.width = `${width}px`;
      this.gameCanvas.nativeElement.style.height = `${height}px`;
    }
  }
}
