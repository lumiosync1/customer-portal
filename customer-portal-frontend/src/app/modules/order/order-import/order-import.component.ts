import { Component, inject, ViewChild } from '@angular/core';
import { UploaderModule } from '@syncfusion/ej2-angular-inputs';
import { AuthService } from '../../auth';
import { environment } from 'src/environments/environment';
import { FilterService, GridComponent, GridModule, PageService, SortService } from '@syncfusion/ej2-angular-grids';
import { DataManager, ODataV4Adaptor } from '@syncfusion/ej2-data';
import { OrderService } from '../order.service';
import { NgbModal, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-order-import',
  standalone: true,
  imports: [UploaderModule, GridModule, NgbTooltipModule, NgFor],
  providers: [SortService, FilterService, PageService],
  templateUrl: './order-import.component.html',
  styleUrl: './order-import.component.scss'
})
export class OrderImportComponent {
  private authService = inject(AuthService);
  private orderService = inject(OrderService);
  public modalService = inject(NgbModal);
  @ViewChild('grid') grid: GridComponent;
  
  public path: Object = {
    saveUrl: `${environment.backendUrl}/api/orders/import`,
    removeUrl: `${environment.backendUrl}/api/orders/import`
  };
  public data: DataManager;
  public selectedRow: any;

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
