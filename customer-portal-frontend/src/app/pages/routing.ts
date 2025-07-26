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
    path: 'cancel-requests',
    loadComponent: () =>
      import('../modules/order/cancel-request-list/cancel-request-list.component').then((m) => m.CancelRequestListComponent),
  },
  {
    path: 'return-requests',
    loadComponent: () =>
      import('../modules/order/return-request-list/return-request-list.component').then((m) => m.ReturnRequestListComponent),
  },
  {
    path: 'balance-transactions',
    loadComponent: () =>
      import('../modules/balance/balance-transaction-list/balance-transaction-list.component').then((m) => m.BalanceTransactionListComponent),
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('../modules/setting/settings/settings.component').then((c) => c.SettingsComponent),
  },
  {
    path: 'profile/change-password',
    loadComponent: () =>
      import('../modules/profile/change-password/change-password.component').then((c) => c.ChangePasswordComponent),
  },
  {
    path: 'stores',
    loadComponent: () =>
      import('../modules/store/store-list/store-list.component').then((c) => c.StoreListComponent),
  },
  {
    path: 'stores/add-ebay-nonapi',
    loadComponent: () =>
      import('../modules/store/store-add-ebaymip/store-add-ebaymip.component').then((c) => c.StoreAddEbaymipComponent),
  },
  {
    path: 'stores/:id',
    loadComponent: () =>
      import('../modules/store/store-update/store-update.component').then((c) => c.StoreUpdateComponent),
  },
  {
    path: 'stores/update-ebay-nonapi/:id',
    loadComponent: () =>
      import('../modules/store/store-update-ebaymip/store-update-ebaymip.component').then((c) => c.StoreUpdateEbaymipComponent),
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
