import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialBarChartComponent } from './financial-bar-chart.component';

describe('FinancialBarChartComponent', () => {
  let component: FinancialBarChartComponent;
  let fixture: ComponentFixture<FinancialBarChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinancialBarChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinancialBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
