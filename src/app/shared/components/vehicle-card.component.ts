import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterModule } from '@angular/router';
import { VehicleWithId } from '../../core/models/star-wars.interface';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-vehicle-card',
  standalone: true,
  imports: [CommonModule, RouterModule, NgOptimizedImage],
  template: `
    <div class="vehicle-card">
      <div class="card-image">
        <img
          ngSrc="{{ vehicle.image }}"
          [alt]="vehicle.name"
          width="400"
          height="300"
          priority="false"
          class="vehicle-img"
          (error)="onImageError($event)"
        />
        <div class="card-badge" [ngClass]="vehicle.type">
          {{ vehicle.type === 'starship' ? 'Nave Espacial' : 'Vehículo' }}
        </div>
      </div>

      <div class="card-content">
        <h3 class="card-title">{{ vehicle.name }}</h3>
        <p class="card-model">{{ vehicle.model }}</p>
        <p class="card-manufacturer">{{ vehicle.manufacturer }}</p>

        <div class="card-specs">
          <div class="spec-item">
            <span class="spec-label">Tripulación:</span>
            <span class="spec-value">{{ vehicle.crew }}</span>
          </div>
          <div class="spec-item">
            <span class="spec-label">Pasajeros:</span>
            <span class="spec-value">{{ vehicle.passengers }}</span>
          </div>
          <div class="spec-item" *ngIf="vehicle.type === 'starship' && vehicle.hyperdrive_rating">
            <span class="spec-label">Hiperimpulsor:</span>
            <span class="spec-value">{{ vehicle.hyperdrive_rating }}</span>
          </div>
        </div>

        <div class="card-price">
          <span class="price-label">Precio:</span>
          <span class="price-value">{{ formatPrice(vehicle.cost_in_credits) }}</span>
        </div>

        <div class="card-actions">
          <button
            [routerLink]="['/vehicle', vehicle.type, vehicle.id]"
            class="btn btn-secondary"
            aria-label="Ver detalles de {{ vehicle.name }}"
          >
            Ver Detalles
          </button>

          <button
            (click)="addToCart()"
            [disabled]="cartService.isLoading()"
            class="btn btn-primary"
            [class.loading]="cartService.isLoading()"
            aria-label="Agregar {{ vehicle.name }} al carrito"
          >
            <span *ngIf="!cartService.isLoading()">
              {{ isInCart() ? 'En Carrito ✓' : 'Agregar al Carrito' }}
            </span>
            <span *ngIf="cartService.isLoading()">Agregando...</span>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .vehicle-card {
      background: linear-gradient(145deg, #2c3e50, #34495e);
      border-radius: 1rem;
      overflow: hidden;
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
      transition: all 0.3s ease;
      border: 1px solid rgba(243, 156, 18, 0.2);
    }

    .vehicle-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
      border-color: rgba(243, 156, 18, 0.5);
    }

    .card-image {
      position: relative;
      overflow: hidden;
    }

    .vehicle-img {
      width: 100%;
      height: 250px;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .vehicle-card:hover .vehicle-img {
      transform: scale(1.05);
    }

    .card-badge {
      position: absolute;
      top: 1rem;
      right: 1rem;
      padding: 0.4rem 0.8rem;
      border-radius: 1rem;
      font-size: 0.8rem;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .card-badge.vehicle {
      background: linear-gradient(135deg, #27ae60, #2ecc71);
      color: white;
    }

    .card-badge.starship {
      background: linear-gradient(135deg, #3498db, #2980b9);
      color: white;
    }

    .card-content {
      padding: 1.5rem;
    }

    .card-title {
      font-size: 1.3rem;
      font-weight: bold;
      color: #f39c12;
      margin: 0 0 0.5rem 0;
      line-height: 1.2;
    }

    .card-model {
      color: #bdc3c7;
      font-size: 0.95rem;
      margin: 0 0 0.3rem 0;
      font-style: italic;
    }

    .card-manufacturer {
      color: #95a5a6;
      font-size: 0.85rem;
      margin: 0 0 1rem 0;
    }

    .card-specs {
      background: rgba(0, 0, 0, 0.2);
      border-radius: 0.5rem;
      padding: 1rem;
      margin-bottom: 1rem;
    }

    .spec-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
    }

    .spec-item:last-child {
      margin-bottom: 0;
    }

    .spec-label {
      color: #bdc3c7;
      font-size: 0.85rem;
    }

    .spec-value {
      color: #ecf0f1;
      font-weight: 500;
      font-size: 0.85rem;
    }

    .card-price {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      padding: 0.8rem;
      background: linear-gradient(135deg, rgba(243, 156, 18, 0.1), rgba(230, 126, 34, 0.1));
      border-radius: 0.5rem;
      border: 1px solid rgba(243, 156, 18, 0.3);
    }

    .price-label {
      color: #f39c12;
      font-weight: 600;
    }

    .price-value {
      color: #e74c3c;
      font-weight: bold;
      font-size: 1.1rem;
    }

    .card-actions {
      display: flex;
      gap: 0.8rem;
      flex-wrap: wrap;
    }

    .btn {
      flex: 1;
      padding: 0.8rem 1rem;
      border: none;
      border-radius: 0.5rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      text-decoration: none;
      text-align: center;
      font-size: 0.9rem;
      min-width: 120px;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-secondary {
      background: linear-gradient(135deg, #7f8c8d, #95a5a6);
      color: white;
    }

    .btn-secondary:hover:not(:disabled) {
      background: linear-gradient(135deg, #95a5a6, #bdc3c7);
      transform: translateY(-2px);
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

    @media (max-width: 768px) {
      .card-content {
        padding: 1rem;
      }

      .card-actions {
        flex-direction: column;
      }

      .btn {
        min-width: unset;
      }
    }
  `]
})
export class VehicleCardComponent {
  @Input({ required: true }) vehicle!: VehicleWithId;
  @Output() addToCartClick = new EventEmitter<VehicleWithId>();

  readonly cartService = inject(CartService);

  addToCart(): void {
    this.cartService.addToCart(this.vehicle);
    this.addToCartClick.emit(this.vehicle);
  }

  isInCart(): boolean {
    return this.cartService.isInCart(this.vehicle.id, this.vehicle.type);
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
    const fallbackColor = this.vehicle.type === 'starship' ? '2c3e50' : '34495e';
    const encodedName = encodeURIComponent(this.vehicle.name);
    img.src = `https://via.placeholder.com/400x300/${fallbackColor}/ffffff?text=${encodedName}`;
  }
}
