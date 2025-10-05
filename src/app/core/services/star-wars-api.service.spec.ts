import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { StarWarsApiService } from './star-wars-api.service';
import { SWAPIResponse, Vehicle, Starship } from '../models/star-wars.interface';

describe('StarWarsApiService', () => {
  let service: StarWarsApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [StarWarsApiService]
    });
    service = TestBed.inject(StarWarsApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch vehicles', () => {
    const mockResponse: SWAPIResponse<Vehicle> = {
      count: 1,
      next: null,
      previous: null,
      results: [{
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
        vehicle_class: 'wheeled',
        pilots: [],
        films: ['https://swapi.dev/api/films/1/'],
        created: '2014-12-10T15:36:25.724000Z',
        edited: '2014-12-20T21:30:21.661000Z',
        url: 'https://swapi.dev/api/vehicles/4/'
      }]
    };

    service.getVehicles().subscribe(response => {
      expect(response).toEqual(mockResponse);
      expect(response.results.length).toBe(1);
      expect(response.results[0].name).toBe('Sand Crawler');
    });

    const req = httpMock.expectOne('https://swapi.dev/api/vehicles/?page=1');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch starships', () => {
    const mockResponse: SWAPIResponse<Starship> = {
      count: 1,
      next: null,
      previous: null,
      results: [{
        name: 'Death Star',
        model: 'DS-1 Orbital Battle Station',
        manufacturer: 'Imperial Department of Military Research',
        cost_in_credits: '1000000000000',
        length: '120000',
        max_atmosphering_speed: 'n/a',
        crew: '342953',
        passengers: '843342',
        cargo_capacity: '1000000000000',
        consumables: '3 years',
        hyperdrive_rating: '4.0',
        MGLT: '10',
        starship_class: 'Deep Space Mobile Battlestation',
        pilots: [],
        films: ['https://swapi.dev/api/films/1/'],
        created: '2014-12-10T16:36:50.509000Z',
        edited: '2014-12-20T21:26:24.783000Z',
        url: 'https://swapi.dev/api/starships/2/'
      }]
    };

    service.getStarships().subscribe(response => {
      expect(response).toEqual(mockResponse);
      expect(response.results.length).toBe(1);
      expect(response.results[0].name).toBe('Death Star');
    });

    const req = httpMock.expectOne('https://swapi.dev/api/starships/?page=1');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should handle errors gracefully', () => {
    service.getVehicles().subscribe(response => {
      expect(response.results).toEqual([]);
      expect(response.count).toBe(0);
    });

    const req = httpMock.expectOne('https://swapi.dev/api/vehicles/?page=1');
    req.error(new ProgressEvent('Network error'));
  });
});
