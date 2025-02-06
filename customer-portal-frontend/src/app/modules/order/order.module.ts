import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'list',
    loadComponent: () => import('./order-list/order-list.component').then(m => m.OrderListComponent)
  },
  {
    path: 'import',
    loadComponent: () => import('./order-import/order-import.component').then(m => m.OrderImportComponent)
  },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class OrderModule { }
