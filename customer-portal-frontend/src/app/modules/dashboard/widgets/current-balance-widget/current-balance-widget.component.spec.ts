import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentBalanceWidgetComponent } from './current-balance-widget.component';

describe('CurrentBalanceWidgetComponent', () => {
  let component: CurrentBalanceWidgetComponent;
  let fixture: ComponentFixture<CurrentBalanceWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrentBalanceWidgetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurrentBalanceWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
