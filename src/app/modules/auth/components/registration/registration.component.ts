import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit, OnDestroy {
  registrationForm: FormGroup;
  hasError: boolean;
  isLoading$: Observable<boolean>;

  private unsubscribe: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.isLoading$ = this.authService.isLoading$;
   
  }

  ngOnInit(): void {
    this.initForm();
  }

  get f() {
    return this.registrationForm.controls;
  }

  initForm() {
    this.registrationForm = this.fb.group(
      {
        email: [
          '',
          Validators.compose([
            Validators.required,
            Validators.email,
            Validators.minLength(3),
            Validators.maxLength(320),
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
        role: [
          '',
          Validators.compose([
            Validators.required,
          ]),
        ],
        agree: [
          false, 
          Validators.compose([
            Validators.requiredTrue
          ])
        ],
      }
    );
  }   

  submit() {
    // this.hasError = false;
    // const formValue = this.registrationForm.value;

    // const registrationSubscr = this.authService
    //   .registration({
    //     email: formValue.email,
    //     password: formValue.password,
    //     role: formValue.role,
    //   })
    //   .pipe(first())
    //   .subscribe({
    //     next: (response) => {
    //       console.log('User registered successfully:', response);
    //       this.router.navigate(['/auth/login']);
    //     },
    //     error: (err) => {
    //       console.error('Registration error:', err);
    //       this.hasError = true;
    //     },
    //   });

    // this.unsubscribe.push(registrationSubscr);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
