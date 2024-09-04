import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription, Observable, first } from 'rxjs';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { UsersManagementService } from 'src/app/services/users/users-management.service';
import { abUser } from 'src/app/modules/auth/models/abUser.model';
import { AuthService } from 'src/app/services/auth/auth.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-reply',
  templateUrl: './reply.component.html',
  styleUrls: ['./reply.component.scss'],
})
export class ReplyComponent implements OnInit, OnDestroy {
  registrationForm: FormGroup;
  hasError: boolean = false;
  isLoading$: Observable<boolean>;
  private modalRef: NgbModalRef | undefined;
  allUsersList : abUser[] = [];
  // Add a field for the password visibility toggle
  passwordFieldType: string = 'password';
  usersList: abUser[] = [];
  myUser: abUser;
  selectedFile: File | null = null;
  private unsubscribe: Subscription[] = [];
  previewUrl: SafeUrl | null = null;
  errorMessage: string | null = null;
  existedEmailError: string | null = null;
  isEditMode: boolean = false;
  editingUserId: string | null = null;
  loading:boolean = false;
  @ViewChild('content') content: ElementRef;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private modalService: NgbModal,
    private usersManagementService: UsersManagementService,
    private changeDetectorRef: ChangeDetectorRef,
    private sanitizer: DomSanitizer  // Add the sanitizer for image preview
  ) {
    this.isLoading$ = this.usersManagementService.isLoading$
  }

  ngOnInit(): void {
    this.initForm();
    this.loadUsers();
  }
  loadUsers(): void {
    this.loading = true;
    const loadUsersSub = this.usersManagementService.getAllUsers().subscribe({
      next: (users: abUser[]) => {
        this.allUsersList = users
        const currentUser = this.authService.getUser();
        this.usersList = users.filter(user => user.email !== currentUser.email);
        this.loading =false
        this.changeDetectorRef.detectChanges();
      },
      error: (err) => {
        console.error('Error loading users:', err);
        this.loading =false;
        this.changeDetectorRef.detectChanges();
        // Handle error (e.g., show error message to user)
      }
    });

    this.unsubscribe.push(loadUsersSub);
  }
  initForm() {
    this.registrationForm = this.fb.group({
      firstname: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(100),
        ]),
      ],
      lastname: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(100),
        ]),
      ],
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
      role: ['', Validators.required],
    });
  }

  // Method to toggle password visibility
  togglePasswordVisibility() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }
  resetError(){
    this.changeDetectorRef.detectChanges();
    this.existedEmailError=""
  }
  openModal(content:any) {
    this.modalRef = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }
  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.errorMessage=""
    if (file) {
      if (file.size > 200 * 1024) { // 200KB in bytes
        this.errorMessage = 'File size exceeds 200KB. Please choose a smaller file.';
        this.clearSelectedFile();
        return;
      }
      this.selectedFile = file;
      const objectUrl = URL.createObjectURL(file);
      this.previewUrl = this.sanitizer.bypassSecurityTrustUrl(objectUrl);
    }
  }
  clearSelectedFile() {
    this.selectedFile = null;
    this.previewUrl = null;
  }

  submit() {
    this.hasError = false;
    const formData = new FormData();
    const formValue = this.registrationForm.value;
    this.existedEmailError = '';

    // Check for existing email only when adding a new user
    if (!this.isEditMode) {
      const existedEmail = this.allUsersList.find((user) => user.email === formValue.email);
      if (existedEmail) {
        this.existedEmailError = "Email is used, try with another one";
        return;
      }
    }

    // Append form fields to FormData
    Object.keys(formValue).forEach(key => {
      if (formValue[key] !== null && formValue[key] !== undefined) {
        formData.append(key, formValue[key]);
      }
    });

    // Append file if selected
    if (this.selectedFile) {
      formData.append('pic', this.selectedFile, this.selectedFile.name);
    }

    // Append the user ID when editing
    if (this.isEditMode && this.editingUserId) {
      formData.append('id', this.editingUserId);
    }

    const observable = this.isEditMode
      ? this.usersManagementService.editUser(formData)
      : this.authService.registration(formData);

    const subscription = observable.pipe(first()).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: this.isEditMode ? 'User Updated' : 'User Registered',
          text: this.isEditMode ? 'User has been successfully updated.' : 'New user has been successfully registered.',
          confirmButtonText: 'OK'
        }).then(() => {
          if (this.modalRef) {
            this.modalRef.close();
            this.loadUsers();
          }
          this.resetForm();
        });
      },
      error: (err) => {
        console.error(this.isEditMode ? 'Update error:' : 'Registration error:', err);
        this.hasError = true;
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: this.isEditMode ? 'Failed to update user. Please try again.' : 'Failed to register user. Please try again.',
          confirmButtonText: 'OK'
        });
      },
    });

    this.unsubscribe.push(subscription);
  }

  resetForm() {
    this.isEditMode = false;
    this.editingUserId = null;
    this.registrationForm.reset();
    this.selectedFile = null;
    this.previewUrl = null;
    this.existedEmailError = '';
    this.hasError = false;
    this.errorMessage = null;

    // Reset validators for password field
    const passwordControl = this.registrationForm.get('password');
    if (passwordControl) {
      passwordControl.setValidators([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100)
      ]);
      passwordControl.updateValueAndValidity();
    }

    // Reset other form controls to their initial state
    Object.keys(this.registrationForm.controls).forEach(key => {
      const control = this.registrationForm.get(key);
      if (control) {
        control.setErrors(null);
        control.markAsPristine();
        control.markAsUntouched();
      }
    });

    // Reset file input
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }
  deleteUser(id: any ) {
    Swal.fire({
      title: `Are you sure to  ?`,
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usersManagementService.deleteUser(id).subscribe({
          next: (res) => {
            this.loadUsers()
            Swal.fire(
              'Deleted!',
              'User has been deleted.',
              'success'
            );
            // Optionally, refresh the user list or remove the user from the current list
          },
          error: (err) => {
            console.log("err", err);
            Swal.fire(
              'Error!',
              'There was an error deleting the user.',
              'error'
            );
          }
        });
      }
    });
  }

  editUser(id:any){
    this.isEditMode = true;
    this.editingUserId = id ;
    const userToEdit = this.usersList.find(user=>user.id === id);
    if(userToEdit){
      this.registrationForm.patchValue({
        firstname : userToEdit.firstname,
        lastname : userToEdit.lastname,
        email : userToEdit.email,
        role : userToEdit.role
      });

      this.registrationForm.get('password')?.clearValidators();
      this.registrationForm.get('password')?.updateValueAndValidity();
      if (userToEdit.pic) {
        this.previewUrl = this.sanitizer.bypassSecurityTrustUrl(userToEdit.pic);
      };
      this.openModal(this.content)
    }
  }
  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
