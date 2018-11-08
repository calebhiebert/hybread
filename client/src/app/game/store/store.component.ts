import { Component, OnInit } from '@angular/core';
import { HybreadAPI, IITem } from 'src/api';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss'],
})
export class StoreComponent implements OnInit {
  // The list of purchasable items
  public items: IITem[];

  public cart: { item: IITem; quantity: number }[] = [];

  public searchTerm = '';

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

  /**
   * Returns the list of items, but filtered with searchTerm
   * Filtering looks for the search term in either the item name or description
   */
  public get searchItems() {
    if (!this.items) {
      return [];
    } else if (this.searchTerm === '') {
      return this.items;
    } else {
      return this.items
        .slice()
        .filter(
          (i) =>
            i.name.toLowerCase().indexOf(this.searchTerm) !== -1 ||
            i.description.toLowerCase().indexOf(this.searchTerm) !== -1
        );
    }
  }

  /**
   * Called when the user changes their search term
   * @param searchTerm what the user is searching for
   */
  onSearchChange(searchTerm) {
    this.searchTerm = searchTerm;
  }

  /**
   * Called when an item is added to the cart
   * @param item item that was added to cart
   */
  onItemAddedToCart(item: IITem) {
    // TODO check if the user has enough money

    // Check if the item exists already in the cart
    const existingItem = this.cart.find((ci) => ci.item.id === item.id);

    if (existingItem) {
      existingItem.quantity++;
    } else {
      this.cart.push({ item, quantity: 1 });
    }
  }
}
