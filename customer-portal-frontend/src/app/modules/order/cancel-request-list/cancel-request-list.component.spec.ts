import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelRequestListComponent } from './cancel-request-list.component';

describe('CancelRequestListComponent', () => {
  let component: CancelRequestListComponent;
  let fixture: ComponentFixture<CancelRequestListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CancelRequestListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CancelRequestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
