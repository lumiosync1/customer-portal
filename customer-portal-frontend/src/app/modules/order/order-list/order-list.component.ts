import { Component, inject, ViewChild } from '@angular/core';
import { FilterService, GridComponent, GridModule, PageService, SortService } from '@syncfusion/ej2-angular-grids';
import { DataManager, ODataV4Adaptor } from '@syncfusion/ej2-data';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../auth';
import { OrderService } from '../order.service';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [
    GridModule,
  ],
  providers: [SortService, FilterService, PageService],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.scss'
})
export class OrderListComponent {

  private authService = inject(AuthService);
  private orderService = inject(OrderService);
  @ViewChild('grid') grid: GridComponent;
  
  data = new DataManager({
    url: `${environment.backendUrl}/odata/ordersodata`,
    adaptor: new ODataV4Adaptor(),
    crossDomain: true,
    headers: [{ Authorization: 'Bearer ' + this.authService.getAuthFromLocalStorage()?.AccessToken }]
  });
}
