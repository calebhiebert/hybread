import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { IInventoryItem, IITem } from 'src/api';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss'],
})
export class ItemListComponent implements OnInit {
  @Input()
  public inventory: IInventoryItem[];

  @Input()
  public mode: 'big' | 'small' = 'small';

  @Output()
  public remove = new EventEmitter<IInventoryItem>();

  @Output()
  public select = new EventEmitter<IInventoryItem>();

  constructor() {}

  ngOnInit() {}

  public getImageCSS(item: IITem) {
    return `url("/assets/items/${encodeURIComponent(item.name)}.png")`;
  }
}
