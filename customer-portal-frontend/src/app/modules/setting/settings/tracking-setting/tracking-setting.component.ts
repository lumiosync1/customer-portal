import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize, Subscription } from 'rxjs';
import { LoadingService } from 'src/app/modules/shared/services/loading.service';
import { ToastService } from 'src/app/modules/shared/services/toast.service';
import { SettingService } from '../../setting.service';
import { ResponseStatus } from 'src/app/modules/shared/models/base-response.model';
import { PurchaseSetting } from '../../_models/PurchaseSetting';
import { NgIf } from '@angular/common';
import { TrackingSetting } from '../../_models/TrackingSetting';

@Component({
  selector: 'app-tracking-setting',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './tracking-setting.component.html',
  styleUrl: './tracking-setting.component.scss'
})
export class TrackingSettingComponent {
  private fb = inject(FormBuilder);
  private settingService = inject(SettingService);
  private toast = inject(ToastService);
  private spinner = inject(LoadingService);
  activeModal = inject(NgbActiveModal);
  
  private subscriptions: Subscription[] = [];
  formGroup: FormGroup;
  setting: TrackingSetting;
  
  ngOnInit() {
    this.loadData();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  loadData() {
    this.spinner.showLoading();
    const sub = this.settingService.getTrackingSetting()
    .pipe(
      finalize(() => this.spinner.hideLoading())
    )
    .subscribe(response => {
      if(response.Status != ResponseStatus.Success) {
        this.toast.showError(response.Message);
        return;
      }

      this.setting = response.Data;
      this.createForm();
    })
  }

  createForm() {
    this.formGroup = this.fb.group({
      ConversionMethod: [this.setting.ConversionMethod, [Validators.required]],
    });
  }

  onSubmit() {
    this.formGroup.markAllAsTouched();
    if(this.formGroup.invalid) {
      return;
    }

    this.spinner.showLoading();
    const sub = this.settingService.updateTrackingSetting(this.formGroup.value)
    .pipe(
      finalize(() => this.spinner.hideLoading())
    )
    .subscribe(response => {
      if(response.Status !== ResponseStatus.Success) {
        this.toast.showError(response.Message);
        return;
      }

      this.toast.showSuccess('Tracking setting saved successfully');
      this.activeModal.close(true);
    });

    this.subscriptions.push(sub);
  }
}
