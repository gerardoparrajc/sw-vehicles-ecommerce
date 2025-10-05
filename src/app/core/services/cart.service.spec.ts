import { TestBed } from '@angular/core/testing';
import { CartService } from './cart.service';
import { VehicleWithId } from '../models/star-wars.interface';

describe('CartService', () => {
  let service: CartService;

  const mockVehicle: VehicleWithId = {
    id: '4',
    type: 'vehicle',
    name: 'Sand Crawler',
    model: 'Digger Crawler',
    manufacturer: 'Corellia Mining Corporation',
    cost_in_credits: '150000',
    length: '36.8',
    max_atmosphering_speed: '30',
    crew: '46',
    passengers: '30',
    cargo_capacity: '50000',
    consumables: '2 months',
    pilots: [],
    films: ['https://swapi.dev/api/films/1/'],
    created: '2014-12-10T15:36:25.724000Z',
    edited: '2014-12-20T21:30:21.661000Z',
    url: 'https://swapi.dev/api/vehicles/4/',
    vehicle_class: 'wheeled'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CartService]
    });
    service = TestBed.inject(CartService);

    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with empty cart', () => {
    expect(service.cartItems().length).toBe(0);
    expect(service.isEmpty()).toBe(true);
    expect(service.totalPrice()).toBe(0);
    expect(service.itemCount()).toBe(0);
  });

  it('should add item to cart', () => {
    service.addToCart(mockVehicle);

    expect(service.cartItems().length).toBe(1);
    expect(service.cartItems()[0].vehicle.id).toBe('4');
    expect(service.cartItems()[0].quantity).toBe(1);
    expect(service.isEmpty()).toBe(false);
    expect(service.itemCount()).toBe(1);
  });

  it('should increase quantity when adding existing item', () => {
    service.addToCart(mockVehicle);
    service.addToCart(mockVehicle);

    expect(service.cartItems().length).toBe(1);
    expect(service.cartItems()[0].quantity).toBe(2);
    expect(service.itemCount()).toBe(2);
  });

  it('should remove item from cart', () => {
    service.addToCart(mockVehicle);
    expect(service.cartItems().length).toBe(1);

    service.removeFromCart('4', 'vehicle');
    expect(service.cartItems().length).toBe(0);
    expect(service.isEmpty()).toBe(true);
  });

  it('should update item quantity', () => {
    service.addToCart(mockVehicle);
    service.updateQuantity('4', 'vehicle', 3);

    expect(service.cartItems()[0].quantity).toBe(3);
    expect(service.itemCount()).toBe(3);
  });

  it('should remove item when quantity is set to 0', () => {
    service.addToCart(mockVehicle);
    service.updateQuantity('4', 'vehicle', 0);

    expect(service.cartItems().length).toBe(0);
    expect(service.isEmpty()).toBe(true);
  });

  it('should clear cart', () => {
    service.addToCart(mockVehicle);
    expect(service.cartItems().length).toBe(1);

    service.clearCart();
    expect(service.cartItems().length).toBe(0);
    expect(service.isEmpty()).toBe(true);
  });

  it('should check if item is in cart', () => {
    expect(service.isInCart('4', 'vehicle')).toBe(false);

    service.addToCart(mockVehicle);
    expect(service.isInCart('4', 'vehicle')).toBe(true);
  });

  it('should get item quantity', () => {
    expect(service.getItemQuantity('4', 'vehicle')).toBe(0);

    service.addToCart(mockVehicle, 3);
    expect(service.getItemQuantity('4', 'vehicle')).toBe(3);
  });

  it('should calculate total price correctly', () => {
    service.addToCart(mockVehicle, 2);
    expect(service.totalPrice()).toBe(300000); // 150000 * 2
  });
});
