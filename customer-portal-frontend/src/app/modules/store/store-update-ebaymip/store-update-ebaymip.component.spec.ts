import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreUpdateEbaymipComponent } from './store-update-ebaymip.component';

describe('StoreUpdateEbaymipComponent', () => {
  let component: StoreUpdateEbaymipComponent;
  let fixture: ComponentFixture<StoreUpdateEbaymipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreUpdateEbaymipComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoreUpdateEbaymipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
