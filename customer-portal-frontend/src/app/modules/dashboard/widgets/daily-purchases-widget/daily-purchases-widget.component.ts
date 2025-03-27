import { ChangeDetectorRef, Component, inject, Input } from '@angular/core';
import { DashboardService } from '../../dashboard.service';
import { ToastService } from 'src/app/modules/shared/services/toast.service';
import { finalize, Subscription } from 'rxjs';
import { ResponseStatus } from 'src/app/modules/shared/models/base-response.model';
import { DailyPurchaseCount } from '../../_models/DailyPurchaseCount';
import { ChartModule, DataLabelService, DateTimeService, LineSeriesService, SplineSeriesService, TooltipService } from '@syncfusion/ej2-angular-charts';
import { map } from 'jquery';

@Component({
  selector: 'app-daily-purchases-widget',
  standalone: true,
  imports: [ChartModule,],
  providers: [LineSeriesService, SplineSeriesService, 
    DateTimeService, DataLabelService, TooltipService, 
  ],
  templateUrl: './daily-purchases-widget.component.html',
  styleUrl: './daily-purchases-widget.component.scss'
})
export class DailyPurchasesWidgetComponent {
  @Input() from: Date = new Date();
  @Input() to: Date = new Date();

  private ref = inject(ChangeDetectorRef);
  private dashboardService = inject(DashboardService);
  private toast = inject(ToastService);

  private subscriptions: Subscription[] = [];

  chartData: DailyPurchaseCount[] = [];
  isLoading: boolean = false;

  public primaryXAxis: Object = {
    valueType: 'DateTime',
    labelFormat: 'dd/MM',
    interval: 1,
    intervalType: 'Days',
    labelIntersectAction: 'Rotate45',
    majorGridLines: {
      width: 0
    },
    minorGridLines: {
      width: 0
    }
  };
  public primaryYAxis: Object = {
    majorGridLines: {
      width: 2,
      color: '#e9ecef',
      dashArray: '5 15'
    },
    minorGridLines: {
      width: 0
    }
  };
  public marker: Object = {
    dataLabel: {
      visible: true
    },
    visible: true,
    width: 7,
    height: 7,
    isFilled: true,
    shape: 'Circle'
  };
  public tooltip: Object = {
    enable: true
  };
  public palette: string[] = ['#06B6D4'];

  ngOnInit() {
    
  }

  ngOnChanges() {
    this.loadData(this.from, this.to);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private loadData(from: Date, to: Date) {
    this.isLoading = true;
    const sub = this.dashboardService.getDailyPurchases(from, to)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.ref.detectChanges();
        })
      ).subscribe(res => {
        if(res.Status !== ResponseStatus.Success) {
          this.toast.showError('Error getting daily purchases');
          return;
        }

        if(res.Data.length > 0) {
          this.chartData = res.Data.map(item => ({
            Day: new Date(item.Day),
            Count: item.Count
          }));
          this.ref.detectChanges();
        } else {
          this.chartData = [
            {
              Day: this.from,
              Count: 0
            },
            {
              Day: this.to,
              Count: 0
            }
          ];
          this.ref.detectChanges();
        }
      });
    this.subscriptions.push(sub);
  }
}
