import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionTotalizatorComponent } from './transaction-totalizator.component';

describe('TransactionTotalizatorComponent', () => {
  let component: TransactionTotalizatorComponent;
  let fixture: ComponentFixture<TransactionTotalizatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionTotalizatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionTotalizatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
