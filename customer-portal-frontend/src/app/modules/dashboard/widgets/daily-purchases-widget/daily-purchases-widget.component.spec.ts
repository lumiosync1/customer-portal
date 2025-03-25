import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyPurchasesWidgetComponent } from './daily-purchases-widget.component';

describe('DailyPurchasesWidgetComponent', () => {
  let component: DailyPurchasesWidgetComponent;
  let fixture: ComponentFixture<DailyPurchasesWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DailyPurchasesWidgetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DailyPurchasesWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
