import { TestBed } from '@angular/core/testing';

import { TerritoriesService } from './territories.service';

describe('TerritoriesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TerritoriesService = TestBed.get(TerritoriesService);
    expect(service).toBeTruthy();
  });
});
