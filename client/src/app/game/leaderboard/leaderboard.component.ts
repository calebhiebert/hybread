import { Component, OnInit } from '@angular/core';
import { HybreadAPI, IRichestLeaderboardPlayer } from 'src/api';
import { MessageService } from 'src/app/message.service';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css'],
})
export class LeaderboardComponent implements OnInit {
  private _mode: 'richest' | 'best-bread' = 'richest';
  private api: HybreadAPI;

  public richest: IRichestLeaderboardPlayer[];

  constructor(private msg: MessageService) {
    this.api = new HybreadAPI(localStorage.getItem('auth-token'));
  }

  ngOnInit() {
    this.loadData();
  }

  private async loadData() {
    try {
      switch (this.mode) {
        case 'richest':
          this.richest = await this.api.leaderboardRichest();
          break;
      }
    } catch (err) {
      console.warn('Error loading leaderboard', err);
    }
  }

  public close() {
    this.msg.msgBus.emit('leaderboard-close');
  }

  public set mode(value) {
    this._mode = value;
    this.loadData();
  }

  public get mode() {
    return this._mode;
  }
}
