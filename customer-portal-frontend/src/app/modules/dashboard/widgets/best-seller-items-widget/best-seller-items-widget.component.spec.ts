import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BestSellerItemsWidgetComponent } from './best-seller-items-widget.component';

describe('BestSellerItemsWidgetComponent', () => {
  let component: BestSellerItemsWidgetComponent;
  let fixture: ComponentFixture<BestSellerItemsWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BestSellerItemsWidgetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BestSellerItemsWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
