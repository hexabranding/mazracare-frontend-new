import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyGuidelinesComponent } from './policy-guidelines.component';

describe('PolicyGuidelinesComponent', () => {
  let component: PolicyGuidelinesComponent;
  let fixture: ComponentFixture<PolicyGuidelinesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PolicyGuidelinesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PolicyGuidelinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
