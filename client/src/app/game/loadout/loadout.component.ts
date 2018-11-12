import { Component, OnInit } from '@angular/core';
import { MessageService } from 'src/app/message.service';
import { IITem } from 'src/api';

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

  public bake() {
    this.msgService.sendMessage({ type: 'bake' });
  }

  public get heatSource(): IITem {
    return {
      id: 1,
      name: 'Dark Magic',
      category: 'base-ingredient',
      description: 'It is waqter',
      cost: 1,
    };
  }

  public get cookingSurface(): IITem {
    return {
      id: 1,
      name: 'Dark Magic',
      category: 'base-ingredient',
      description: 'It is waqter',
      cost: 1,
    };
  }

  public get coolingSurface(): IITem {
    return {
      id: 1,
      name: 'Dark Magic',
      category: 'base-ingredient',
      description: 'It is waqter',
      cost: 1,
    };
  }
}
