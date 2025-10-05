import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StarWarsApiService } from '../../core/services/star-wars-api.service';
import { VehicleWithId } from '../../core/models/star-wars.interface';
import { VehicleCardComponent } from '../../shared/components/vehicle-card.component';
import { LoadingComponent } from '../../shared/components/loading.component';

@Component({
  selector: 'app-vehicles-list',
  standalone: true,
  imports: [CommonModule, VehicleCardComponent, LoadingComponent],
  template: `
  <div class="vehicles-container" data-cy="vehicles-page">
      <div class="page-header">
        <h1 class="page-title">Vehículos de Star Wars</h1>
        <p class="page-subtitle">
          Explora nuestra colección de vehículos y naves espaciales del universo de Star Wars
        </p>
      </div>

      <div class="filters-section">
        <div class="filter-controls">
          <button
            (click)="setFilter('all')"
            [class.active]="currentFilter() === 'all'"
            class="filter-btn"
            data-cy="filter-all"
          >
            Todos ({{ allVehicles().length }})
          </button>
          <button
            (click)="setFilter('vehicle')"
            [class.active]="currentFilter() === 'vehicle'"
            class="filter-btn"
            data-cy="filter-vehicle"
          >
            Vehículos ({{ vehicleCount() }})
          </button>
          <button
            (click)="setFilter('starship')"
            [class.active]="currentFilter() === 'starship'"
            class="filter-btn"
            data-cy="filter-starship"
          >
            Naves Espaciales ({{ starshipCount() }})
          </button>
        </div>

        <div class="search-section">
          <input
            type="text"
            placeholder="Buscar vehículos..."
            class="search-input"
            [value]="searchTerm()"
            (input)="onSearchChange($event)"
            data-cy="search-input"
          />
        </div>
      </div>

      <div class="content-section">
        <app-loading
          *ngIf="isLoading()"
          message="Cargando vehículos de Star Wars..."
        />

  <div *ngIf="error()" class="error-message" data-cy="error-message">
          <h3>Error al cargar los vehículos</h3>
          <p>{{ error() }}</p>
          <button (click)="loadVehicles()" class="retry-btn">
            Reintentar
          </button>
        </div>

  <div *ngIf="!isLoading() && !error() && filteredVehicles().length === 0" class="no-results" data-cy="no-results">
          <h3>No se encontraron vehículos</h3>
          <p *ngIf="searchTerm()">
            No hay vehículos que coincidan con "{{ searchTerm() }}"
          </p>
          <p *ngIf="!searchTerm() && currentFilter() !== 'all'">
            No hay vehículos de tipo "{{ currentFilter() }}"
          </p>
        </div>

        <div
          *ngIf="!isLoading() && !error() && filteredVehicles().length > 0"
          class="vehicles-grid"
          data-cy="vehicles-grid"
        >
          <app-vehicle-card
            *ngFor="let vehicle of filteredVehicles(); trackBy: trackByVehicle"
            [vehicle]="vehicle"
            (addToCartClick)="onAddToCart($event)"
          />
        </div>
      </div>
    </div>
  `,
  styles: [`
    .vehicles-container {
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

    .filters-section {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      margin-bottom: 2rem;
      background: rgba(52, 73, 94, 0.3);
      padding: 1.5rem;
      border-radius: 1rem;
      border: 1px solid rgba(243, 156, 18, 0.2);
    }

    .filter-controls {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
      justify-content: center;
    }

    .filter-btn {
      padding: 0.8rem 1.5rem;
      border: 2px solid rgba(243, 156, 18, 0.3);
      background: transparent;
      color: #bdc3c7;
      border-radius: 0.5rem;
      cursor: pointer;
      transition: all 0.3s ease;
      font-weight: 500;
    }

    .filter-btn:hover {
      border-color: rgba(243, 156, 18, 0.6);
      color: #f39c12;
      background: rgba(243, 156, 18, 0.1);
    }

    .filter-btn.active {
      border-color: #f39c12;
      background: linear-gradient(135deg, #f39c12, #e67e22);
      color: white;
    }

    .search-section {
      display: flex;
      justify-content: center;
    }

    .search-input {
      width: 100%;
      max-width: 400px;
      padding: 1rem 1.5rem;
      border: 2px solid rgba(243, 156, 18, 0.3);
      background: rgba(0, 0, 0, 0.2);
      color: #ecf0f1;
      border-radius: 0.5rem;
      font-size: 1rem;
      transition: all 0.3s ease;
    }

    .search-input:focus {
      outline: none;
      border-color: #f39c12;
      background: rgba(0, 0, 0, 0.4);
    }

    .search-input::placeholder {
      color: #7f8c8d;
    }

    .content-section {
      min-height: 400px;
    }

    .vehicles-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 2rem;
      margin-top: 2rem;
    }

    .error-message {
      text-align: center;
      padding: 3rem;
      background: rgba(231, 76, 60, 0.1);
      border: 1px solid rgba(231, 76, 60, 0.3);
      border-radius: 1rem;
      color: #e74c3c;
    }

    .error-message h3 {
      margin: 0 0 1rem 0;
      font-size: 1.5rem;
    }

    .error-message p {
      margin: 0 0 1.5rem 0;
      color: #bdc3c7;
    }

    .retry-btn {
      padding: 0.8rem 2rem;
      background: linear-gradient(135deg, #e74c3c, #c0392b);
      color: white;
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s ease;
    }

    .retry-btn:hover {
      background: linear-gradient(135deg, #c0392b, #a93226);
      transform: translateY(-2px);
    }

    .no-results {
      text-align: center;
      padding: 3rem;
      color: #bdc3c7;
    }

    .no-results h3 {
      margin: 0 0 1rem 0;
      color: #f39c12;
    }

    .no-results p {
      margin: 0;
      font-size: 1.1rem;
    }

    @media (max-width: 768px) {
      .vehicles-container {
        padding: 1rem;
      }

      .page-title {
        font-size: 2rem;
      }

      .filters-section {
        padding: 1rem;
      }

      .filter-controls {
        justify-content: stretch;
      }

      .filter-btn {
        flex: 1;
        min-width: 0;
      }

      .vehicles-grid {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }
    }
  `]
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
