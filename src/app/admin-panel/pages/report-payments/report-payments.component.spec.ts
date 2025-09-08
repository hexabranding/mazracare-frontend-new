import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportPaymentsComponent } from './report-payments.component';

describe('ReportPaymentsComponent', () => {
  let component: ReportPaymentsComponent;
  let fixture: ComponentFixture<ReportPaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportPaymentsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReportPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
