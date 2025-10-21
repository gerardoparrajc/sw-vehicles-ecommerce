import { Component, OnInit, computed, inject, signal } from '@angular/core';
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

  // Public readonly signals
  readonly featuredVehicles = this.starWarsService.allVehicles;
  readonly isLoading = computed(() => this.featuredVehicles().status === 'loading');
  readonly error = computed(() => this.featuredVehicles().status === 'error' ? this.featuredVehicles().error : null);

  ngOnInit(): void {
    this.loadFeaturedVehicles();
  }

  loadFeaturedVehicles(): void {
    this.starWarsService.vehicles.reload();
    this.starWarsService.starships.reload();
  }

  onAddToCart(vehicle: VehicleWithId): void {
    console.log('Vehículo agregado al carrito desde home:', vehicle.name);
  }

  trackByVehicle(index: number, vehicle: VehicleWithId): string {
    return `${vehicle.type}-${vehicle.id}`;
  }
}
