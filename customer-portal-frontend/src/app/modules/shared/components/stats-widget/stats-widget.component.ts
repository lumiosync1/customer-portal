import { DecimalPipe, NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stats-widget',
  standalone: true,
  imports: [NgClass, DecimalPipe],
  templateUrl: './stats-widget.component.html',
  styleUrl: './stats-widget.component.scss'
})
export class StatsWidgetComponent {
  @Input() value: number = 0;
  @Input() description: string = '';
  @Input() icon: string = '';
  @Input() backgroundColor: string = 'white';
  @Input() textColor: string = 'dark';
  @Input() cssClass: string = '';
  @Input() format: string = '1.2-2';
  @Input() isLoading: boolean = false;
}
