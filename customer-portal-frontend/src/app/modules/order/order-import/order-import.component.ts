import { Component, inject, ViewChild } from '@angular/core';
import { UploaderModule } from '@syncfusion/ej2-angular-inputs';
import { AuthService } from '../../auth';
import { environment } from 'src/environments/environment';
import { FilterService, GridComponent, GridModule, PageService, SortService } from '@syncfusion/ej2-angular-grids';
import { DataManager, ODataV4Adaptor } from '@syncfusion/ej2-data';
import { OrderService } from '../order.service';


@Component({
  selector: 'app-order-import',
  standalone: true,
  imports: [UploaderModule, GridModule],
  providers: [SortService, FilterService, PageService],
  templateUrl: './order-import.component.html',
  styleUrl: './order-import.component.scss'
})
export class OrderImportComponent {
  private authService = inject(AuthService);
  private orderService = inject(OrderService);
  @ViewChild('grid') grid: GridComponent;
  
  public path: Object = {
    saveUrl: `${environment.backendUrl}/api/orders/import`,
    removeUrl: `${environment.backendUrl}/api/orders/import`
  };
  public data: DataManager;

  ngOnInit(): void {
    this.data = new DataManager({
      url: `${this.orderService.OrderImportsOdataUrl}`,
      adaptor: new ODataV4Adaptor(),
      crossDomain: true,
      headers: [{ Authorization: 'Bearer ' + this.authService.getAuthFromLocalStorage()?.AccessToken }]
    });
  }

  onFileUploading(args: any): void {
    // Add JWT to request header before file upload
    const token = this.authService.getAuthFromLocalStorage()?.AccessToken;
    args.currentRequest.setRequestHeader('Authorization',`Bearer ${token}`);
  }

  onFileUploadSuccess(args: any): void {
    this.grid.refresh();
  }
}
