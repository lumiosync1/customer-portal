import { Component } from '@angular/core';
import { CurrentBalanceWidgetComponent } from "../widgets/current-balance-widget/current-balance-widget.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CurrentBalanceWidgetComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

}
