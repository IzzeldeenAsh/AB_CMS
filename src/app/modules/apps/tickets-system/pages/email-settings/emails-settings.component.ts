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
  showChangeEmailFormSenderApply: boolean = false;
  showChangeEmailFormReciptApply: boolean = false;
  showChangePasswordForm: boolean = false;
  getEmailLoader: boolean = false;
  getEmailLoaderApply: boolean = false;
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean; 
  isLoadingApply: boolean; 
  contactPageEmails:EmailSettings;
  ApplyPageEmails:EmailSettings;
  private unsubscribe: Subscription[] = [];
  showPassword: boolean = false;
  showPasswordApply: boolean = false;
  contactUSForm:FormGroup;
  ApplyForAJobEmailsForm:FormGroup;
  getApplyForAJobEmailLoader: boolean = false;
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
    this.initContactUsFormApply();
    this.getEmails()
    this.getEmailsApply()
  }


  initContactUsForm() {
    this.contactUSForm = this.fb.group({
      smtpHost: ['c1108390.sgvps.net', Validators.required],
      smtpPort: ['465', Validators.required],
      smtpUser: ['i.ashour@alokabconsulting.com', [Validators.required, Validators.email]],
      smtpPass: ['IA@alokab2024&', Validators.required],
      recipientEmail: ['izaldeen@outlook.sa'],
      page:['contact']
    });
  }
  initContactUsFormApply() {
    this.ApplyForAJobEmailsForm = this.fb.group({
      smtpHost: ['c1108390.sgvps.net', Validators.required],
      smtpPort: ['465', Validators.required],
      smtpUser: ['i.ashour@alokabconsulting.com', [Validators.required, Validators.email]],
      smtpPass: ['IA@alokab2024&', Validators.required],
      recipientEmail: ['izaldeen@outlook.sa'],
      page:['applyForm']
    });
  }
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  togglePasswordVisibilityApply() {
    this.showPassword = !this.showPassword;
  }
  getEmails(){
    this.getEmailLoader = true;
   const getEmails=  this.emailSettigs.getEmailSettings('contact').subscribe({
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

  this.contactPageEmails = this.contactUSForm.value;
  this.cdr.detectChanges();
  }
  getEmailsApply(){
    this.getEmailLoaderApply = true;
   const getEmails=  this.emailSettigs.getEmailSettings('applyForm').subscribe({
    next : (res)=>{
       this.ApplyPageEmails = res;
       this.ApplyForAJobEmailsForm.patchValue(this.ApplyPageEmails)
       this.getEmailLoaderApply = false;
       this.cdr.detectChanges();
    },
    error : (err)=>{
      console.log("err" ,err );
       this.getEmailLoaderApply = false;
       this.cdr.detectChanges();
    }
   });

   this.unsubscribe.push(getEmails)

  this.ApplyPageEmails = this.ApplyForAJobEmailsForm.value;
  this.cdr.detectChanges();
  }
  toggleEmailFormSender(show: boolean) {
    this.showChangeEmailFormSender = show;
  }
  toggleEmailFormRecipt(show: boolean) {
    this.showChangeEmailFormRecipt = show;
  }
  toggleEmailFormSenderApply(show: boolean) {
    this.showChangeEmailFormSenderApply = show;
  }
  toggleEmailFormReciptApply(show: boolean) {
    this.showChangeEmailFormReciptApply = show;
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
          this.getEmailsApply();
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

  
  saveEmailApply() {
    if( this.ApplyForAJobEmailsForm.valid){
      this.isLoading$.next(true);
      const updatedSettings:EmailSettings = this.ApplyForAJobEmailsForm.value;
     const updateSub =  this.emailSettigs.updateEmailSettings(updatedSettings)
      .subscribe({
        next : (res)=>{
          this.isLoading$.next(false);
          this.getEmails()
        },
        error: (err)=>{
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




  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
