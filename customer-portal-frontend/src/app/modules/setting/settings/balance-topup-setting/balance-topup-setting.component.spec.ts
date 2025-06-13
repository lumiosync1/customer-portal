import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BalanceTopupSettingComponent } from './balance-topup-setting.component';

describe('BalanceTopupSettingComponent', () => {
  let component: BalanceTopupSettingComponent;
  let fixture: ComponentFixture<BalanceTopupSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BalanceTopupSettingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BalanceTopupSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
