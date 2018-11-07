import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-store-sidebar',
  templateUrl: './store-sidebar.component.html',
  styleUrls: ['./store-sidebar.component.css'],
})
export class StoreSidebarComponent implements OnInit {
  @Output()
  public search: EventEmitter<string> = new EventEmitter<string>();

  public searchControl = new FormControl();

  constructor() {}

  ngOnInit() {
    this.searchControl.valueChanges.subscribe((value) => {
      this.search.emit(value);
    });
  }
}
