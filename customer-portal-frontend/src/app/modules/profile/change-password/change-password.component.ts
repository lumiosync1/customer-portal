import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize, Subscription } from 'rxjs';
import { LoadingService } from 'src/app/modules/shared/services/loading.service';
import { ToastService } from 'src/app/modules/shared/services/toast.service';
import { ProfileService } from '../profile.service';
import { ResponseStatus } from '../../shared/models/base-response.model';
import { ConfirmPasswordValidator } from '../../auth';
import { NgClass, NgIf, NgTemplateOutlet } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgClass, NgTemplateOutlet, RouterLink],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent {
  private fb = inject(FormBuilder);
  private profileService = inject(ProfileService);
  private toast = inject(ToastService);
  private spinner = inject(LoadingService);

  private subscriptions: Subscription[] = [];
  formGroup: FormGroup;

  ngOnInit() {
    this.createForm();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  createForm() {
    this.formGroup = this.fb.group({
      CurrentPassword: [null, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
      ]],
      NewPassword: [null, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
      ]],
      ConfirmNewPassword: [null, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
      ]]
    }, {
      validator: this.MatchPassword,
    });
  }

  MatchPassword(control: AbstractControl): void {
    const password = control.get('NewPassword')?.value;
    const confirmPassword = control.get('ConfirmNewPassword')?.value;

    if (password !== confirmPassword) {
      control.get('ConfirmNewPassword')?.setErrors({ ConfirmPassword: true });
    }
  }

  onSubmit() {
    this.formGroup.markAllAsTouched();
    if(this.formGroup.invalid) {
      return;
    }

    this.spinner.showLoading();
    const sub = this.profileService.changePassword(this.formGroup.value)
    .pipe(
      finalize(() => this.spinner.hideLoading())
    )
    .subscribe(response => {
      if(response.Status !== ResponseStatus.Success) {
        this.toast.showError(response.Message);
        return;
      }

      this.toast.showSuccess('Password changed successfully');
    });

    this.subscriptions.push(sub);
  }
}
