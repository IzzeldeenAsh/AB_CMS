import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AboutUsService } from 'src/app/services/about-us/about-us.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-our-company',
  templateUrl: './our-company.component.html',
  styleUrl: './our-company.component.scss'
})
export class OurCompanyComponent  implements OnInit, OnDestroy {
  aboutUsForm: FormGroup;
  errorMessage: string | null = null;
  isLoading$: Observable<boolean>;
  private unsubscribe: Subscription[] = [];
  selectedFile: File | null = null;
  previewUrl: SafeUrl | null = null;
  aboutUs: any;
  tinymceConfig = {
    base_url: 'https://cdn.jsdelivr.net/npm/tinymce',
    suffix: '.min',
    plugins: [
        'image',
        'textcolor',
        'lists',
        'link',  // Add the link plugin
        'directionality'  // Add the directionality plugin
    ],
    toolbar: 'undo redo | bold | bullist numlist | forecolor | alignleft aligncenter alignright alignjustify | ltr rtl | image | link',  // Add ltr and rtl buttons to the toolbar
    menubar: false,
    height: 500,
    image_title: true,
    content_style: 'body { font-size: 22px; line-height: 140%; color:rgba(0,0,0,0.7) }',
    image_advtab: true,
    branding: false,
    paste_data_images: false,
    file_picker_types: 'image',
    automatic_uploads: false,
    image_uploadtab: false,
    images_reuse_filename: false,
    paste_as_text: true,
    paste_remove_styles_if_webkit: true,
    paste_remove_styles: true,
    paste_remove_spans: true,
    paste_strip_class_attributes: 'all',
    fontsize_formats: '8pt 10pt 12pt 14pt 18pt 24pt 36pt',
    link_default_target: '_blank',  // Optional: sets default target for links to open in a new tab
};

  constructor(
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private changeDetectorRef: ChangeDetectorRef,
    public _aboutUsService: AboutUsService,
    private router: Router
  ) {
    this.isLoading$ = this._aboutUsService.isLoading$;
  }

  ngOnInit(): void {
    this.initForm();
    this.getAboutUsInfo();
  }

  initForm() {
    this.aboutUsForm = this.fb.group({
      introTitleEnglish: ['', Validators.required],
      introTitleArabic: ['', Validators.required],
      titleEnglish: ['', Validators.required],
      titleArabic: ['', Validators.required],
      contentHtmlEnglish: ['', Validators.required],
      contentHtmlArabic: ['', Validators.required],
      missionEnglish: ['', Validators.required],
      missionArabic: ['', Validators.required],
    });
  }

  getAboutUsInfo() {
    const aboutUsInfoSub = this._aboutUsService.getAboutUs().subscribe({
      next: (res) => {
        this.aboutUs = res;
        this.loadData();
        this.changeDetectorRef.detectChanges();
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'An error occurred. Please try again.',
        });
        this.changeDetectorRef.detectChanges();
      }
    });

    this.unsubscribe.push(aboutUsInfoSub);
  }

  loadData() {
    this.aboutUsForm.patchValue({
      introTitleEnglish: this.aboutUs.introTitle.english,
      introTitleArabic: this.aboutUs.introTitle.arabic,
      titleEnglish: this.aboutUs.title.english,
      titleArabic: this.aboutUs.title.arabic,
      contentHtmlEnglish: this.aboutUs.contentHtml.english,
      contentHtmlArabic: this.aboutUs.contentHtml.arabic,
      missionEnglish: this.aboutUs.mission.english,
      missionArabic: this.aboutUs.mission.arabic,
    });
    this.previewUrl = this.sanitizer.bypassSecurityTrustUrl(this.aboutUs.image);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.errorMessage = "";
    if (file) {
      if (file.size > 400 * 1024) {
        this.errorMessage = "File size exceeds 400KB. Please choose a smaller file.";
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

  isFieldInvalid(fieldName: string): boolean {
    const field = this.aboutUsForm.get(fieldName);
    return !!field && field.invalid && (field.dirty || field.touched);
  }

  onSubmit() {
    if (this.aboutUsForm.valid) {
      const aboutUsData = this.prepareAboutUsObject();
      if (aboutUsData) {
        const submission$ = this._aboutUsService.updateAboutUs(aboutUsData).subscribe({
          next: (res) => {
            Swal.fire({
              icon: 'success',
              title: '',
              text: 'About Us updated successfully.',
              confirmButtonText: 'OK'
            }).then(() => {
              this.router.navigate(['/apps/a-b-system']);
            });
          },
          error: (err) => {
            Swal.fire('Error!', 'There was an error updating About Us.', 'error');
          }
        });

        this.unsubscribe.push(submission$);
      }
    }
  }

  prepareAboutUsObject(): any {
    const formValue = this.aboutUsForm.value;
    this.errorMessage = "";
    
    const updateData: any = {
      introTitle: {
        english: formValue.introTitleEnglish,
        arabic: formValue.introTitleArabic
      },
      title: {
        english: formValue.titleEnglish,
        arabic: formValue.titleArabic
      },
      contentHtml: {
        english: formValue.contentHtmlEnglish,
        arabic: formValue.contentHtmlArabic
      },
      mission: {
        english: formValue.missionEnglish,
        arabic: formValue.missionArabic
      }
    };

    if (this.selectedFile) {
      updateData.image = this.selectedFile;
    }

    return updateData;
  }
}