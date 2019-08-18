import { TestBed } from '@angular/core/testing';

import { AgenciasService } from './agencias.service';

describe('AgenciasService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AgenciasService = TestBed.get(AgenciasService);
    expect(service).toBeTruthy();
  });
});
