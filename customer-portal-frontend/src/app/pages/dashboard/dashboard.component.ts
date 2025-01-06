import { Component, inject, ViewChild } from '@angular/core';
import { ModalConfig, ModalComponent } from '../../_metronic/partials';
import { FilterService, SortService, GridComponent, IFilter, VirtualScrollService, Filter, Sort, Page, Toolbar, Edit } from '@syncfusion/ej2-angular-grids';
import { DataManager, ODataV4Adaptor, WebApiAdaptor, UrlAdaptor, Query } from '@syncfusion/ej2-data';
import { ToastService } from 'src/app/modules/shared/services/toast.service';
import { LoadingService } from 'src/app/modules/shared/services/loading.service';
import { AuthService } from 'src/app/modules/auth';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  public data: DataManager;
  public pageSettings: Object;
  public filterSettings: Object;
  public toolbar: string[];
  public editSettings: Object;
  public orderidrules: Object;
  public customeridrules: Object;
  public freightrules: Object;

  toastService = inject(ToastService);
  authService = inject(AuthService);

  ngOnInit(): void {
      this.data = new DataManager({
        url: 'https://localhost:7133/odata/sellersodata',
        adaptor: new ODataV4Adaptor(),
        crossDomain: true,
        headers: [{ Authorization: 'Bearer ' + this.authService.getAuthFromLocalStorage()?.AccessToken }]
      });
      
      this.pageSettings = { pageCount: 5 };
      this.filterSettings = { type: 'Excel' };
      this.toolbar = ['Add', 'Edit', 'Delete', 'Update', 'Cancel'];
      this.editSettings = { allowEditing: true, allowAdding: true, allowDeleting: true };
      this.orderidrules = { required: true, number: true };
      this.customeridrules = { required: true, minLength: 5 };
      this.freightrules = { required: true, min: 0 };
  }

  modalConfig: ModalConfig = {
    modalTitle: 'Modal title',
    dismissButtonLabel: 'Submit',
    closeButtonLabel: 'Cancel'
  };
  @ViewChild('modal') private modalComponent: ModalComponent;
  constructor(
    private loadingService: LoadingService,
  ) {}

  async openModal() {
    return await this.modalComponent.open();
  }

  showSuccess() {
    this.toastService.showSuccess('Success message');
    this.loadingService.showLoading();
    setTimeout(() => {
      this.loadingService.hideLoading();
    }, 5000);
  }
}
