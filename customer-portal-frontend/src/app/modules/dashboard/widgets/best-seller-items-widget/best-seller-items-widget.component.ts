import { ChangeDetectorRef, Component, inject, Input } from '@angular/core';
import { BestSellerItem } from '../../_models/BestSellerItem';
import { DashboardService } from '../../dashboard.service';
import { ToastService } from 'src/app/modules/shared/services/toast.service';
import { finalize, Subscription } from 'rxjs';
import { ResponseStatus } from 'src/app/modules/shared/models/base-response.model';

@Component({
  selector: 'app-best-seller-items-widget',
  standalone: true,
  imports: [],
  templateUrl: './best-seller-items-widget.component.html',
  styleUrl: './best-seller-items-widget.component.scss'
})
export class BestSellerItemsWidgetComponent {
  @Input() from: Date = new Date();
  @Input() to: Date = new Date();

  private ref = inject(ChangeDetectorRef);
  private dashboardService = inject(DashboardService);
  private toast = inject(ToastService);

  private subscriptions: Subscription[] = [];

  items: BestSellerItem[] = [];
  isLoading: boolean = false;

  ngOnInit() {
    //this.loadData(this.from, this.to);
  }

  ngOnChanges() {
    this.loadData(this.from, this.to);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private loadData(from: Date, to: Date) {
    this.isLoading = true;
    const sub = this.dashboardService.getBestSellerItems(from, to)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.ref.detectChanges();
        })
      ).subscribe(res => {
        if(res.Status !== ResponseStatus.Success) {
          this.toast.showError('Error getting best seller items');
          return;
        }

        this.items = res.Data;
        this.ref.detectChanges();
      });
    this.subscriptions.push(sub);
  }
}
