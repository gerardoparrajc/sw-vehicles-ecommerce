import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterModule } from '@angular/router';
import { VehicleWithId } from '../../../core/models/star-wars.interface';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-vehicle-card',
  standalone: true,
  imports: [CommonModule, RouterModule, NgOptimizedImage],
  templateUrl: './vehicle-card.component.html',
  styleUrls: ['./vehicle-card.component.css']
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
    img.src = `https://placehold.co/400x300/${fallbackColor}/ffffff?text=${encodedName}`;
  }
}
