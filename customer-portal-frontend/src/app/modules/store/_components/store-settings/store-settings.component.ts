import { Component, inject, Input } from '@angular/core';
import { StoreService } from '../../store.service';
import { ToastService } from '../../../shared/services/toast.service';
import { LoadingService } from '../../../shared/services/loading.service';
import { finalize } from 'rxjs';
import { BaseResponse, ResponseStatus } from '../../../shared/models/base-response.model';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreSettingsDto } from '../../_models/StoreSettingsDto';

@Component({
  selector: 'app-store-settings',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './store-settings.component.html',
  styleUrl: './store-settings.component.scss'
})
export class StoreSettingsComponent {
@Input() storeId: number;

  private fb = inject(FormBuilder);
  private storeService = inject(StoreService);
  private toast = inject(ToastService);
  private loadingService = inject(LoadingService);

  formGroup: FormGroup;
  settings: StoreSettingsDto;

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.loadingService.showLoading();
    this.storeService.getStoreSettings(this.storeId)
    .pipe(finalize(() => this.loadingService.hideLoading()))
    .subscribe((response: BaseResponse<StoreSettingsDto>) => {
      if(response.Status !== ResponseStatus.Success) {
        this.toast.showError(response.Message);
        return;
      }

      if(response.Data) {
        this.settings = response.Data;
      }
      this.createForm();
    });
  }

  createForm(): void {
    this.formGroup = this.fb.group({
      need_sku_mapping: [this.settings.need_sku_mapping],
      upload_tracking: [this.settings.upload_tracking],
    });
  }

  submit() {
    this.formGroup.markAllAsTouched();
    if(this.formGroup.invalid) {
      this.toast.showWarning('Please review your data and try again');
      return;
    }

    this.loadingService.showLoading();
    this.storeService.updateStoreSettings(this.storeId, this.formGroup.value)
    .pipe(finalize(() => this.loadingService.hideLoading()))
    .subscribe((response: BaseResponse<string>) => {
      if(response.Status !== ResponseStatus.Success) {
        this.toast.showError(response.Message);
        return;
      }

      this.toast.showSuccess('Settings updated successfully');
    });
  }
}
