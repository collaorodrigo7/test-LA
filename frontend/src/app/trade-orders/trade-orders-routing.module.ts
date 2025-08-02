import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TradeOrdersComponent } from './trade-orders';
import { TradeOrderComponent } from './trade-order/trade-order';

const routes: Routes = [
  {
    path: '',
    component: TradeOrdersComponent
  },
  {
    path: 'new2',
    component: TradeOrderComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TradeOrdersRoutingModule { }
