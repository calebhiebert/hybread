import { Component, OnInit, Input } from '@angular/core';
import { IITem } from 'src/api';

@Component({
  selector: 'app-store-item',
  templateUrl: './store-item.component.html',
  styleUrls: ['./store-item.component.css'],
})
export class StoreItemComponent implements OnInit {
  @Input()
  public item: IITem;

  constructor() {}

  ngOnInit() {}
}
