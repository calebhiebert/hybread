import { Component, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { PreloadScene } from 'src/game/Preload.scene';
import * as Phaser from 'phaser';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
})
export class GameComponent implements AfterViewInit {
  private ASPECT = 16.0 / 9.0;

  @ViewChild('gamecontainer')
  private gameContainer: HTMLElement;

  @ViewChild('gamecanvas')
  private gameCanvas: ElementRef<HTMLCanvasElement>;

  private game: Phaser.Game;
  private resizeTimer: any;

  constructor() {}

  ngAfterViewInit() {
    const config: GameConfig = {
      width: window.innerWidth,
      height: window.innerWidth / this.ASPECT,
      // parent: this.gameContainer,
      canvas: this.gameCanvas.nativeElement,
      type: Phaser.AUTO,
      scene: PreloadScene,
    };

    this.game = new Phaser.Game(config);
    console.log(this.game);

    window.addEventListener('resize', () => {
      this.resizeEventHandler();
    });

    this.resizeGameWindow();
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
      this.game.renderer.resize(width, height);
    }
  }
}
