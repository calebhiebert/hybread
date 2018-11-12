import { Component, OnInit } from '@angular/core';
import { MessageService } from 'src/app/message.service';
import { IITem, IInventoryItem, HybreadAPI } from 'src/api';

@Component({
  selector: 'app-loadout',
  templateUrl: './loadout.component.html',
  styleUrls: ['./loadout.component.scss'],
})
export class LoadoutComponent implements OnInit {
  public inventory?: IInventoryItem[];

  public loadout: IInventoryItem[] = [];

  constructor(public msgService: MessageService) {}

  async ngOnInit() {
    const api = new HybreadAPI(localStorage.getItem('auth-token'));

    try {
      const inventory = await api.getInventory();
      this.inventory = inventory;
    } catch (err) {
      console.warn('Unable to load inventory', err);
    }
  }

  public close() {
    this.msgService.sendMessage({ type: 'loadout-close' });
  }

  public bake() {
    this.msgService.sendMessage({ type: 'bake' });
  }

  public onItemRemoved(item: IInventoryItem) {
    const inventoryItem = this.inventory.find((ii) => ii.id === item.id);

    if (inventoryItem) {
      inventoryItem.count += item.count;
    } else {
      this.inventory.push(item);
    }

    this.loadout = this.loadout.filter((li) => li.id !== item.id);
  }

  public onItemSelected(item: IInventoryItem) {
    if (item.count === 0) {
      return;
    }

    const existingItem = this.loadout.find((li) => li.id === item.id);
    if (existingItem !== undefined) {
      existingItem.count++;
    } else {
      this.loadout.push({ ...item, count: 1 });
    }

    item.count--;

    if (item.count === 0) {
      this.inventory = this.inventory.filter((ii) => ii.id !== item.id);
    }
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
