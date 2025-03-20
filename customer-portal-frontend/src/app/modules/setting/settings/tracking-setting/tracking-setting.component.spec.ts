import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackingSettingComponent } from './tracking-setting.component';

describe('TrackingSettingComponent', () => {
  let component: TrackingSettingComponent;
  let fixture: ComponentFixture<TrackingSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrackingSettingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrackingSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
