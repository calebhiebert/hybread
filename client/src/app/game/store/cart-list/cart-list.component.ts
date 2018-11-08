import { Component, OnInit, Input } from '@angular/core';
import { IITem } from 'src/api';

@Component({
  selector: 'app-cart-list',
  templateUrl: './cart-list.component.html',
  styleUrls: ['./cart-list.component.css'],
})
export class CartListComponent implements OnInit {
  @Input()
  public cart: { item: IITem; quantity: number }[];

  constructor() {}

  ngOnInit() {}

  public getURL(item: IITem) {
    return `url("/assets/items/${item.name}.png")`;
  }
}
