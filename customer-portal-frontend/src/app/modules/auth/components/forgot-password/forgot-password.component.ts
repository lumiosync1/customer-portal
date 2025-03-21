import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { first } from 'rxjs/operators';
import { BaseResponse, ResponseStatus } from 'src/app/modules/shared/models/base-response.model';

enum ErrorStates {
  NotSubmitted,
  HasError,
  NoError,
}

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  private ref = inject(ChangeDetectorRef);
  forgotPasswordForm: FormGroup;
  errorState: ErrorStates = ErrorStates.NotSubmitted;
  errorStates = ErrorStates;
  errorMessage: string = '';
  isLoading$: Observable<boolean>;
  isLoading: boolean = false;

  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.isLoading$ = this.authService.isLoading$;
  }

  ngOnInit(): void {
    const sub = this.authService.isLoading$.subscribe(i => {
      this.isLoading = i;
      this.ref.detectChanges();
    });
    this.unsubscribe.push(sub);
    this.initForm();
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.forgotPasswordForm.controls;
  }

  initForm() {
    this.forgotPasswordForm = this.fb.group({
      email: [
        '',
        Validators.compose([
          Validators.required,
          Validators.email,
          Validators.minLength(3),
          Validators.maxLength(320), // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
        ]),
      ],
    });
  }

  submit() {
    this.errorState = ErrorStates.NotSubmitted;
    const forgotPasswordSubscr = this.authService
      .forgotPassword(this.f.email.value)
      .pipe(first())
      .subscribe((result: BaseResponse<string>) => {
        if(result.Status == ResponseStatus.Success) {
          this.errorState = ErrorStates.NoError;
        } else {
          this.errorState = ErrorStates.HasError;
          this.errorMessage = result.Message;
        }
      });
    this.unsubscribe.push(forgotPasswordSubscr);
  }
}
