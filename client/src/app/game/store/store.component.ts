import { Component, OnInit } from '@angular/core';
import { HybreadAPI, IITem } from 'src/api';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css'],
})
export class StoreComponent implements OnInit {
  // The list of purchasable items
  public items: IITem[];

  private api: HybreadAPI;

  constructor() {
    this.api = new HybreadAPI(localStorage.getItem('auth-token'));
  }

  async ngOnInit() {
    try {
      const itemResponse = await this.api.getItems();
      this.items = itemResponse.items;
      console.log(this.items);
    } catch (err) {}
  }
}
