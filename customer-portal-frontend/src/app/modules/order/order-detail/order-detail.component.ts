import { Component, inject } from '@angular/core';
import { finalize, Subscription } from 'rxjs';
import { OrderService } from '../order.service';
import { OrderDetailDto } from '../_models/OrderDetailDto';
import { ActivatedRoute } from '@angular/router';
import { LoadingService } from '../../shared/services/loading.service';
import { ToastService } from '../../shared/services/toast.service';
import { ResponseStatus } from '../../shared/models/base-response.model';
import { DatePipe, DecimalPipe, NgClass } from '@angular/common';
import { PageInfoService } from 'src/app/_metronic/layout';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [DatePipe, DecimalPipe, NgClass],
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.scss'
})
export class OrderDetailComponent {
  private orderService = inject(OrderService);
  private route = inject(ActivatedRoute);
  private spinner = inject(LoadingService);
  private toast = inject(ToastService);
  private page = inject(PageInfoService);

  subscriptions: Subscription[] = [];
  orderId: number;
  orderDetail: OrderDetailDto;

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
}
