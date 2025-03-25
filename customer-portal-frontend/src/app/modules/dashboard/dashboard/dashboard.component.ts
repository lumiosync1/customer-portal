import { ChangeDetectorRef, Component, inject, viewChild } from '@angular/core';
import { LoadingService } from '../../shared/services/loading.service';
import { DashboardService } from '../dashboard.service';
import { ToastService } from '../../shared/services/toast.service';
import { finalize, Subscription } from 'rxjs';
import { ResponseStatus } from '../../shared/models/base-response.model';
import { DashboardData } from '../_models/DashboardData';
import { StatsWidgetComponent } from "../../shared/components/stats-widget/stats-widget.component";
import { BestSellerItem } from '../_models/BestSellerItem';
import { BestSellerItemsWidgetComponent } from '../widgets/best-seller-items-widget/best-seller-items-widget.component';
import { DateRangePickerComponent, DateRangePickerModule } from '@syncfusion/ej2-angular-calendars';
import { DailyPurchasesWidgetComponent } from "../widgets/daily-purchases-widget/daily-purchases-widget.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [StatsWidgetComponent, 
    BestSellerItemsWidgetComponent, 
    DateRangePickerModule, 
    DailyPurchasesWidgetComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  private ref = inject(ChangeDetectorRef);
  private loadingService = inject(LoadingService);
  private dashboardService = inject(DashboardService);
  private toast = inject(ToastService);
  private subscriptions: Subscription[] = [];

  dateRangePicker = viewChild(DateRangePickerComponent);

  data: DashboardData = {
    PendingCount: 0,
    PurchasedCount: 0,
    FailedCount: 0,
    RemovedCount: 0,
    CancelledCount: 0,
    ReturnedCount: 0,
    AvailableBalance: 0,
    Profit: 0,
    AverageProfit: 0
  };
  to: Date = new Date();
  from: Date = new Date(this.to);
  isLoadingData: boolean = false;

  bestSellerItems: BestSellerItem[] = [];

  ngOnInit() {
    this.to.setHours(0, 0, 0, 0);
    this.from = new Date(this.to);
    this.from.setDate(this.to.getDate() - 30);
    this.loadData(this.from, this.to);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private loadData(from: Date, to: Date) {
    this.loadStatsData(from, to);
  }

  private loadStatsData(from: Date, to: Date) {
    //this.loadingService.showLoading();
    this.isLoadingData = true;
    const sub = this.dashboardService.getDashboardData(from, to)
      .pipe(
        finalize(() => {
          this.isLoadingData = false;
          this.ref.detectChanges();
        })
      ).subscribe(res => {
        if(res.Status !== ResponseStatus.Success) {
          this.toast.showError('Something went wrong');
          return;
        }

        this.data = res.Data;
      });
    this.subscriptions.push(sub);
  }

  onDateRangeChange() {
    const picker = this.dateRangePicker();
    if(picker && picker.startDate && picker.endDate) {
      this.from = picker.startDate;
      this.to = picker.endDate;
      this.ref.detectChanges();
      this.loadStatsData(this.from, this.to);
    }
  }

  private loadBestSellersItems(from: Date, to: Date) {
    this.loadingService.showLoading();
    const sub = this.dashboardService.getBestSellerItems(from, to)
      .pipe(
        finalize(() => {
          this.loadingService.hideLoading();
        })
      ).subscribe(res => {
        if(res.Status !== ResponseStatus.Success) {
          this.toast.showError('Error getting best seller items');
          return;
        }

        this.bestSellerItems = res.Data;
      });
    this.subscriptions.push(sub);
  }
}
