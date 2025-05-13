import { Component, inject, ViewChild } from '@angular/core';
import { FilterService, GridComponent, GridModule, PageService, SortService } from '@syncfusion/ej2-angular-grids';
import { DataManager, ODataV4Adaptor } from '@syncfusion/ej2-data';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../auth';
import { PageInfoService } from 'src/app/_metronic/layout';
import { StoreService } from '../store.service';
import { DropDownButtonModule, ItemModel, MenuEventArgs } from '@syncfusion/ej2-angular-splitbuttons';
import { StoreListDto } from '../_models/StoreListDto';
import { Router } from '@angular/router';
import { Dialog, DialogUtility } from '@syncfusion/ej2-angular-popups';
import { finalize } from 'rxjs';
import { BaseResponse, ResponseStatus } from '../../shared/models/base-response.model';
import { ToastService } from '../../shared/services/toast.service';
import { LoadingService } from '../../shared/services/loading.service';
import { StoreCreateInitDataDto } from '../_models/StoreCreateInitDataDto';

@Component({
  selector: 'app-store-list',
  standalone: true,
  imports: [
    GridModule,
    DropDownButtonModule,
  ],
  providers: [SortService, FilterService, PageService],
  templateUrl: './store-list.component.html',
  styleUrl: './store-list.component.scss'
})
export class StoreListComponent {
  private page = inject(PageInfoService);
  private authService = inject(AuthService);
  private storeService = inject(StoreService);
  private router = inject(Router);
  private dialogService = DialogUtility;
  private toast = inject(ToastService);
  private loadingService = inject(LoadingService);
  @ViewChild('grid') grid: GridComponent;

  currency: string = this.authService.currency;
  
  data = new DataManager({
    url: `${environment.backendUrl}/odata/storesodata?$select=store_id,store_name,market,supplier,created_at`,
    adaptor: new ODataV4Adaptor(),
    crossDomain: true,
    headers: [{ Authorization: 'Bearer ' + this.authService.getAuthFromLocalStorage()?.AccessToken }]
  });

  markets: ItemModel[] = [
    { text: 'eBay NonAPI' },
    { text: 'eBay API', disabled: true },
    { text: 'Shopify', disabled: true },
  ];

  private confirmDialog: Dialog;

  ngOnInit(): void {
    this.page.updateTitle('Stores');
  }

  goToAddPage(args: MenuEventArgs) {
    this.loadingService.showLoading();
    this.storeService.initAddStore()
    .pipe(finalize(() => this.loadingService.hideLoading()))
    .subscribe((response: BaseResponse<StoreCreateInitDataDto>) => {
      if(response.Status !== ResponseStatus.Success) {
        this.toast.showError(response.Message);
        return;
      }

      switch (args.item.text) {
        case 'eBay NonAPI':
          this.router.navigate(['/stores/add-ebay-nonapi']);
          break;
        case 'eBay API':
          this.router.navigate(['/stores/add-ebay-api']);
          break;
        case 'Shopify':
          this.router.navigate(['/stores/add-shopify']);
          break;
      }
    });
  }

  goToEditPage(store: StoreListDto) {
    switch (store.market) {
      case 'EbayMip':
        this.router.navigate(['/stores/update-ebay-nonapi', store.store_id]);
        break;
      case 'Ebay':
        this.router.navigate(['/stores/update-ebay-api', store.store_id]);
        break;
      case 'Shopify':
        this.router.navigate(['/stores/update-shopify', store.store_id]);
        break;
    }
  }

  confirmDelete(store: StoreListDto) {
    this.confirmDialog = this.dialogService.confirm({
      title: 'Confirmation',
      content: 'Are you sure you want to delete this store? Orders won\'t be deleted.',
      okButton: { text: 'Confirm', click: () => this.deleteStore(store.store_id) },
      cancelButton: { text: 'Cancel' },
    });
  }

  deleteStore(storeId: number) {
    this.confirmDialog.close();
    this.loadingService.showLoading();
    this.storeService.deleteStore(storeId)
    .pipe(finalize(() => this.loadingService.hideLoading()))
    .subscribe((response: BaseResponse<string>) => {
      if(response.Status !== ResponseStatus.Success) {
        this.toast.showError(response.Message);
        return;
      }

      this.toast.showSuccess('Store deleted successfully');
      this.grid.refresh();
    });
  }

  getSupplierLogo(supplier: string): string {
    return this.storeService.getSupplierLogo(supplier);
  }
  getMarketLogo(market: string): string {
    return this.storeService.getMarketLogo(market);
  }
}
