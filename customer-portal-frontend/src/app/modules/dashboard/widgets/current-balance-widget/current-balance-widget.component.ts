import { DecimalPipe } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { finalize, Subscription } from 'rxjs';
import { BalanceService } from 'src/app/modules/balance/balance.service';

@Component({
  selector: 'app-current-balance-widget',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './current-balance-widget.component.html',
  styleUrl: './current-balance-widget.component.scss'
})
export class CurrentBalanceWidgetComponent {
  balanceService = inject(BalanceService);
  private ref = inject(ChangeDetectorRef);

  private subscriptions: Subscription[] = [];
  isLoading: boolean = false;
  balance: number = 0;

  ngOnInit() {
    this.loadData();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  loadData() {
    this.isLoading = true;
    this.balanceService.getBalance()
    .pipe(
      finalize(() => this.isLoading = false)
    )
    .subscribe(balance => {
      this.balance = balance;
      this.ref.detectChanges();
    })
  }
}
