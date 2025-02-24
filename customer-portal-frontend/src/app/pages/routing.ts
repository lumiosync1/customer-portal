import { Routes } from '@angular/router';

const Routing: Routes = [
  {
    path: 'dashboard',
    loadComponent: () =>
      import('../modules/dashboard/dashboard/dashboard.component').then((m) => m.DashboardComponent),
  },
  {
    path: 'apps/users',
    loadChildren: () => import('./user/user.module').then((m) => m.UserModule),
  },
  {
    path: 'apps/roles',
    loadChildren: () => import('./role/role.module').then((m) => m.RoleModule),
  },
  {
    path: 'apps/permissions',
    loadChildren: () => import('./permission/permission.module').then((m) => m.PermissionModule),
  },
  {
    path: 'orders',
    loadComponent: () =>
      import('../modules/order/order-list/order-list.component').then((m) => m.OrderListComponent),
  },
  {
    path: 'orders/:id',
    loadComponent: () =>
      import('../modules/order/order-detail/order-detail.component').then((m) => m.OrderDetailComponent),
  },
  {
    path: 'orders-import',
    loadComponent: () =>
      import('../modules/order/order-import/order-import.component').then((m) => m.OrderImportComponent),
  },
  {
    path: 'balance-transactions',
    loadComponent: () =>
      import('../modules/balance/balance-transaction-list/balance-transaction-list.component').then((m) => m.BalanceTransactionListComponent),
  },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'error/404',
  },
];

export { Routing };
