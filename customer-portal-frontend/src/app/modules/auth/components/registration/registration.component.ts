import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ConfirmPasswordValidator } from './confirm-password.validator';
import { UserModel } from '../../models/user.model';
import { first } from 'rxjs/operators';
import { RegistrationDto } from '../../models/registration.model';
import { BaseResponse, ResponseStatus } from 'src/app/modules/shared/models/base-response.model';
import { ValidUsernameValidator } from './valid-username.validator';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit, OnDestroy {
  registrationForm: FormGroup;
  hasError: boolean;
  errorMessage: string;
  isLoading$: Observable<boolean>;
  success: boolean = false;
  controls: any;
  planCode: string;
  platforms: string[] = ['Amazon', 'eBay', 'Shopify', 'Etsy', 'Wish', 'WooCommerce', 'Wix', 'Tiktok', 'Facebook', 'Others'];

  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.isLoading$ = this.authService.isLoading$;
    // redirect to home if already logged in
    if (this.authService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    const sub = this.route.queryParams.subscribe(p => {
      this.planCode = p.planCode;
    });
    this.initForm();
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.registrationForm.controls;
  }

  initForm() {
    this.registrationForm = this.fb.group(
      {
        fullname: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
          ]),
        ],
        userName: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
            ValidUsernameValidator()
          ]),
        ],
        email: [
          '',
          Validators.compose([
            Validators.required,
            Validators.email,
            Validators.minLength(3),
            Validators.maxLength(320), // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
          ]),
        ],
        password: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
          ]),
        ],
        cPassword: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
          ]),
        ],
        site: ['', Validators.required],
        planCode: [this.planCode, Validators.required],
        billingAddress: ['', Validators.required],
        sellingPlatforms: [''],
        phoneNumber: ['', Validators.compose([
          Validators.required,
          Validators.maxLength(20),
        ]),],
        agree: [false, Validators.compose([Validators.required])],
      },
      {
        validator: ConfirmPasswordValidator.MatchPassword,
      }
    );

    this.controls = this.registrationForm.controls;
  }

  submit() {
    this.hasError = false;
    this.errorMessage = '';
    this.registrationForm.markAllAsTouched();
    if (this.registrationForm.invalid) {
      return;
    }
    const newUser: RegistrationDto = {
      UserName: this.f.userName.value,
      FullName: this.f.fullname.value,
      Email: this.f.email.value,
      Password: this.f.password.value,
      Site: this.f.site.value,
      PlanCode: this.f.planCode.value,
      BillingAddress: this.f.billingAddress.value,
      SellingPlatforms: '',
      PhoneNumber: this.f.phoneNumber.value,
    };
    if(this.f.sellingPlatforms.value) {
      newUser.SellingPlatforms = this.f.sellingPlatforms.value.join(',');
    }
    const registrationSubscr = this.authService
      .registration(newUser)
      .subscribe((res: BaseResponse<string>) => {
        if (res.Status === ResponseStatus.Success) {
          this.success = true;
        } else {
          this.hasError = true;
          this.errorMessage = res.Message;
        }
      });
    this.unsubscribe.push(registrationSubscr);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
