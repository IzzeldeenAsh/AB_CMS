import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { EmailSettings, EmailSettingsService } from 'src/app/services/email-settings/email-settings.service';

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

  constructor(private cdr: ChangeDetectorRef , private emailSettigs:EmailSettingsService) {
    const loadingSubscr = this.isLoading$
      .asObservable()
      .subscribe((res) => (this.isLoading = res));
    this.unsubscribe.push(loadingSubscr);
  }

  ngOnInit(): void {this.getEmails()}

  getEmails(){
    this.getEmailLoader = true;
   const getEmails=  this.emailSettigs.getEmailSettings().subscribe({
    next : (res)=>{
       this.contactPageEmails = res;
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
    this.isLoading$.next(true);
    setTimeout(() => {
      this.isLoading$.next(false);
      this.showChangeEmailFormSender = false;
      this.cdr.detectChanges();
    }, 1500);
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
