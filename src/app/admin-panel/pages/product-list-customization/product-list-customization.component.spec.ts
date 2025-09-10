import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductListCustomizationComponent } from './product-list-customization.component';

describe('ProductListCustomizationComponent', () => {
  let component: ProductListCustomizationComponent;
  let fixture: ComponentFixture<ProductListCustomizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductListCustomizationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductListCustomizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
