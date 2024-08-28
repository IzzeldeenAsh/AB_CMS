import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Subscription } from 'rxjs';
import { EmailSettings, EmailSettingsService } from 'src/app/services/email-settings/email-settings.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-emails-settings',
  templateUrl: './emails-settings.component.html',
  styleUrl: './emails-settings.component.scss'
})
export class EmailsSettingsComponent implements OnInit, OnDestroy {
  showChangeEmailFormSender: boolean = false;
  showChangeEmailFormRecipt: boolean = false;
  showChangePasswordForm: boolean = false;
  getEmailLoader: boolean = false;
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean; 
  contactPageEmails:EmailSettings;
  private unsubscribe: Subscription[] = [];
  showPassword: boolean = false;
  contactUSForm:FormGroup;
  constructor(
    private cdr: ChangeDetectorRef , 
    private emailSettigs:EmailSettingsService,
    private fb : FormBuilder
  
  ) {
    const loadingSubscr = this.isLoading$
      .asObservable()
      .subscribe((res) => (this.isLoading = res));
    this.unsubscribe.push(loadingSubscr);
  }

  ngOnInit(): void {
    this.initContactUsForm();
    this.getEmails()
  }


  initContactUsForm() {
    this.contactUSForm = this.fb.group({
      smtpHost: ['', Validators.required],
      smtpPort: ['', Validators.required],
      smtpUser: ['', [Validators.required, Validators.email]],
      smtpPass: ['', Validators.required],
      recipientEmail: ['', [Validators.required, Validators.email]]
    });
  }
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  getEmails(){
    this.getEmailLoader = true;
   const getEmails=  this.emailSettigs.getEmailSettings().subscribe({
    next : (res)=>{
       this.contactPageEmails = res;
       this.contactUSForm.patchValue(this.contactPageEmails)
       this.getEmailLoader = false;
       this.cdr.detectChanges();
    },
    error : (err)=>{
      console.log("err" ,err );
       this.getEmailLoader = false;
       this.cdr.detectChanges();
    }
   });

   this.unsubscribe.push(getEmails)
  }

  toggleEmailFormSender(show: boolean) {
    this.showChangeEmailFormSender = show;
  }
  toggleEmailFormRecipt(show: boolean) {
    this.showChangeEmailFormRecipt = show;
  }

  saveEmail() {
    if( this.contactUSForm.valid){
      this.isLoading$.next(true);
      const updatedSettings:EmailSettings = this.contactUSForm.value;
      console.log("updatedSettings",updatedSettings);
     const updateSub =  this.emailSettigs.updateEmailSettings(updatedSettings)
      .subscribe({
        next : (res)=>{
          console.log("success" , res)
          this.isLoading$.next(false);
          this.getEmails()
        },
        error: (err)=>{
          console.log("err" , err)
          this.isLoading$.next(false);
          this.getEmails();
        }
      })
      
      this.unsubscribe.push(updateSub)
    }else{
      Swal.fire(
        'Error!',
        'There was an error updating emails.',
        'error'
      );
    }

  
    // this.isLoading$.next(true);
    // setTimeout(() => {
    //   this.isLoading$.next(false);
    //   this.showChangeEmailFormSender = false;
    //   this.cdr.detectChanges();
    // }, 1500);
  }

  saveEmailRecipt() {
    this.isLoading$.next(true);
    setTimeout(() => {
      this.isLoading$.next(false);
      this.showChangeEmailFormRecipt = false;
      this.cdr.detectChanges();
    }, 1500);
  }


  togglePasswordForm(show: boolean) {
    this.showChangePasswordForm = show;
  }

  savePassword() {
    this.isLoading$.next(true);
    setTimeout(() => {
      this.isLoading$.next(false);
      this.showChangePasswordForm = false;
      this.cdr.detectChanges();
    }, 1500);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
