import { Injectable, signal, computed, effect, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CartItem, Cart } from '../models/cart.interface';
import { VehicleWithId } from '../models/star-wars.interface';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  // Signals privados
  private readonly _cartItems = signal<CartItem[]>([]);
  private readonly _isLoading = signal(false);
  private readonly _error = signal<string | null>(null);

  // Signals públicos computados
  readonly cartItems = this._cartItems.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();

  readonly cart = computed<Cart>(() => {
    const items = this._cartItems();
    const total = items.reduce((sum: number, item: CartItem) => {
      const price = this.getVehiclePrice(item.vehicle);
      return sum + (price * item.quantity);
    }, 0);

    const itemCount = items.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);

    return {
      items,
      total,
      itemCount
    };
  });

  readonly isEmpty = computed(() => this._cartItems().length === 0);
  readonly totalPrice = computed(() => this.cart().total);
  readonly itemCount = computed(() => this.cart().itemCount);

  private readonly platformId = inject(PLATFORM_ID);

  constructor() {
    // Cargar carrito desde localStorage al inicializar
    this.loadCartFromStorage();

    // Efecto para guardar el carrito en localStorage cuando cambie
    effect(() => {
      const items = this._cartItems();
      this.saveCartToStorage(items);
    });
  }

  addToCart(vehicle: VehicleWithId, quantity: number = 1): void {
    try {
      this._isLoading.set(true);
      this._error.set(null);

      const currentItems = this._cartItems();
      const existingItemIndex = currentItems.findIndex(
        (item: CartItem) => item.vehicle.id === vehicle.id && item.vehicle.type === vehicle.type
      );

      if (existingItemIndex >= 0) {
        // Actualizar cantidad del item existente
        const updatedItems = [...currentItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity
        };
        this._cartItems.set(updatedItems);
      } else {
        // Agregar nuevo item
        const newItem: CartItem = {
          vehicle,
          quantity,
          addedAt: new Date()
        };
        this._cartItems.set([...currentItems, newItem]);
      }
    } catch (error) {
      this._error.set('Error al agregar el producto al carrito');
      console.error('Error adding to cart:', error);
    } finally {
      this._isLoading.set(false);
    }
  }

  removeFromCart(vehicleId: string, vehicleType: 'vehicle' | 'starship'): void {
    try {
      this._isLoading.set(true);
      this._error.set(null);

      const updatedItems = this._cartItems().filter(
        (item: CartItem) => !(item.vehicle.id === vehicleId && item.vehicle.type === vehicleType)
      );
      this._cartItems.set(updatedItems);
    } catch (error) {
      this._error.set('Error al eliminar el producto del carrito');
      console.error('Error removing from cart:', error);
    } finally {
      this._isLoading.set(false);
    }
  }

  updateQuantity(vehicleId: string, vehicleType: 'vehicle' | 'starship', quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(vehicleId, vehicleType);
      return;
    }

    try {
      this._isLoading.set(true);
      this._error.set(null);

      const currentItems = this._cartItems();
      const updatedItems = currentItems.map((item: CartItem) => {
        if (item.vehicle.id === vehicleId && item.vehicle.type === vehicleType) {
          return { ...item, quantity };
        }
        return item;
      });

      this._cartItems.set(updatedItems);
    } catch (error) {
      this._error.set('Error al actualizar la cantidad');
      console.error('Error updating quantity:', error);
    } finally {
      this._isLoading.set(false);
    }
  }

  clearCart(): void {
    try {
      this._isLoading.set(true);
      this._error.set(null);
      this._cartItems.set([]);
    } catch (error) {
      this._error.set('Error al vaciar el carrito');
      console.error('Error clearing cart:', error);
    } finally {
      this._isLoading.set(false);
    }
  }

  isInCart(vehicleId: string, vehicleType: 'vehicle' | 'starship'): boolean {
    return this._cartItems().some(
      (item: CartItem) => item.vehicle.id === vehicleId && item.vehicle.type === vehicleType
    );
  }

  getItemQuantity(vehicleId: string, vehicleType: 'vehicle' | 'starship'): number {
    const item = this._cartItems().find(
      (item: CartItem) => item.vehicle.id === vehicleId && item.vehicle.type === vehicleType
    );
    return item?.quantity || 0;
  }

  private getVehiclePrice(vehicle: VehicleWithId): number {
    const credits = vehicle.cost_in_credits;
    if (credits === 'unknown' || !credits) {
      return 10000; // Precio por defecto
    }
    return parseInt(credits.replace(/,/g, ''), 10) || 10000;
  }

  private saveCartToStorage(items: CartItem[]): void {
    if (!this.isBrowser()) return; // Evitar SSR
    try {
      localStorage.setItem('sw-cart', JSON.stringify(items));
    } catch (error) {
      // Silenciar en SSR u otros contextos restringidos
      if (this.isBrowser()) {
        console.error('Error saving cart to storage:', error);
      }
    }
  }

  private loadCartFromStorage(): void {
    if (!this.isBrowser()) return; // Evitar SSR
    try {
      const stored = localStorage.getItem('sw-cart');
      if (stored) {
        const items: CartItem[] = JSON.parse(stored);
        // Reconvertir las fechas desde string
        const itemsWithDates = items.map(item => ({
          ...item,
          addedAt: new Date(item.addedAt)
        }));
        this._cartItems.set(itemsWithDates);
      }
    } catch (error) {
      if (this.isBrowser()) {
        console.error('Error loading cart from storage:', error);
      }
      this._cartItems.set([]);
    }
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId) && typeof localStorage !== 'undefined';
  }
}
