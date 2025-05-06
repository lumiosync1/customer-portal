import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreAddEbaymipComponent } from './store-add-ebaymip.component';

describe('StoreAddEbaymipComponent', () => {
  let component: StoreAddEbaymipComponent;
  let fixture: ComponentFixture<StoreAddEbaymipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreAddEbaymipComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoreAddEbaymipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
