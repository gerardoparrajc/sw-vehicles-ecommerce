import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StarWarsApiService } from '../../../core/services/star-wars-api.service';
import { VehicleWithId } from '../../../core/models/star-wars.interface';
import { VehicleCardComponent } from '../../../shared/components/vehicle-card/vehicle-card.component';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';

@Component({
  selector: 'app-vehicles-list',
  standalone: true,
  imports: [CommonModule, VehicleCardComponent, LoadingComponent],
  templateUrl: './vehicles-list.component.html',
  styleUrls: ['./vehicles-list.component.css']
})
export class VehiclesListComponent implements OnInit {
  private readonly starWarsService = inject(StarWarsApiService);

  // Signals
  private readonly _allVehicles = signal<VehicleWithId[]>([]);
  private readonly _isLoading = signal(true);
  private readonly _error = signal<string | null>(null);
  private readonly _currentFilter = signal<'all' | 'vehicle' | 'starship'>('all');
  private readonly _searchTerm = signal('');

  // Public readonly signals
  readonly allVehicles = this._allVehicles.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly currentFilter = this._currentFilter.asReadonly();
  readonly searchTerm = this._searchTerm.asReadonly();

  // Computed signals
  readonly vehicleCount = computed(() =>
    this._allVehicles().filter((v: VehicleWithId) => v.type === 'vehicle').length
  );

  readonly starshipCount = computed(() =>
    this._allVehicles().filter((v: VehicleWithId) => v.type === 'starship').length
  );

  readonly filteredVehicles = computed(() => {
    let vehicles = this._allVehicles();

    // Filtrar por tipo
    if (this._currentFilter() !== 'all') {
      vehicles = vehicles.filter((v: VehicleWithId) => v.type === this._currentFilter());
    }

    // Filtrar por búsqueda
    const search = this._searchTerm().toLowerCase().trim();
    if (search) {
      vehicles = vehicles.filter((v: VehicleWithId) =>
        v.name.toLowerCase().includes(search) ||
        v.model.toLowerCase().includes(search) ||
        v.manufacturer.toLowerCase().includes(search)
      );
    }

    return vehicles;
  });

  ngOnInit(): void {
    this.loadVehicles();
  }

  loadVehicles(): void {
    this._isLoading.set(true);
    this._error.set(null);

    this.starWarsService.getAllVehicles().subscribe({
      next: (vehicles: VehicleWithId[]) => {
        this._allVehicles.set(vehicles);
        this._isLoading.set(false);
      },
      error: (error: unknown) => {
        console.error('Error loading vehicles:', error);
        this._error.set('No se pudieron cargar los vehículos. Por favor, inténtalo de nuevo.');
        this._isLoading.set(false);
      }
    });
  }

  setFilter(filter: 'all' | 'vehicle' | 'starship'): void {
    this._currentFilter.set(filter);
  }

  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this._searchTerm.set(input.value);
  }

  onAddToCart(vehicle: VehicleWithId): void {
    // Feedback visual opcional aquí
    console.log('Vehículo agregado al carrito:', vehicle.name);
  }

  trackByVehicle(index: number, vehicle: VehicleWithId): string {
    return `${vehicle.type}-${vehicle.id}`;
  }
}
