import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BalanceTransactionListComponent } from './balance-transaction-list.component';

describe('BalanceTransactionListComponent', () => {
  let component: BalanceTransactionListComponent;
  let fixture: ComponentFixture<BalanceTransactionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BalanceTransactionListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BalanceTransactionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
