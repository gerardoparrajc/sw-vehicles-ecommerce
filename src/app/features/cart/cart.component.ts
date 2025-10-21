import { Component, inject } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { LoadingComponent } from '../../shared/components/loading/loading.component';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, LoadingComponent, NgOptimizedImage],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
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
    img.src = `https://placehold.co/120x90/${fallbackColor}/ffffff?text=${encodedName}`;
  }
}
