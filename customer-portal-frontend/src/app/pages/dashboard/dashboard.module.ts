import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { ModalsModule } from '../../_metronic/partials';
import { GridModule, PageService, SortService, FilterService, ToolbarService, EditService } from '@syncfusion/ej2-angular-grids';

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: DashboardComponent,
      },
    ]),
    ModalsModule,
    GridModule,
  ],
  providers: [PageService, SortService, FilterService, ToolbarService, EditService],
})
export class DashboardModule {}
