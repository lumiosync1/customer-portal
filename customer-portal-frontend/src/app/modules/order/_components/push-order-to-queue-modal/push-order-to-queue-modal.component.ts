import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../order.service';
import { ToastService } from 'src/app/modules/shared/services/toast.service';
import { LoadingService } from 'src/app/modules/shared/services/loading.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize, Subscription } from 'rxjs';
import { ResponseStatus } from 'src/app/modules/shared/models/base-response.model';

@Component({
  selector: 'app-push-order-to-queue-modal',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './push-order-to-queue-modal.component.html',
  styleUrl: './push-order-to-queue-modal.component.scss'
})
export class PushOrderToQueueModalComponent {
  orderId: number;
  formGroup: FormGroup;
  activeModal = inject(NgbActiveModal);

  private fb = inject(FormBuilder);
  private orderService = inject(OrderService);
  private toast = inject(ToastService);
  private spinner = inject(LoadingService);
  private subscriptions: Subscription[] = [];

  ngOnInit() {
    this.createForm();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  createForm() {
    this.formGroup = this.fb.group({
      OrderId: [this.orderId, Validators.required],
      MinimalProfitFixed: [null],
      MaxShippingDays: [null, Validators.min(1)],
    })
  }

  onSubmit() {
    this.formGroup.markAllAsTouched();
    if(this.formGroup.invalid) {
      return;
    }

    this.spinner.showLoading();
    const sub = this.orderService.pushOrderToQueue(this.formGroup.value)
    .pipe(
      finalize(() => this.spinner.hideLoading())
    )
    .subscribe(response => {
      if(response.Status !== ResponseStatus.Success) {
        this.toast.showError(response.Message);
        return;
      }

      this.toast.showSuccess('Order pushed to queue successfully');
      this.activeModal.close(true);
    });

    this.subscriptions.push(sub);
  }
}
