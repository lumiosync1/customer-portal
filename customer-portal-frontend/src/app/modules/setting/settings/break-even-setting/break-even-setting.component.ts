import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize, Subscription } from 'rxjs';
import { LoadingService } from 'src/app/modules/shared/services/loading.service';
import { ToastService } from 'src/app/modules/shared/services/toast.service';
import { SettingService } from '../../setting.service';
import { BreakEvenSetting } from '../../_models/BreakEvenSetting';
import { ResponseStatus } from 'src/app/modules/shared/models/base-response.model';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-break-even-setting',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './break-even-setting.component.html',
  styleUrl: './break-even-setting.component.scss'
})
export class BreakEvenSettingComponent {
  private fb = inject(FormBuilder);
  private settingService = inject(SettingService);
  private toast = inject(ToastService);
  private spinner = inject(LoadingService);
  activeModal = inject(NgbActiveModal);
  
  private subscriptions: Subscription[] = [];
  formGroup: FormGroup;
  setting: BreakEvenSetting = {
    MarketSaleFeePercentage: 0,
    AdditionalFeeFixed: 0,
    AdditionalFeePercentage: 0,
    MinimalProfitFixed: 0,
    MinimalProfitPercentage: null
  }
  
  ngOnInit() {
    this.loadData();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  loadData() {
    this.spinner.showLoading();
    const sub = this.settingService.getBreakEvenSetting()
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
      MarketSaleFeePercentage: [this.setting.MarketSaleFeePercentage, 
        [Validators.required, Validators.min(0), Validators.max(100)]
      ],
      AdditionalFeeFixed: [this.setting.AdditionalFeeFixed,
        [Validators.required, Validators.min(0), ]
      ],
      AdditionalFeePercentage: [this.setting.AdditionalFeePercentage, 
        [Validators.required, Validators.min(0), Validators.max(100)]
      ],
      MinimalProfitFixed: [this.setting.MinimalProfitFixed],
      MinimalProfitPercentage: [this.setting.MinimalProfitPercentage],
      MinimalProfitType: [this.setting.MinimalProfitPercentage != null ? 'percentage' : 'fixed']
    });

    if(this.setting.MinimalProfitFixed != null) {
      this.formGroup.controls['MinimalProfitFixed'].setValidators([Validators.required, Validators.min(0)]);
      this.formGroup.controls['MinimalProfitPercentage'].disable();
    } else if(this.setting.MinimalProfitPercentage != null) {
      this.formGroup.controls['MinimalProfitFixed'].disable();
      this.formGroup.controls['MinimalProfitPercentage'].setValidators([Validators.required, Validators.min(0), Validators.max(100)]);
    }

    const sub = this.formGroup.controls['MinimalProfitType'].valueChanges.subscribe(value => {
      if(value === 'fixed') {
        this.formGroup.controls['MinimalProfitFixed'].setValidators([Validators.required, Validators.min(0)]);
        this.formGroup.controls['MinimalProfitFixed'].enable();
        this.formGroup.controls['MinimalProfitPercentage'].clearValidators();
        this.formGroup.controls['MinimalProfitPercentage'].disable();
      } else if(value === 'percentage') {
        this.formGroup.controls['MinimalProfitPercentage'].setValidators([Validators.required, Validators.min(0), Validators.max(100)]);
        this.formGroup.controls['MinimalProfitPercentage'].enable();
        this.formGroup.controls['MinimalProfitFixed'].clearValidators();
        this.formGroup.controls['MinimalProfitFixed'].disable();
      }
    });
    this.subscriptions.push(sub);
  }

  onSubmit() {
    this.formGroup.markAllAsTouched();
    if(this.formGroup.invalid) {
      return;
    }

    this.spinner.showLoading();
    const dto: BreakEvenSetting = {
      MarketSaleFeePercentage: this.formGroup.value.MarketSaleFeePercentage,
      AdditionalFeeFixed: this.formGroup.value.AdditionalFeeFixed,
      AdditionalFeePercentage: this.formGroup.value.AdditionalFeePercentage,
      MinimalProfitFixed: this.formGroup.value.MinimalProfitType === 'fixed' ? this.formGroup.value.MinimalProfitFixed : null,
      MinimalProfitPercentage: this.formGroup.value.MinimalProfitType === 'percentage' ? this.formGroup.value.MinimalProfitPercentage : null
    }
    const sub = this.settingService.updateBreakEvenSetting(dto)
    .pipe(
      finalize(() => this.spinner.hideLoading())
    )
    .subscribe(response => {
      if(response.Status !== ResponseStatus.Success) {
        this.toast.showError(response.Message);
        return;
      }

      this.toast.showSuccess('Break even setting saved successfully');
      this.activeModal.close(true);
    });

    this.subscriptions.push(sub);
  }
}
