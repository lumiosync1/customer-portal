import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseSettingComponent } from './purchase-setting.component';

describe('PurchaseSettingComponent', () => {
  let component: PurchaseSettingComponent;
  let fixture: ComponentFixture<PurchaseSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchaseSettingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
