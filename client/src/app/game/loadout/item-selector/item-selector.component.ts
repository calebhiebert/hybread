import { Component, OnInit, Input } from '@angular/core';
import { IITem } from 'src/api';

@Component({
  selector: 'app-item-selector',
  templateUrl: './item-selector.component.html',
  styleUrls: ['./item-selector.component.scss'],
})
export class ItemSelectorComponent implements OnInit {
  @Input()
  public title: string;

  @Input()
  public item: IITem;

  constructor() {}

  ngOnInit() {}

  public get backgroundImageCSS() {
    if (this.item) {
      return `url("assets/items/${encodeURIComponent(this.item.name)}.png")`;
    } else {
      return '';
    }
  }
}
