import { Component, inject } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { LoadingComponent } from '../../shared/components/loading.component';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, LoadingComponent, NgOptimizedImage],
  template: `
    <div class="cart-container">
      <div class="page-header">
        <h1 class="page-title">Carrito de Compras</h1>
        <p class="page-subtitle">
          Revisa tus vehículos seleccionados antes de proceder al checkout
        </p>
      </div>

      <div class="cart-content">
        <app-loading 
          *ngIf="cartService.isLoading()" 
          message="Actualizando carrito..."
        />

        <!-- Carrito vacío -->
        <div *ngIf="cartService.isEmpty() && !cartService.isLoading()" class="empty-cart">
          <div class="empty-cart-icon">🛒</div>
          <h2>Tu carrito está vacío</h2>
          <p>Explora nuestra colección de vehículos de Star Wars y encuentra tu favorito</p>
          <a routerLink="/vehicles" class="btn btn-primary">
            Explorar Vehículos
          </a>
        </div>

        <!-- Items del carrito -->
        <div *ngIf="!cartService.isEmpty() && !cartService.isLoading()" class="cart-items-section">
          <div class="cart-items">
            <div class="cart-item" *ngFor="let item of cartService.cartItems(); trackBy: trackByItem">
              <div class="item-image">
                <img 
                  ngSrc="{{ item.vehicle.image }}"
                  [alt]="item.vehicle.name"
                  width="120"
                  height="90"
                  class="vehicle-thumbnail"
                  (error)="onImageError($event, item.vehicle)"
                />
                <div class="item-badge" [ngClass]="item.vehicle.type">
                  {{ item.vehicle.type === 'starship' ? 'Nave' : 'Vehículo' }}
                </div>
              </div>

              <div class="item-details">
                <h3 class="item-name">{{ item.vehicle.name }}</h3>
                <p class="item-model">{{ item.vehicle.model }}</p>
                <p class="item-manufacturer">{{ item.vehicle.manufacturer }}</p>
                <p class="item-added">Agregado: {{ formatDate(item.addedAt) }}</p>
              </div>

              <div class="item-price">
                <span class="unit-price">{{ formatPrice(item.vehicle.cost_in_credits) }}</span>
                <span class="price-label">por unidad</span>
              </div>

              <div class="item-quantity">
                <div class="quantity-controls">
                  <button 
                    (click)="decreaseQuantity(item)"
                    [disabled]="cartService.isLoading()"
                    class="quantity-btn"
                    aria-label="Disminuir cantidad"
                  >
                    −
                  </button>
                  <span class="quantity-display">{{ item.quantity }}</span>
                  <button 
                    (click)="increaseQuantity(item)"
                    [disabled]="cartService.isLoading()"
                    class="quantity-btn"
                    aria-label="Aumentar cantidad"
                  >
                    +
                  </button>
                </div>
              </div>

              <div class="item-total">
                <span class="total-price">{{ formatPrice((getItemPrice(item.vehicle) * item.quantity).toString()) }}</span>
                <span class="total-label">Total</span>
              </div>

              <div class="item-actions">
                <button 
                  [routerLink]="['/vehicle', item.vehicle.type, item.vehicle.id]"
                  class="btn btn-link"
                  aria-label="Ver detalles de {{ item.vehicle.name }}"
                >
                  Ver Detalles
                </button>
                <button 
                  (click)="removeItem(item)"
                  [disabled]="cartService.isLoading()"
                  class="btn btn-danger"
                  aria-label="Eliminar {{ item.vehicle.name }} del carrito"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>

          <!-- Resumen del carrito -->
          <div class="cart-summary">
            <div class="summary-header">
              <h2>Resumen del Pedido</h2>
            </div>

            <div class="summary-details">
              <div class="summary-row">
                <span class="summary-label">Artículos ({{ cartService.itemCount() }}):</span>
                <span class="summary-value">{{ formatPrice(cartService.totalPrice().toString()) }}</span>
              </div>
              
              <div class="summary-row">
                <span class="summary-label">Envío:</span>
                <span class="summary-value shipping-free">GRATIS</span>
              </div>
              
              <div class="summary-separator"></div>
              
              <div class="summary-row total-row">
                <span class="summary-label">Total:</span>
                <span class="summary-value total-value">{{ formatPrice(cartService.totalPrice().toString()) }}</span>
              </div>
            </div>

            <div class="summary-actions">
              <button 
                (click)="clearCart()"
                [disabled]="cartService.isLoading()"
                class="btn btn-secondary btn-full"
              >
                Vaciar Carrito
              </button>
              
              <button 
                (click)="proceedToCheckout()"
                [disabled]="cartService.isLoading()"
                class="btn btn-primary btn-full"
              >
                Proceder al Checkout
              </button>
            </div>
          </div>
        </div>

        <!-- Error message -->
        <div *ngIf="cartService.error()" class="error-message">
          <h3>Error en el carrito</h3>
          <p>{{ cartService.error() }}</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .cart-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .page-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .page-title {
      font-size: 2.5rem;
      font-weight: bold;
      background: linear-gradient(45deg, #f39c12, #e74c3c);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin: 0 0 1rem 0;
    }

    .page-subtitle {
      font-size: 1.1rem;
      color: #bdc3c7;
      margin: 0;
      max-width: 600px;
      margin: 0 auto;
      line-height: 1.5;
    }

    .empty-cart {
      text-align: center;
      padding: 4rem 2rem;
      background: rgba(52, 73, 94, 0.3);
      border-radius: 1rem;
      border: 1px solid rgba(243, 156, 18, 0.2);
    }

    .empty-cart-icon {
      font-size: 4rem;
      margin-bottom: 2rem;
      opacity: 0.7;
    }

    .empty-cart h2 {
      color: #f39c12;
      margin: 0 0 1rem 0;
      font-size: 1.8rem;
    }

    .empty-cart p {
      color: #bdc3c7;
      margin: 0 0 2rem 0;
      font-size: 1.1rem;
      line-height: 1.5;
    }

    .cart-items-section {
      display: grid;
      grid-template-columns: 1fr 350px;
      gap: 3rem;
      align-items: start;
    }

    .cart-items {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .cart-item {
      display: grid;
      grid-template-columns: 140px 1fr auto auto auto auto;
      gap: 1.5rem;
      align-items: center;
      background: linear-gradient(145deg, #2c3e50, #34495e);
      border-radius: 1rem;
      padding: 1.5rem;
      border: 1px solid rgba(243, 156, 18, 0.2);
      transition: all 0.3s ease;
    }

    .cart-item:hover {
      border-color: rgba(243, 156, 18, 0.4);
      transform: translateY(-2px);
    }

    .item-image {
      position: relative;
    }

    .vehicle-thumbnail {
      width: 120px;
      height: 90px;
      object-fit: cover;
      border-radius: 0.5rem;
    }

    .item-badge {
      position: absolute;
      top: -5px;
      right: -5px;
      padding: 0.2rem 0.5rem;
      border-radius: 0.5rem;
      font-size: 0.7rem;
      font-weight: bold;
      text-transform: uppercase;
    }

    .item-badge.vehicle {
      background: linear-gradient(135deg, #27ae60, #2ecc71);
      color: white;
    }

    .item-badge.starship {
      background: linear-gradient(135deg, #3498db, #2980b9);
      color: white;
    }

    .item-details {
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
    }

    .item-name {
      font-size: 1.2rem;
      font-weight: bold;
      color: #f39c12;
      margin: 0;
    }

    .item-model {
      color: #bdc3c7;
      margin: 0;
      font-style: italic;
    }

    .item-manufacturer {
      color: #95a5a6;
      font-size: 0.9rem;
      margin: 0;
    }

    .item-added {
      color: #7f8c8d;
      font-size: 0.8rem;
      margin: 0;
    }

    .item-price {
      text-align: center;
    }

    .unit-price {
      display: block;
      color: #e74c3c;
      font-weight: bold;
      font-size: 1rem;
    }

    .price-label {
      color: #95a5a6;
      font-size: 0.8rem;
    }

    .quantity-controls {
      display: flex;
      align-items: center;
      gap: 0.8rem;
      background: rgba(0, 0, 0, 0.2);
      padding: 0.5rem;
      border-radius: 0.5rem;
      border: 1px solid rgba(243, 156, 18, 0.3);
    }

    .quantity-btn {
      background: linear-gradient(135deg, #f39c12, #e67e22);
      color: white;
      border: none;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-weight: bold;
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
      min-width: 1.5rem;
      text-align: center;
    }

    .item-total {
      text-align: center;
    }

    .total-price {
      display: block;
      color: #f39c12;
      font-weight: bold;
      font-size: 1.1rem;
    }

    .total-label {
      color: #95a5a6;
      font-size: 0.8rem;
    }

    .item-actions {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .cart-summary {
      background: linear-gradient(145deg, #2c3e50, #34495e);
      border-radius: 1rem;
      padding: 2rem;
      border: 2px solid rgba(243, 156, 18, 0.3);
      position: sticky;
      top: 2rem;
    }

    .summary-header h2 {
      color: #f39c12;
      margin: 0 0 1.5rem 0;
      font-size: 1.5rem;
      text-align: center;
    }

    .summary-details {
      margin-bottom: 2rem;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .summary-row:last-child {
      margin-bottom: 0;
    }

    .summary-label {
      color: #bdc3c7;
      font-weight: 500;
    }

    .summary-value {
      color: #ecf0f1;
      font-weight: 600;
    }

    .shipping-free {
      color: #27ae60;
      font-weight: bold;
    }

    .summary-separator {
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(243, 156, 18, 0.5), transparent);
      margin: 1.5rem 0;
    }

    .total-row {
      border-top: 2px solid rgba(243, 156, 18, 0.3);
      padding-top: 1rem;
      margin-top: 1rem;
    }

    .total-row .summary-label {
      color: #f39c12;
      font-size: 1.2rem;
      font-weight: bold;
    }

    .total-value {
      color: #e74c3c;
      font-size: 1.3rem;
      font-weight: bold;
    }

    .summary-actions {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .btn {
      padding: 0.8rem 1.5rem;
      border: none;
      border-radius: 0.5rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      text-decoration: none;
      text-align: center;
      font-size: 0.9rem;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-full {
      width: 100%;
    }

    .btn-primary {
      background: linear-gradient(135deg, #f39c12, #e67e22);
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background: linear-gradient(135deg, #e67e22, #d35400);
      transform: translateY(-2px);
    }

    .btn-secondary {
      background: linear-gradient(135deg, #7f8c8d, #95a5a6);
      color: white;
    }

    .btn-secondary:hover:not(:disabled) {
      background: linear-gradient(135deg, #95a5a6, #bdc3c7);
      transform: translateY(-2px);
    }

    .btn-danger {
      background: linear-gradient(135deg, #e74c3c, #c0392b);
      color: white;
      font-size: 0.8rem;
      padding: 0.6rem 1rem;
    }

    .btn-danger:hover:not(:disabled) {
      background: linear-gradient(135deg, #c0392b, #a93226);
      transform: translateY(-2px);
    }

    .btn-link {
      background: transparent;
      color: #3498db;
      border: 1px solid #3498db;
      font-size: 0.8rem;
      padding: 0.6rem 1rem;
    }

    .btn-link:hover:not(:disabled) {
      background: rgba(52, 152, 219, 0.1);
      color: #2980b9;
    }

    .error-message {
      text-align: center;
      padding: 2rem;
      background: rgba(231, 76, 60, 0.1);
      border: 1px solid rgba(231, 76, 60, 0.3);
      border-radius: 1rem;
      color: #e74c3c;
      margin-top: 2rem;
    }

    .error-message h3 {
      margin: 0 0 1rem 0;
    }

    .error-message p {
      margin: 0;
      color: #bdc3c7;
    }

    @media (max-width: 1024px) {
      .cart-items-section {
        grid-template-columns: 1fr;
        gap: 2rem;
      }
    }

    @media (max-width: 768px) {
      .cart-container {
        padding: 1rem;
      }

      .page-title {
        font-size: 2rem;
      }

      .cart-item {
        grid-template-columns: 1fr;
        gap: 1rem;
        text-align: center;
      }

      .item-details {
        text-align: left;
      }

      .item-actions {
        flex-direction: row;
        justify-content: center;
      }
    }
  `]
})
export class CartComponent {
  readonly cartService = inject(CartService);

