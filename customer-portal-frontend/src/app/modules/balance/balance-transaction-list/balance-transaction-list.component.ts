import { Component, inject, ViewChild } from '@angular/core';
import { FilterService, GridComponent, GridModule, PageService, SortService } from '@syncfusion/ej2-angular-grids';
import { DataManager, ODataV4Adaptor } from '@syncfusion/ej2-data';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../auth';

@Component({
  selector: 'app-balance-transaction-list',
  standalone: true,
  imports: [
    GridModule,
  ],
  providers: [SortService, FilterService, PageService],
  templateUrl: './balance-transaction-list.component.html',
  styleUrl: './balance-transaction-list.component.scss'
})
export class BalanceTransactionListComponent {
  private authService = inject(AuthService);

  data = new DataManager({
    url: `${environment.backendUrl}/odata/balanceodata`,
    adaptor: new ODataV4Adaptor(),
    crossDomain: true,
    headers: [{ Authorization: 'Bearer ' + this.authService.getAuthFromLocalStorage()?.AccessToken }]
  });
}
