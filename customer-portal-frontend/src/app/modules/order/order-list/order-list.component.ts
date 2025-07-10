import { Component, inject, ViewChild } from '@angular/core';
import { FilterService, FreezeService, GridComponent, GridModule, PageService, SortService } from '@syncfusion/ej2-angular-grids';
import { DataManager, ODataV4Adaptor } from '@syncfusion/ej2-data';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../auth';
import { OrderService } from '../order.service';
import { RouterLink } from '@angular/router';
import { PageInfoService } from 'src/app/_metronic/layout';
import { CurrencyPipe } from '@angular/common';
import { NgbPopoverModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [
    GridModule,
    RouterLink,
    CurrencyPipe,
    NgbPopoverModule,
    NgbTooltipModule
  ],
  providers: [SortService, FilterService, PageService, FreezeService],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.scss'
})
export class OrderListComponent {
  private page = inject(PageInfoService);
  private authService = inject(AuthService);
  private orderService = inject(OrderService);
  @ViewChild('grid') grid: GridComponent;

  currency: string = this.authService.currency;
  noteContent: string;
  
  data = new DataManager({
    url: `${environment.backendUrl}/odata/ordersodata`,
    adaptor: new ODataV4Adaptor(),
    crossDomain: true,
    headers: [{ Authorization: 'Bearer ' + this.authService.getAuthFromLocalStorage()?.AccessToken }]
  });

  ngOnInit(): void {
    this.page.updateTitle('Orders');
  }

  showNote(note: string) {
    this.noteContent = note;
  }
}
