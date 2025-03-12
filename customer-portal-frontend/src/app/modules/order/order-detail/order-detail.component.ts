import { Component, inject } from '@angular/core';
import { finalize, Subscription } from 'rxjs';
import { DatePipe, DecimalPipe, NgClass } from '@angular/common';
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

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [DatePipe, DecimalPipe, NgClass, NgbDropdownModule, RouterLink],
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

  subscriptions: Subscription[] = [];
  orderId: number;
  orderDetail: OrderDetailDto;
  OrderStatus = OrderStatus;

  private removeConfirmDialog: any;
  private pushToQueueConfirmDialog: any;

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
}
