import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StarWarsApiService } from '../../core/services/star-wars-api.service';
import { VehicleWithId } from '../../core/models/star-wars.interface';
import { VehicleCardComponent } from '../../shared/components/vehicle-card/vehicle-card.component';
import { LoadingComponent } from '../../shared/components/loading/loading.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, VehicleCardComponent, LoadingComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private readonly starWarsService = inject(StarWarsApiService);

  // Signals
  private readonly _featuredVehicles = signal<VehicleWithId[]>([]);
  private readonly _isLoading = signal(true);
  private readonly _error = signal<string | null>(null);

  // Public readonly signals
  readonly featuredVehicles = this._featuredVehicles.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();

  ngOnInit(): void {
    this.loadFeaturedVehicles();
  }

  loadFeaturedVehicles(): void {
    this._isLoading.set(true);
    this._error.set(null);

    this.starWarsService.getAllVehicles().subscribe({
      next: (vehicles: VehicleWithId[]) => {
        // Tomar los primeros 3 vehículos como destacados
        const featured = vehicles.slice(0, 3);
        this._featuredVehicles.set(featured);
        this._isLoading.set(false);
      },
      error: (error: unknown) => {
        console.error('Error loading featured vehicles:', error);
        this._error.set('No se pudieron cargar los vehículos destacados.');
        this._isLoading.set(false);
      }
    });
  }

  onAddToCart(vehicle: VehicleWithId): void {
    console.log('Vehículo agregado al carrito desde home:', vehicle.name);
  }

  trackByVehicle(index: number, vehicle: VehicleWithId): string {
    return `${vehicle.type}-${vehicle.id}`;
  }
}
