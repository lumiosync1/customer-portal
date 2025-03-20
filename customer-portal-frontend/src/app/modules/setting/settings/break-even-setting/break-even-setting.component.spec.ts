import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BreakEvenSettingComponent } from './break-even-setting.component';

describe('BreakEvenSettingComponent', () => {
  let component: BreakEvenSettingComponent;
  let fixture: ComponentFixture<BreakEvenSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BreakEvenSettingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BreakEvenSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
