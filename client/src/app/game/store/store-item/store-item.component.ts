import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IITem } from 'src/api';

@Component({
  selector: 'app-store-item',
  templateUrl: './store-item.component.html',
  styleUrls: ['./store-item.component.scss'],
})
export class StoreItemComponent implements OnInit {
  @Input()
  public item: IITem;

  @Output()
  public carted = new EventEmitter<IITem>();

  constructor() {}

  ngOnInit() {}

  /**
   * Called when the add to cart button is clicked
   */
  public onAddToCart() {
    this.carted.emit(this.item);
  }

  public get backgroundImageCSS() {
    return `url("assets/items/${this.item.name}.png")`;
  }
}
