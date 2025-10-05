import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { switchMap, of } from 'rxjs';
import { StarWarsApiService } from '../../core/services/star-wars-api.service';
import { CartService } from '../../core/services/cart.service';
import { VehicleWithId } from '../../core/models/star-wars.interface';
import { LoadingComponent } from '../../shared/components/loading.component';

@Component({
  selector: 'app-vehicle-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, LoadingComponent, NgOptimizedImage],
  template: `
    <div class="vehicle-detail-container">
      <app-loading 
        *ngIf="isLoading()" 
        message="Cargando detalles del vehículo..."
      />

      <div *ngIf="error()" class="error-message">
        <h2>Error al cargar el vehículo</h2>
        <p>{{ error() }}</p>
        <button (click)="goBack()" class="btn btn-secondary">
          Volver
        </button>
      </div>

      <div *ngIf="!isLoading() && !error() && vehicle()" class="vehicle-detail">
        <nav class="breadcrumb">
          <a routerLink="/vehicles" class="breadcrumb-link">Vehículos</a>
          <span class="breadcrumb-separator">›</span>
          <span class="breadcrumb-current">{{ vehicle()?.name }}</span>
        </nav>

        <div class="detail-content">
          <div class="image-section">
            <img 
              ngSrc="{{ vehicle()!.image }}"
              [alt]="vehicle()!.name"
              width="600"
              height="400"
              priority="true"
              class="vehicle-image"
              (error)="onImageError($event)"
            />
            <div class="vehicle-badge" [ngClass]="vehicle()!.type">
              {{ vehicle()!.type === 'starship' ? 'Nave Espacial' : 'Vehículo' }}
            </div>
          </div>

          <div class="info-section">
            <header class="vehicle-header">
              <h1 class="vehicle-name">{{ vehicle()!.name }}</h1>
              <p class="vehicle-model">{{ vehicle()!.model }}</p>
              <p class="vehicle-manufacturer">por {{ vehicle()!.manufacturer }}</p>
            </header>

            <div class="price-section">
              <div class="price-display">
                <span class="price-label">Precio:</span>
                <span class="price-value">{{ formatPrice(vehicle()!.cost_in_credits) }}</span>
              </div>
            </div>

            <div class="specs-section">
              <h3 class="specs-title">Especificaciones</h3>
              <div class="specs-grid">
                <div class="spec-item">
                  <span class="spec-label">Longitud:</span>
                  <span class="spec-value">{{ vehicle()!.length }} metros</span>
                </div>
                <div class="spec-item">
                  <span class="spec-label">Velocidad máxima:</span>
                  <span class="spec-value">{{ vehicle()!.max_atmosphering_speed }} km/h</span>
                </div>
                <div class="spec-item">
                  <span class="spec-label">Tripulación:</span>
                  <span class="spec-value">{{ vehicle()!.crew }}</span>
                </div>
                <div class="spec-item">
                  <span class="spec-label">Pasajeros:</span>
                  <span class="spec-value">{{ vehicle()!.passengers }}</span>
                </div>
                <div class="spec-item">
                  <span class="spec-label">Capacidad de carga:</span>
                  <span class="spec-value">{{ vehicle()!.cargo_capacity }} kg</span>
                </div>
                <div class="spec-item">
                  <span class="spec-label">Consumibles:</span>
                  <span class="spec-value">{{ vehicle()!.consumables }}</span>
                </div>
                
                <!-- Specs específicos para starships -->
                <div *ngIf="vehicle()!.type === 'starship' && vehicle()!.hyperdrive_rating" class="spec-item">
                  <span class="spec-label">Clasificación hiperimpulsor:</span>
                  <span class="spec-value">{{ vehicle()!.hyperdrive_rating }}</span>
                </div>
                <div *ngIf="vehicle()!.type === 'starship' && vehicle()!.MGLT" class="spec-item">
                  <span class="spec-label">MGLT:</span>
                  <span class="spec-value">{{ vehicle()!.MGLT }}</span>
                </div>
                <div *ngIf="vehicle()!.type === 'starship' && vehicle()!.starship_class" class="spec-item">
                  <span class="spec-label">Clase de nave:</span>
                  <span class="spec-value">{{ vehicle()!.starship_class }}</span>
                </div>
                
                <!-- Spec específico para vehicles -->
                <div *ngIf="vehicle()!.type === 'vehicle' && vehicle()!.vehicle_class" class="spec-item">
                  <span class="spec-label">Clase de vehículo:</span>
                  <span class="spec-value">{{ vehicle()!.vehicle_class }}</span>
                </div>
              </div>
            </div>

            <div class="actions-section">
              <div class="quantity-controls" *ngIf="isInCart()">
                <label class="quantity-label">Cantidad en carrito:</label>
                <div class="quantity-input-group">
                  <button 
                    (click)="decreaseQuantity()"
                    [disabled]="cartService.isLoading()"
                    class="quantity-btn"
                    aria-label="Disminuir cantidad"
                  >
                    −
                  </button>
                  <span class="quantity-display">{{ currentQuantity() }}</span>
                  <button 
                    (click)="increaseQuantity()"
                    [disabled]="cartService.isLoading()"
                    class="quantity-btn"
                    aria-label="Aumentar cantidad"
                  >
                    +
                  </button>
                </div>
              </div>

              <div class="action-buttons">
                <button 
                  (click)="addToCart()"
                  [disabled]="cartService.isLoading()"
                  class="btn btn-primary btn-large"
                  [class.loading]="cartService.isLoading()"
                >
                  <span *ngIf="!cartService.isLoading()">
                    {{ isInCart() ? 'Agregar Más' : 'Agregar al Carrito' }}
                  </span>
                  <span *ngIf="cartService.isLoading()">Agregando...</span>
                </button>
                
                <button 
                  (click)="goBack()"
                  class="btn btn-secondary btn-large"
                >
                  Volver a la Lista
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .vehicle-detail-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .breadcrumb {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 2rem;
      font-size: 0.9rem;
    }

    .breadcrumb-link {
      color: #f39c12;
      text-decoration: none;
      transition: color 0.3s ease;
    }

    .breadcrumb-link:hover {
      color: #e67e22;
    }

    .breadcrumb-separator {
      color: #7f8c8d;
    }

    .breadcrumb-current {
      color: #bdc3c7;
    }

    .detail-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3rem;
      align-items: start;
    }

    .image-section {
      position: relative;
      background: linear-gradient(145deg, #2c3e50, #34495e);
      border-radius: 1rem;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    }

    .vehicle-image {
      width: 100%;
      height: 400px;
      object-fit: cover;
    }

    .vehicle-badge {
      position: absolute;
      top: 1rem;
      right: 1rem;
      padding: 0.5rem 1rem;
      border-radius: 1rem;
      font-size: 0.9rem;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .vehicle-badge.vehicle {
      background: linear-gradient(135deg, #27ae60, #2ecc71);
      color: white;
    }

    .vehicle-badge.starship {
      background: linear-gradient(135deg, #3498db, #2980b9);
      color: white;
    }

    .info-section {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .vehicle-header h1 {
      font-size: 2.5rem;
      font-weight: bold;
      background: linear-gradient(45deg, #f39c12, #e74c3c);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin: 0 0 0.5rem 0;
      line-height: 1.2;
    }

    .vehicle-model {
      font-size: 1.2rem;
      color: #bdc3c7;
      margin: 0 0 0.5rem 0;
      font-style: italic;
    }

    .vehicle-manufacturer {
      font-size: 1rem;
      color: #95a5a6;
      margin: 0;
    }

    .price-section {
      background: linear-gradient(135deg, rgba(243, 156, 18, 0.15), rgba(230, 126, 34, 0.15));
      border: 2px solid rgba(243, 156, 18, 0.3);
      border-radius: 1rem;
      padding: 1.5rem;
    }

    .price-display {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .price-label {
      font-size: 1.2rem;
      color: #f39c12;
      font-weight: 600;
    }

    .price-value {
      font-size: 1.5rem;
      color: #e74c3c;
      font-weight: bold;
    }

    .specs-section {
      background: rgba(52, 73, 94, 0.3);
      border-radius: 1rem;
      padding: 1.5rem;
      border: 1px solid rgba(243, 156, 18, 0.2);
    }

    .specs-title {
      color: #f39c12;
      font-size: 1.3rem;
      margin: 0 0 1rem 0;
      font-weight: 600;
    }

    .specs-grid {
      display: grid;
      gap: 1rem;
    }

    .spec-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .spec-item:last-child {
      border-bottom: none;
    }

    .spec-label {
      color: #bdc3c7;
      font-weight: 500;
    }

    .spec-value {
      color: #ecf0f1;
      font-weight: 600;
    }

    .actions-section {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .quantity-controls {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .quantity-label {
      color: #bdc3c7;
      font-weight: 500;
    }

    .quantity-input-group {
      display: flex;
      align-items: center;
      gap: 1rem;
      background: rgba(52, 73, 94, 0.5);
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      border: 1px solid rgba(243, 156, 18, 0.3);
      width: fit-content;
    }

    .quantity-btn {
      background: linear-gradient(135deg, #f39c12, #e67e22);
      color: white;
      border: none;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-weight: bold;
      font-size: 1.2rem;
      transition: all 0.3s ease;
    }

    .quantity-btn:hover:not(:disabled) {
      background: linear-gradient(135deg, #e67e22, #d35400);
      transform: scale(1.1);
    }

    .quantity-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .quantity-display {
      color: #ecf0f1;
      font-weight: bold;
      font-size: 1.1rem;
      min-width: 2rem;
      text-align: center;
    }

    .action-buttons {
      display: flex;
      gap: 1rem;
    }

    .btn {
      padding: 1rem 2rem;
      border: none;
      border-radius: 0.5rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      text-decoration: none;
      text-align: center;
      font-size: 1rem;
      flex: 1;
    }

    .btn-large {
      padding: 1.2rem 2rem;
      font-size: 1.1rem;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-primary {
      background: linear-gradient(135deg, #f39c12, #e67e22);
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background: linear-gradient(135deg, #e67e22, #d35400);
      transform: translateY(-2px);
    }

    .btn-primary.loading {
      background: linear-gradient(135deg, #95a5a6, #7f8c8d);
    }

    .btn-secondary {
      background: linear-gradient(135deg, #7f8c8d, #95a5a6);
      color: white;
    }

    .btn-secondary:hover:not(:disabled) {
      background: linear-gradient(135deg, #95a5a6, #bdc3c7);
      transform: translateY(-2px);
    }

    .error-message {
      text-align: center;
      padding: 3rem;
      background: rgba(231, 76, 60, 0.1);
      border: 1px solid rgba(231, 76, 60, 0.3);
      border-radius: 1rem;
      color: #e74c3c;
    }

    .error-message h2 {
      margin: 0 0 1rem 0;
      font-size: 1.8rem;
    }

    .error-message p {
      margin: 0 0 1.5rem 0;
      color: #bdc3c7;
    }

    @media (max-width: 968px) {
      .detail-content {
        grid-template-columns: 1fr;
        gap: 2rem;
      }
    }

    @media (max-width: 768px) {
      .vehicle-detail-container {
        padding: 1rem;
      }

      .vehicle-header h1 {
        font-size: 2rem;
      }

      .action-buttons {
        flex-direction: column;
      }

      .btn {
        flex: none;
      }
    }
  `]
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
      switchMap(params => {
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
      next: (vehicle) => {
        if (vehicle) {
          this._vehicle.set(vehicle);
        } else {
          this._error.set('Vehículo no encontrado');
        }
        this._isLoading.set(false);
      },
      error: (error) => {
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
      img.src = `https://via.placeholder.com/600x400/${fallbackColor}/ffffff?text=${encodedName}`;
    }
  }
}