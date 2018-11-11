import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private messageBus = new EventEmitter<IMessage>();

  constructor() {}

  public sendMessage(msg: IMessage) {
    this.messageBus.emit(msg);
  }

  public get msgBus() {
    return this.messageBus;
  }
}

export interface IMessage {
  type:
    | 'store-open'
    | 'store-close'
    | 'logout'
    | 'loadout-open'
    | 'loadout-close';
  data?: any;
}