  trackByItem(index: number, item: any): string {
    return `${item.vehicle.type}-${item.vehicle.id}`;
  }

  increaseQuantity(item: any): void {
    this.cartService.updateQuantity(item.vehicle.id, item.vehicle.type, item.quantity + 1);
  }

  decreaseQuantity(item: any): void {
    if (item.quantity > 1) {
      this.cartService.updateQuantity(item.vehicle.id, item.vehicle.type, item.quantity - 1);
    } else {
      this.removeItem(item);
    }
  }

  removeItem(item: any): void {
    this.cartService.removeFromCart(item.vehicle.id, item.vehicle.type);
  }

  clearCart(): void {
    if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
      this.cartService.clearCart();
    }
  }

  proceedToCheckout(): void {
    // En una aplicación real, aquí redirigiríamos a la página de checkout
    alert('Funcionalidad de checkout no implementada en esta demo. ¡Gracias por tu interés!');
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

  getItemPrice(vehicle: any): number {
    const credits = vehicle.cost_in_credits;
    if (credits === 'unknown' || !credits) {
      return 10000;
    }
    return parseInt(credits.replace(/,/g, ''), 10) || 10000;
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('es-ES', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }

  onImageError(event: Event, vehicle: any): void {
    const img = event.target as HTMLImageElement;
    const fallbackColor = vehicle.type === 'starship' ? '2c3e50' : '34495e';
    const encodedName = encodeURIComponent(vehicle.name);
    img.src = `https://via.placeholder.com/120x90/${fallbackColor}/ffffff?text=${encodedName}`;
  }
}