import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'trades',
    loadChildren: () => import('./trade-orders/trade-orders.module').then(m => m.TradeOrdersModule)
  },
  {
    path: '',
    redirectTo: 'trades',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'trades'
  }
];
