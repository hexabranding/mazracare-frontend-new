import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomizationFormComponent } from './customization-form.component';

describe('CustomizationFormComponent', () => {
  let component: CustomizationFormComponent;
  let fixture: ComponentFixture<CustomizationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomizationFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustomizationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
