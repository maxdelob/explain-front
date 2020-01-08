import { TestBed } from '@angular/core/testing';

import { SelectionHandlerService } from './selection-handler.service';

describe('SelectionHandlerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SelectionHandlerService = TestBed.get(SelectionHandlerService);
    expect(service).toBeTruthy();
  });
});
