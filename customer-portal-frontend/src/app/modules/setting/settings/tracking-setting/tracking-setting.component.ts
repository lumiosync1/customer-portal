import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize, Subscription } from 'rxjs';
import { DialogUtility} from '@syncfusion/ej2-angular-popups';
import { LoadingService } from 'src/app/modules/shared/services/loading.service';
import { ToastService } from 'src/app/modules/shared/services/toast.service';
import { SettingService } from '../../setting.service';
import { ResponseStatus } from 'src/app/modules/shared/models/base-response.model';
import { NgIf } from '@angular/common';
import { TrackingSetting } from '../../_models/TrackingSetting';
import { UsStates } from 'src/app/modules/shared/constants/us-states';

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
  private modalService = inject(NgbModal);
  activeModal = inject(NgbActiveModal);
  
  private subscriptions: Subscription[] = [];
  private confirmDialog: any;
  formGroup: FormGroup;
  setting: TrackingSetting;
  usStates = UsStates;
  selectedMethod: string | null = null;
  
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
      ShipFromState: [this.setting.ShipFromState]
    });

    this.selectedMethod = this.setting.ConversionMethod;

    this.formGroup.controls['ConversionMethod'].valueChanges.subscribe(value => {
      if(value == 'ShipperStore') {
        this.confirmDialog = DialogUtility.confirm({
          title: 'Confirm',
          content: `
          <strong>LumiosTrack Pro</strong> service is subject to change and depends on third-party providers. The tracking number provided is not the original carrier number. Use of the <strong>LumiosTrack Pro</strong> service is solely at the user's own responsibility/risk. The service is entirely optional, and LumioSync or any of its affiliates shall not be held liable for the validity, accuracy, or any other responsibility related to this service.
          `,
          okButton: {
            text: 'Confirm',
            click: this.confirmLumiosTrackPro.bind(this)
          },
          cancelButton: {
            text: 'Cancel',
            click: this.cancelLumiosTrackPro.bind(this)
          }
        });
      } else {
        this.selectedMethod = value;
      }
    });
  }

  confirmLumiosTrackPro() {
    this.confirmDialog.hide();
    this.selectedMethod = 'ShipperStore';
  }

  cancelLumiosTrackPro() {
    this.confirmDialog.hide();
    this.formGroup.controls['ConversionMethod'].patchValue(this.selectedMethod);
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
