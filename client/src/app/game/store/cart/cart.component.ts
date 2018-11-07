import { Component, OnInit, Input } from '@angular/core';
import { IITem } from 'src/api';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  @Input()
  public cart: { item: IITem; quantity: number }[];

  constructor() {}

  ngOnInit() {}

  /**
   * Returns the total currency of items in the cart right now
   */
  public get totalCartPrice() {
    if (this.cart.length === 0) {
      return 0;
    }

    return this.cart.map((c) => c.item.cost * c.quantity).reduce((p, c) => p + c);
  }
}
