import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PushOrderToQueueModalComponent } from './push-order-to-queue-modal.component';

describe('PushOrderToQueueModalComponent', () => {
  let component: PushOrderToQueueModalComponent;
  let fixture: ComponentFixture<PushOrderToQueueModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PushOrderToQueueModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PushOrderToQueueModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
