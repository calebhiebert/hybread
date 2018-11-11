import { Component, OnInit } from '@angular/core';
import { MessageService } from 'src/app/message.service';

@Component({
  selector: 'app-loadout',
  templateUrl: './loadout.component.html',
  styleUrls: ['./loadout.component.scss'],
})
export class LoadoutComponent implements OnInit {
  constructor(public msgService: MessageService) {}

  ngOnInit() {}

  public close() {
    this.msgService.sendMessage({ type: 'loadout-close' });
  }
}
