import { Component, inject } from '@angular/core';
import { PageInfoService } from 'src/app/_metronic/layout';
import { StoreService } from '../store.service';
import { ToastService } from '../../shared/services/toast.service';
import { LoadingService } from '../../shared/services/loading.service';
import { StoreUpdateInitDataDto } from '../_models/StoreUpdateInitDataDto';
import { finalize } from 'rxjs';
import { BaseResponse, ResponseStatus } from '../../shared/models/base-response.model';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { StoreUpdateDto } from '../_models/StoreUpdateDto';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-store-update-ebaymip',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    RouterLink,
  ],
  templateUrl: './store-update-ebaymip.component.html',
  styleUrl: './store-update-ebaymip.component.scss'
})
export class StoreUpdateEbaymipComponent {
  private page = inject(PageInfoService);
  private storeService = inject(StoreService);
  private toast = inject(ToastService);
  private loadingService = inject(LoadingService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  private storeId: number;

  initData: StoreUpdateInitDataDto;
  formGroup: FormGroup;

  ngOnInit(): void {
    this.page.updateTitle('Update Store (eBay NonAPI)');
    this.storeId = this.route.snapshot.params['id'];
    this.loadData();
  }

  loadData() {
    this.loadingService.showLoading();
    this.storeService.initUpdateStore(this.storeId)
    .pipe(finalize(() => this.loadingService.hideLoading()))
    .subscribe((response: BaseResponse<StoreUpdateInitDataDto>) => {
      if(response.Status !== ResponseStatus.Success) {
        this.toast.showError(response.Message);
        return;
      }

      this.initData = response.Data;
      this.createForm();
    });
  }

  createForm(): void {
    this.formGroup = new FormGroup({
      store_name: new FormControl({ value: this.initData.Store.store_name, disabled: true}, [Validators.required]),
      market: new FormControl({ value: this.initData.Store.market, disabled: true}, [Validators.required]),
      supplier: new FormControl({ value: this.initData.Store.supplier, disabled: false}, [Validators.required]),
      api_key: new FormControl(this.initData.Store.api_key, [Validators.required]),
      settings: new FormControl(this.initData.Store.settings),
    });
  }

  onSubmit() {
    this.formGroup.markAllAsTouched();
    if(this.formGroup.invalid) {
      this.toast.showWarning('Please review your data and try again');
      return;
    }

    const formValue = this.formGroup.value;
    const dto: StoreUpdateDto = {
      store_id: this.storeId,
      store_name: this.initData.Store.store_name,
      market: this.initData.Store.market,
      supplier: formValue.supplier,
      api_key: formValue.api_key,
      settings: formValue.settings,
    };

    this.loadingService.showLoading();
    this.storeService.updateStore(dto)
    .pipe(finalize(() => this.loadingService.hideLoading()))
    .subscribe((response: BaseResponse<string>) => {
      if(response.Status !== ResponseStatus.Success) {
        this.toast.showError(response.Message);
        return;
      }

      this.toast.showSuccess('Store updated successfully');
      this.router.navigate(['/stores']);
    });
  }
}
