import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'vehicles',
    loadComponent: () => import('./features/vehicles/vehicles-list/vehicles-list.component').then(m => m.VehiclesListComponent)
  },
  {
    path: 'starships',
    redirectTo: '/vehicles'
  },
  {
    path: 'vehicle/:type/:id',
    loadComponent: () => import('./features/vehicles/vehicle-detail/vehicle-detail.component').then(m => m.VehicleDetailComponent)
  },
  {
    path: 'cart',
    loadComponent: () => import('./features/cart/cart.component').then(m => m.CartComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
