import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HeaderComponent } from './header/header.component';
import { CartService } from '../../core/services/cart.service';
import { signal } from '@angular/core';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let mockCartService: jasmine.SpyObj<CartService>;

  beforeEach(async () => {
    // Create a spy object for CartService
    mockCartService = jasmine.createSpyObj('CartService', [], {
      itemCount: signal(0),
      isLoading: signal(false)
    });

    await TestBed.configureTestingModule({
      imports: [HeaderComponent, RouterTestingModule],
      providers: [
        { provide: CartService, useValue: mockCartService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the brand name', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.brand-text')?.textContent).toContain('SW Vehicles');
  });

  it('should display navigation links', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const navLinks = compiled.querySelectorAll('.nav-link');

    expect(navLinks.length).toBeGreaterThan(0);
    expect(compiled.textContent).toContain('Vehículos');
    expect(compiled.textContent).toContain('Naves Espaciales');
    expect(compiled.textContent).toContain('Carrito');
  });

  it('should not show cart count when cart is empty', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const cartCount = compiled.querySelector('.cart-count');

    expect(cartCount).toBeFalsy();
  });

  it('should show cart count when cart has items', () => {
    // Update the mock to return a count > 0
    (mockCartService.itemCount as any).set(3);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const cartCount = compiled.querySelector('.cart-count');

    expect(cartCount).toBeTruthy();
    expect(cartCount?.textContent?.trim()).toBe('3');
  });
});
