import { Injectable, EventEmitter } from '@angular/core';
import * as Phaser from 'phaser';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private messageBus2 = new Phaser.Events.EventEmitter();

  constructor() {}

  public sendMessage(msg: IMessage) {
    this.messageBus2.emit(msg.type, msg.data);
  }

  public get msgBus() {
    return this.messageBus2;
  }
}

export interface IMessage {
  type:
    | 'store-open'
    | 'store-close'
    | 'logout'
    | 'loadout-open'
    | 'loadout-close'
    | 'bake'
    | 'leaderboard-open'
    | 'leaderboard-close';
  data?: any;
}
