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
import { StoreUpdateEbaymipComponent } from "../store-update-ebaymip/store-update-ebaymip.component";
import { StoreLocationComponent } from "../_components/store-location/store-location.component";

@Component({
  selector: 'app-store-update',
  standalone: true,
  imports: [StoreUpdateEbaymipComponent, StoreLocationComponent],
  templateUrl: './store-update.component.html',
  styleUrl: './store-update.component.scss'
})
export class StoreUpdateComponent {
  private page = inject(PageInfoService);
  private storeService = inject(StoreService);
  private toast = inject(ToastService);
  private loadingService = inject(LoadingService);
  private route = inject(ActivatedRoute);

  storeId: number;

  initData: StoreUpdateInitDataDto;
  formGroup: FormGroup;

  ngOnInit(): void {
    this.page.updateTitle('Update Store');
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
    });
  }
}
