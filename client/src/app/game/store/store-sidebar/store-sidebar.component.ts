import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MessageService } from 'src/app/message.service';
import { IUser, IITem } from 'src/api';

@Component({
  selector: 'app-store-sidebar',
  templateUrl: './store-sidebar.component.html',
  styleUrls: ['./store-sidebar.component.css'],
})
export class StoreSidebarComponent implements OnInit {
  @Output()
  public search: EventEmitter<string> = new EventEmitter<string>();

  @Input()
  public user: IUser;

  @Input()
  public cart: { item: IITem; quantity: number }[];

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

  public get cartCost(): number {
    if (!this.cart || this.cart.length === 0) {
      return 0;
    } else {
      return this.cart
        .map((c) => c.item.cost * c.quantity)
        .reduce((p, c) => p + c);
    }
  }

  public get currencyRemaining(): number {
    if (!this.user) {
      return 0;
    } else {
      return this.user.currency - this.cartCost;
    }
  }
}
