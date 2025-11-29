import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderTackingComponent } from './order-tacking.component';

describe('OrderTackingComponent', () => {
  let component: OrderTackingComponent;
  let fixture: ComponentFixture<OrderTackingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderTackingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrderTackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
