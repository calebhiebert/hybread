import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IITem } from 'src/api';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-store-item',
  templateUrl: './store-item.component.html',
  styleUrls: ['./store-item.component.scss'],
})
export class StoreItemComponent implements OnInit {
  @Input()
  public item: IITem;

  @Input()
  public quantity: number;

  @Output()
  public carted = new EventEmitter<IITem>();

  @Input()
  public disabled: boolean;

  constructor(private sanitization: DomSanitizer) {}

  ngOnInit() {}

  /**
   * Called when the add to cart button is clicked
   */
  public onAddToCart() {
    this.carted.emit(this.item);
  }

  public get backgroundImageCSS() {
    return `url("assets/items/${encodeURIComponent(this.item.name)}.png")`;
  }
}
