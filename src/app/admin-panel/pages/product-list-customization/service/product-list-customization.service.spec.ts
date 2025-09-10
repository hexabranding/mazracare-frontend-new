import { TestBed } from '@angular/core/testing';

import { ProductListCustomizationService } from './product-list-customization.service';

describe('ProductListCustomizationService', () => {
  let service: ProductListCustomizationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductListCustomizationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
