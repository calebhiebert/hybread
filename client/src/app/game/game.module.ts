import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameComponent } from './game/game.component';
import { StoreComponent } from './store/store.component';
import { StoreItemComponent } from './store/store-item/store-item.component';
import { StoreSidebarComponent } from './store/store-sidebar/store-sidebar.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [GameComponent, StoreComponent, StoreItemComponent, StoreSidebarComponent]
})
export class GameModule { }
