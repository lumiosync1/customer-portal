import { Component, inject } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BreakEvenSettingComponent } from './break-even-setting/break-even-setting.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {
  private modalService = inject(NgbModal);
  
  openBreakEvenSetting() {
    const modalRef = this.modalService.open(BreakEvenSettingComponent, { backdrop: 'static', scrollable: true });
  }
}
