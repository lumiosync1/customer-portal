import { Component, inject, ViewChild } from '@angular/core';
import { FilterService, GridComponent, GridModule, PageService, SortService } from '@syncfusion/ej2-angular-grids';
import { DataManager, ODataV4Adaptor } from '@syncfusion/ej2-data';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../auth';
import { PageInfoService } from 'src/app/_metronic/layout';
import { RouterLink } from '@angular/router';

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
  @ViewChild('grid') grid: GridComponent;
  
  data = new DataManager({
    url: `${environment.backendUrl}/odata/ReturnRequestsOdata`,
    adaptor: new ODataV4Adaptor(),
    crossDomain: true,
    headers: [{ Authorization: 'Bearer ' + this.authService.getAuthFromLocalStorage()?.AccessToken }]
  });

  ngOnInit(): void {
    this.page.updateTitle('Return Requests');
  }
}
