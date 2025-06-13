import { Component, inject } from '@angular/core';
import { NgbActiveModal, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { finalize, Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { LoadingService } from 'src/app/modules/shared/services/loading.service';
import { ToastService } from 'src/app/modules/shared/services/toast.service';
import { SettingService } from '../../setting.service';
import { BaseResponse, ResponseStatus } from 'src/app/modules/shared/models/base-response.model';

@Component({
  selector: 'app-balance-topup-setting',
  standalone: true,
  imports: [FormsModule, NgbAlertModule],
  templateUrl: './balance-topup-setting.component.html',
  styleUrl: './balance-topup-setting.component.scss'
})
export class BalanceTopupSettingComponent {
  private settingService = inject(SettingService);
  private toast = inject(ToastService);
  private spinner = inject(LoadingService);
  activeModal = inject(NgbActiveModal);
  
  private subscriptions: Subscription[] = [];
  sources: string[] = [];
  newSource: string = '';

  ngOnInit() {
    this.loadData();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  loadData() {
    this.spinner.showLoading();
    const sub = this.settingService.getPayoneerSources()
    .pipe(
      finalize(() => this.spinner.hideLoading())
    )
    .subscribe(response => {
      if(response.Status != ResponseStatus.Success) {
        this.toast.showError(response.Message);
        return;
      }

      this.sources = response.Data;
    });
    this.subscriptions.push(sub);
  }

  // removeSource(source: string) {
  //   this.sources = this.sources.filter(s => s !== source);
  // }
  removeSource(index: number) {
    this.sources.splice(index, 1);
  }

  addSource() {
    console.log(this.newSource);
    if(this.newSource.trim() === '') {
      return;
    }

    this.sources.push(this.newSource.trim());
    this.newSource = '';
  }

  onSubmit() {
    this.spinner.showLoading();
    this.settingService.updatePayoneerSources(this.sources)
    .pipe(finalize(() => this.spinner.hideLoading()))
    .subscribe((response: BaseResponse<string>) => {
      if(response.Status !== ResponseStatus.Success) {
        this.toast.showError(response.Message);
        return;
      }

      this.toast.showSuccess('Updated successfully');
      this.activeModal.close();
    });
  }
}
