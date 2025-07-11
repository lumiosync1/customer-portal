import { Component, inject } from '@angular/core';
import { finalize, Subscription } from 'rxjs';
import { CurrencyPipe, DatePipe, DecimalPipe, NgClass, NgIf } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogUtility} from '@syncfusion/ej2-angular-popups';
import { OrderService } from '../order.service';
import { OrderDetailDto } from '../_models/OrderDetailDto';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LoadingService } from '../../shared/services/loading.service';
import { ToastService } from '../../shared/services/toast.service';
import { ResponseStatus } from '../../shared/models/base-response.model';
import { PageInfoService } from 'src/app/_metronic/layout';
import { OrderStatus } from '../_others/order-statuses';
import { NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PushOrderToQueueModalComponent } from '../_components/push-order-to-queue-modal/push-order-to-queue-modal.component';
import { AuthService } from '../../auth';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [
    DatePipe, 
    DecimalPipe, 
    CurrencyPipe, 
    NgbDropdownModule, 
    RouterLink, 
    ReactiveFormsModule,
    NgClass,
    NgIf,
  ],
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.scss'
})
export class OrderDetailComponent {
  private orderService = inject(OrderService);
  private route = inject(ActivatedRoute);
  private spinner = inject(LoadingService);
  private toast = inject(ToastService);
  private page = inject(PageInfoService);
  private modalService = inject(NgbModal);
  private authService = inject(AuthService);
  private formBuilder = inject(FormBuilder);

  subscriptions: Subscription[] = [];
  orderId: number;
  orderDetail: OrderDetailDto;
  OrderStatus = OrderStatus;
  currency: string = this.authService.currency;
  soldBy: string = '';
  shipsFrom: string = '';
  isPrime: boolean = false;
  noteForm: FormGroup;
  shipToAddressForm: FormGroup;
  private removeConfirmDialog: any;

  ngOnInit(): void {
    const sub = this.route.params.subscribe(params => {
      this.orderId = params['id'];
      this.page.updateTitle(`Order #${this.orderId}`);
      this.loadData();
    });

    this.subscriptions.push(sub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  private loadData() {
    this.spinner.showLoading();
    const sub = this.orderService.getOrderDetail(this.orderId)
    .pipe(
      finalize(() => this.spinner.hideLoading())
    )
    .subscribe(response => {
      if(response.Status !== ResponseStatus.Success) {
        this.toast.showError(response.Message);
        return;
      }

      this.orderDetail = response.Data;
      if(this.orderDetail && this.orderDetail.Purchase && this.orderDetail.Purchase.SupplierOffer) {
        const offer = JSON.parse(this.orderDetail.Purchase.SupplierOffer);
        this.soldBy = offer.SoldBy;
        this.shipsFrom = offer.ShipsFrom;
        this.isPrime = offer.IsPrime;
      }

      this.noteForm = this.formBuilder.group({
        note: [this.orderDetail.Note]
      });

      this.shipToAddressForm = this.formBuilder.group({
        ShipToName: [this.orderDetail.ShipToName, Validators.required],
        ShipToPhone: [this.orderDetail.ShipToPhone, Validators.required],
        ShipToAddress1: [this.orderDetail.ShipToAddress1, Validators.required],
        ShipToAddress2: [this.orderDetail.ShipToAddress2],
        ShipToCity: [this.orderDetail.ShipToCity, Validators.required],
        ShipToState: [this.orderDetail.ShipToState, Validators.required],
        ShipToZip: [this.orderDetail.ShipToZip, Validators.required],
        ShipToCountry: [this.orderDetail.ShipToCountry, Validators.required]
      });
      if(this.orderDetail.ShipToCountry.toLocaleLowerCase() === 'us'
        || this.orderDetail.ShipToCountry.toLocaleLowerCase() === 'usa' 
        || this.orderDetail.ShipToCountry.toLocaleLowerCase() === 'united states') {
        this.shipToAddressForm.get('ShipToState')?.setValidators([Validators.required, Validators.maxLength(2)]);
      }
      if(this.orderDetail.OrderStatus !== OrderStatus.Pending
        && this.orderDetail.OrderStatus !== OrderStatus.Error
      ) {
        this.shipToAddressForm.disable();
      }
    });

    this.subscriptions.push(sub);
  }

  confirmRemove() {
    this.removeConfirmDialog = DialogUtility.confirm({
      title: 'Confirm',
      content: `Are you sure you want to remove order #${this.orderId}?
      <br/>
      (Order will only be marked as removed, not physically deleted from system)`,
      okButton: {
        text: 'Confirm',
        click: this.removeOrder.bind(this)
      }
    });
  }

  removeOrder() {
    this.removeConfirmDialog.hide();
    this.spinner.showLoading();
    const sub = this.orderService.removeOrder(this.orderId)
    .pipe(
      finalize(() => this.spinner.hideLoading())
    )
    .subscribe(response => {
      if(response.Status !== ResponseStatus.Success) {
        this.toast.showError(response.Message);
        return;
      }

      this.toast.showSuccess('Order removed successfully');
      this.loadData();
    });

    this.subscriptions.push(sub);
  }

  openPushToQueueModal() {
    const modalRef = this.modalService.open(PushOrderToQueueModalComponent, { backdrop: true });
    modalRef.componentInstance.orderId = this.orderId;
    modalRef.result.then(
      (result: boolean) => {
        if(result) {
          this.loadData();
        }
      },
      () => {}
    );
  }

  updateNote() {
    this.spinner.showLoading();
    const sub = this.orderService.updateNote(this.orderId, this.noteForm.value.note)
    .pipe(
      finalize(() => this.spinner.hideLoading())
    )
    .subscribe(response => {
      if(response.Status !== ResponseStatus.Success) {
        this.toast.showError(response.Message);
        return;
      }

      this.toast.showSuccess('Note updated successfully');
      this.loadData();
    });

    this.subscriptions.push(sub);
  }

  updateShipToAddress() {
    this.spinner.showLoading();
    const sub = this.orderService.updateShipToAddress(this.orderId, this.shipToAddressForm.value)
    .pipe(
      finalize(() => this.spinner.hideLoading())
    )
    .subscribe(response => {
      if(response.Status !== ResponseStatus.Success) {
        this.toast.showError(response.Message);
        return;
      }

      this.toast.showSuccess('Ship To Address updated successfully');
      this.loadData();
    });

    this.subscriptions.push(sub);
  }
}
