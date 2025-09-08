import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsNewFormComponent } from './products-new-form.component';

describe('ProductsNewFormComponent', () => {
  let component: ProductsNewFormComponent;
  let fixture: ComponentFixture<ProductsNewFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsNewFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductsNewFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
