import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient, httpResource } from '@angular/common/http';
import { Observable, forkJoin, map, catchError, of } from 'rxjs';
import { SWAPIResponse, Vehicle, Starship, VehicleWithId, Film } from '../models/star-wars.interface';

@Injectable({
  providedIn: 'root'
})
export class StarWarsApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://swapi.dev/api';

  // URL de imágenes predeterminadas (placeholder images)
  private readonly defaultImages = {
    vehicle: 'https://placehold.co/400x300/1a1a1a/ffffff?text=Vehicle',
    starship: 'https://placehold.co/400x300/1a1a1a/ffffff?text=Starship'
  };

  private _page = signal<number>(1);
  public readonly page = this._page.asReadonly();

  setPage(page: number): void {
    this._page.set(page);
  }

  public readonly vehicles = httpResource<SWAPIResponse<Vehicle>>(() => `${this.baseUrl}/vehicles/?page=${this._page()}`);
  public readonly starships = httpResource<SWAPIResponse<Starship>>(() => `${this.baseUrl}/starships/?page=${this._page()}`);

  public readonly allVehicles = computed(() => {

    if (this.vehicles.status() === 'loading' || this.starships.status() === 'loading') {
      return { status: 'loading' };
    }

    if (this.vehicles.status() === 'error') {
      return { status: 'error', error: this.vehicles.error() };
    }

    if (this.starships.status() === 'error') {
      return { status: 'error', error: this.starships.error() };
    }

    const vehicles: VehicleWithId[] = this.vehicles.value()?.results.map((vehicle: Vehicle) => ({
      ...vehicle,
      id: this.extractIdFromUrl(vehicle.url),
      type: 'vehicle' as const,
      image: this.getVehicleImage(vehicle.name, 'vehicle'),
      vehicle_class: vehicle.vehicle_class
    })) || [];

    const starships: VehicleWithId[] = this.starships.value()?.results.map((starship: Starship) => ({
      ...starship,
      id: this.extractIdFromUrl(starship.url),
      type: 'starship' as const,
      image: this.getVehicleImage(starship.name, 'starship'),
      hyperdrive_rating: starship.hyperdrive_rating,
      MGLT: starship.MGLT,
      starship_class: starship.starship_class
    })) || [];

    return {
      status: 'resolved',
      value: [...vehicles, ...starships]
    };
  });

  getVehicleById(id: string, type: 'vehicle' | 'starship'): Observable<VehicleWithId | null> {
    const url = type === 'vehicle' ?
      `${this.baseUrl}/vehicles/${id}/` :
      `${this.baseUrl}/starships/${id}/`;

    return this.http.get<Vehicle | Starship>(url).pipe(
      map((vehicle: Vehicle | Starship) => ({
        ...vehicle,
        id,
        type,
        image: this.getVehicleImage(vehicle.name, type),
        ...(type === 'vehicle' && { vehicle_class: (vehicle as Vehicle).vehicle_class }),
        ...(type === 'starship' && {
          hyperdrive_rating: (vehicle as Starship).hyperdrive_rating,
          MGLT: (vehicle as Starship).MGLT,
          starship_class: (vehicle as Starship).starship_class
        })
      })),
      catchError((error: unknown) => {
        console.error(`Error fetching ${type} with id ${id}:`, error);
        return of(null);
      })
    );
  }

  getFilm(url: string): Observable<Film | null> {
    return this.http.get<Film>(url).pipe(
      catchError((error: unknown) => {
        console.error('Error fetching film:', error);
        return of(null);
      })
    );
  }

  private extractIdFromUrl(url: string): string {
    const matches = url.match(/\/(\d+)\/$/);
    return matches ? matches[1] : '';
  }

  private getVehicleImage(name: string, type: 'vehicle' | 'starship'): string {
    // En una aplicación real, aquí podrías tener un mapeo de nombres a imágenes reales
    // Por ahora usamos imágenes placeholder con el nombre del vehículo
    const encodedName = encodeURIComponent(name);
    const color = type === 'starship' ? '2c3e50' : '34495e';
    return `https://placehold.co/400x300/${color}/ffffff?text=${encodedName}`;
  }
}
