import { VehicleWithId } from './star-wars.interface';

export interface CartItem {
  vehicle: VehicleWithId;
  quantity: number;
  addedAt: Date;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}

export interface CartState {
  cart: Cart;
  isLoading: boolean;
  error: string | null;
}
