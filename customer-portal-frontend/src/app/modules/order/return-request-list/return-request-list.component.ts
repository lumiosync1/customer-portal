import { Component, inject, ViewChild } from '@angular/core';
import { FilterService, GridComponent, GridModule, PageService, SortService } from '@syncfusion/ej2-angular-grids';
import { DataManager, ODataV4Adaptor } from '@syncfusion/ej2-data';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../auth';
import { PageInfoService } from 'src/app/_metronic/layout';
import { RouterLink } from '@angular/router';
import { Dialog, DialogUtility } from '@syncfusion/ej2-angular-popups';
import { OrderService } from '../order.service';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoadingService } from '../../shared/services/loading.service';
import { ResponseStatus } from '../../shared/models/base-response.model';
import { ToastService } from '../../shared/services/toast.service';


@Component({
  selector: 'app-return-request-list',
  standalone: true,
  imports: [GridModule, RouterLink],
  providers: [SortService, FilterService, PageService],
  templateUrl: './return-request-list.component.html',
  styleUrl: './return-request-list.component.scss'
})
export class ReturnRequestListComponent {
  private page = inject(PageInfoService);
  private authService = inject(AuthService);
  private orderService = inject(OrderService);
  private loadingService = inject(LoadingService);
  private toastService = inject(ToastService);

  @ViewChild('grid') grid: GridComponent;
  
  data = new DataManager({
    url: `${environment.backendUrl}/odata/ReturnRequestsOdata`,
    adaptor: new ODataV4Adaptor(),
    crossDomain: true,
    headers: [{ Authorization: 'Bearer ' + this.authService.getAuthFromLocalStorage()?.AccessToken }]
  });

  private subscriptions: Subscription[] = [];
  private confirmDeleteDialog: Dialog;

  ngOnInit(): void {
    this.page.updateTitle('Return Requests');
  }

  confirmDelete(orderId: number): void {
    this.confirmDeleteDialog = DialogUtility.confirm({
      title: 'Delete Return Request',
      content: 'Are you sure you want to delete this return request?',
      okButton: { text: 'Confirm', click: () => this.deleteReturnRequest(orderId) },
      cancelButton: { text: 'Close' },
    });
  }

  deleteReturnRequest(orderId: number): void {
    this.loadingService.showLoading();
    const sub = this.orderService.deleteReturnRequest(orderId)
    .pipe(
      finalize(() => {
        this.loadingService.hideLoading();
        this.confirmDeleteDialog.hide();
      })
    )
    .subscribe((res) => {
      if(res.Status !== ResponseStatus.Success) {
        this.toastService.showError(res.Message);
        return;
      }
      this.toastService.showSuccess('Deleted successfully');
      this.grid.refresh();
    });
    this.subscriptions.push(sub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
