import { Component, inject } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BreakEvenSettingComponent } from './break-even-setting/break-even-setting.component';
import { PurchaseSettingComponent } from './purchase-setting/purchase-setting.component';
import { TrackingSettingComponent } from './tracking-setting/tracking-setting.component';

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

  openPurchaseSetting() {
    const modalRef = this.modalService.open(PurchaseSettingComponent, { backdrop: 'static', scrollable: true });
  }

  openTrackingSetting() {
    const modalRef = this.modalService.open(TrackingSettingComponent, { backdrop: 'static', scrollable: true });
  }
}
