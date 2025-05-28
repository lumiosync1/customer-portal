import { Component, inject, Input } from '@angular/core';
import { StoreService } from '../../store.service';
import { ToastService } from '../../../shared/services/toast.service';
import { LoadingService } from '../../../shared/services/loading.service';
import { StoreUpdateInitDataDto } from '../../_models/StoreUpdateInitDataDto';
import { finalize } from 'rxjs';
import { BaseResponse, ResponseStatus } from '../../../shared/models/base-response.model';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { StoreAddress } from '../../_models/StoreAddress';
import { NgIf } from '@angular/common';
import { UsStates } from 'src/app/modules/shared/constants/us-states';

@Component({
  selector: 'app-store-location',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgIf,
  ],
  templateUrl: './store-location.component.html',
  styleUrl: './store-location.component.scss'
})
export class StoreLocationComponent {
  @Input() storeId: number;

  private storeService = inject(StoreService);
  private toast = inject(ToastService);
  private loadingService = inject(LoadingService);

  formGroup: FormGroup;
  address: StoreAddress = {
    FirstName: '',
    LastName: '',
    Address1: '',
    Address2: '',
    City: '',
    State: '',
    ZipCode: '',
    Country: '',
    PhoneNumber: '',
  };

  states = UsStates;

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.loadingService.showLoading();
    this.storeService.getStoreAddress(this.storeId)
    .pipe(finalize(() => this.loadingService.hideLoading()))
    .subscribe((response: BaseResponse<StoreAddress>) => {
      if(response.Status !== ResponseStatus.Success) {
        this.toast.showError(response.Message);
        return;
      }

      if(response.Data) {
        this.address = response.Data;
      }
      this.createForm();
    });
  }

  createForm(): void {
    this.formGroup = new FormGroup({
      FirstName: new FormControl(this.address.FirstName, [Validators.required]),
      LastName: new FormControl(this.address.LastName, [Validators.required]),
      Address1: new FormControl(this.address.Address1, [Validators.required]),
      Address2: new FormControl(this.address.Address2),
      City: new FormControl(this.address.City, [Validators.required]),
      State: new FormControl(this.address.State, [Validators.required]),
      ZipCode: new FormControl(this.address.ZipCode, [Validators.required]),
      Country: new FormControl(''), // will be set by backend based on seller's site
      PhoneNumber: new FormControl(this.address.PhoneNumber, [Validators.required]),
    });
  }

  submit() {
    this.formGroup.markAllAsTouched();
    if(this.formGroup.invalid) {
      this.toast.showWarning('Please review your data and try again');
      return;
    }

    this.loadingService.showLoading();
    this.storeService.updateStoreAddress(this.storeId, this.formGroup.value)
    .pipe(finalize(() => this.loadingService.hideLoading()))
    .subscribe((response: BaseResponse<string>) => {
      if(response.Status !== ResponseStatus.Success) {
        this.toast.showError(response.Message);
        return;
      }

      this.toast.showSuccess('Address updated successfully');
    });
  } 
}
