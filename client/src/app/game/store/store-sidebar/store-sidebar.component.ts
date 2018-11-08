import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MessageService } from 'src/app/message.service';

@Component({
  selector: 'app-store-sidebar',
  templateUrl: './store-sidebar.component.html',
  styleUrls: ['./store-sidebar.component.css'],
})
export class StoreSidebarComponent implements OnInit {
  @Output()
  public search: EventEmitter<string> = new EventEmitter<string>();

  public searchControl = new FormControl();

  constructor(private msgSrv: MessageService) {}

  ngOnInit() {
    this.searchControl.valueChanges.subscribe((value) => {
      this.search.emit(value);
    });
  }

  public closeStore() {
    this.msgSrv.sendMessage({ type: 'store-close' });
  }
}
