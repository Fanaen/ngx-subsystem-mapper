import { TestBed } from '@angular/core/testing';

import { GraphUpdaterService } from './graph-updater.service';

describe('GraphUpdaterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GraphUpdaterService = TestBed.get(GraphUpdaterService);
    expect(service).toBeTruthy();
  });
});
