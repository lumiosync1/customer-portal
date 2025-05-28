import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PageInfoService } from 'src/app/_metronic/layout';
import { StoreService } from '../store.service';
import { NgIf } from '@angular/common';
import { ToastService } from '../../shared/services/toast.service';
import { BaseResponse, ResponseStatus } from '../../shared/models/base-response.model';
import { Router } from '@angular/router';
import { LoadingService } from '../../shared/services/loading.service';
import { finalize } from 'rxjs';
import { StoreListDto } from '../_models/StoreListDto';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-store-add-ebaymip',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    RouterLink,
  ],
  templateUrl: './store-add-ebaymip.component.html',
  styleUrl: './store-add-ebaymip.component.scss'
})
export class StoreAddEbaymipComponent {
  private router = inject(Router);
  private page = inject(PageInfoService);
  private storeService = inject(StoreService);
  private toast = inject(ToastService);
  private loadingService = inject(LoadingService);

  formGroup: FormGroup;

  ngOnInit(): void {
    this.page.updateTitle('Add Store (eBay NonAPI)');
    this.createForm();
  }

  createForm(): void {
    this.formGroup = new FormGroup({
      store_name: new FormControl('', [Validators.required]),
      market: new FormControl('EbayMip', [Validators.required]),
      supplier: new FormControl('amazon', [Validators.required]),
      api_key: new FormControl('', [Validators.required]),
      settings: new FormControl(null),
    });
  }

  onSubmit(): void {
    this.formGroup.markAllAsTouched();
    if(this.formGroup.invalid) {
      this.toast.showWarning('Please review your data and try again');
      return;
    }

    this.loadingService.showLoading();
    this.storeService.addStore(this.formGroup.value)
    .pipe(finalize(() => this.loadingService.hideLoading()))
    .subscribe((response: BaseResponse<StoreListDto>) => {
      if(response.Status !== ResponseStatus.Success) {
        this.toast.showError(response.Message);
        return;
      }

      this.toast.showSuccess('Store added successfully');
      this.router.navigate(['/stores', response.Data.store_id]);
    });
  }
}
