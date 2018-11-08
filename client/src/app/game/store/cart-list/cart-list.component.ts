import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { IITem } from 'src/api';

@Component({
  selector: 'app-cart-list',
  templateUrl: './cart-list.component.html',
  styleUrls: ['./cart-list.component.css'],
})
export class CartListComponent implements OnInit {
  @Output()
  public removeItem = new EventEmitter<IITem>();

  @Input()
  public cart: { item: IITem; quantity: number }[];

  constructor() {}

  ngOnInit() {}

  public removeCartItem(item: IITem) {
    this.removeItem.emit(item);
  }

  public getURL(item: IITem) {
    return `url("/assets/items/${item.name}.png")`;
  }
}
