import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { switchMap, of } from 'rxjs';
import { StarWarsApiService } from '../../../core/services/star-wars-api.service';
import { CartService } from '../../../core/services/cart.service';
import { VehicleWithId } from '../../../core/models/star-wars.interface';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';

@Component({
  selector: 'app-vehicle-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, LoadingComponent, NgOptimizedImage],
  templateUrl: './vehicle-detail.component.html',
  styleUrls: ['./vehicle-detail.component.css']
})
export class VehicleDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly starWarsService = inject(StarWarsApiService);
  readonly cartService = inject(CartService);

  // Signals
  private readonly _vehicle = signal<VehicleWithId | null>(null);
  private readonly _isLoading = signal(true);
  private readonly _error = signal<string | null>(null);

  // Public readonly signals
  readonly vehicle = this._vehicle.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();

  // Computed signals
  readonly isInCart = computed(() => {
    const vehicle = this._vehicle();
    return vehicle ? this.cartService.isInCart(vehicle.id, vehicle.type) : false;
  });

  readonly currentQuantity = computed(() => {
    const vehicle = this._vehicle();
    return vehicle ? this.cartService.getItemQuantity(vehicle.id, vehicle.type) : 0;
  });

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap((params: any) => {
        const type = params['type'] as 'vehicle' | 'starship';
        const id = params['id'];

        if (!type || !id || (type !== 'vehicle' && type !== 'starship')) {
          this._error.set('Parámetros de vehículo inválidos');
          this._isLoading.set(false);
          return of(null);
        }

        this._isLoading.set(true);
        this._error.set(null);
        return this.starWarsService.getVehicleById(id, type);
      })
    ).subscribe({
      next: (vehicle: VehicleWithId | null) => {
        if (vehicle) {
          this._vehicle.set(vehicle);
        } else {
          this._error.set('Vehículo no encontrado');
        }
        this._isLoading.set(false);
      },
      error: (error: unknown) => {
        console.error('Error loading vehicle detail:', error);
        this._error.set('Error al cargar los detalles del vehículo');
        this._isLoading.set(false);
      }
    });
  }

  addToCart(): void {
    const vehicle = this._vehicle();
    if (vehicle) {
      this.cartService.addToCart(vehicle);
    }
  }

  increaseQuantity(): void {
    const vehicle = this._vehicle();
    if (vehicle) {
      const currentQty = this.cartService.getItemQuantity(vehicle.id, vehicle.type);
      this.cartService.updateQuantity(vehicle.id, vehicle.type, currentQty + 1);
    }
  }

  decreaseQuantity(): void {
    const vehicle = this._vehicle();
    if (vehicle) {
      const currentQty = this.cartService.getItemQuantity(vehicle.id, vehicle.type);
      if (currentQty > 1) {
        this.cartService.updateQuantity(vehicle.id, vehicle.type, currentQty - 1);
      } else {
        this.cartService.removeFromCart(vehicle.id, vehicle.type);
      }
    }
  }

  goBack(): void {
    this.router.navigate(['/vehicles']);
  }

  formatPrice(price: string): string {
    if (price === 'unknown' || !price) {
      return '10,000 créditos';
    }

    const numericPrice = parseInt(price.replace(/,/g, ''), 10);
    if (isNaN(numericPrice)) {
      return '10,000 créditos';
    }

    return `${numericPrice.toLocaleString()} créditos`;
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    const vehicle = this._vehicle();
    if (vehicle) {
      const fallbackColor = vehicle.type === 'starship' ? '2c3e50' : '34495e';
      const encodedName = encodeURIComponent(vehicle.name);
      img.src = `https://placehold.co/600x400/${fallbackColor}/ffffff?text=${encodedName}`;
    }
  }
}
