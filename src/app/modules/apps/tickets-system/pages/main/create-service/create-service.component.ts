import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ServiceService } from 'src/app/services/service/service.service';
import { SubserviceService } from 'src/app/services/subservice/subservice.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-service',
  templateUrl: './create-service.component.html',
  styleUrl: './create-service.component.scss'
})
export class CreateServiceComponent   implements OnInit, OnDestroy{
  private unsubscribe: Subscription[] = [];
  selectedFile: File | null = null;
  previewUrl: SafeUrl | null = null;
  isEditMode: boolean = false;
  serviceId: string | null = null;
  subservicesList: any;
  createServiceForm: FormGroup;
  relatedOptions: any[] = ["T", "C", "I", "O" ,"E" , "A" , "P" , "R" , "H" , "V" , "G" ,"B", "L" ,"M" , "D"];
  errorMessage: string | null = null;
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
  public serviceService: ServiceService,
  private subserviceService: SubserviceService,
  private sanitizer: DomSanitizer,
  private changeDetectorRef: ChangeDetectorRef,
  private route: ActivatedRoute,
  private router: Router
){

}
  ngOnInit(): void {
    this.initForm();
    this.getAllSubservices();
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.serviceId = params['id'];
        if(this.serviceId) this.loadService(this.serviceId);
      }
    });
  }

  initForm() {
    this.createServiceForm = this.fb.group({
      englishTitle: ["", Validators.required],
      breadColor: ["light", Validators.required],
      arabicTitle: ["", Validators.required],
      englishShort: ["", [Validators.required]],
      arabicShort: ["", [Validators.required]],
      englishSlogan: ["", [Validators.required, Validators.maxLength(120)]],
      arabicSlogan: ["", [Validators.required, Validators.maxLength(120)]],
      englishContent: ["", Validators.required],
      arabicContent: ["", Validators.required],
      HWCHList: [[], []],
      relatedSymbols: [[]],
      keywords: [[], [Validators.required, Validators.minLength(1)]]
    });
  }

  getAllSubservices() {
    const subservicesSub = this.subserviceService.getAllSubservices().subscribe({
      next: (res) => {
        if (res.code === 1 && res.results) {
          this.subservicesList = res.results.map((sub: any) => ({
            id: sub.id,
            title: sub.title.english
          }));
        } else {
          this.subservicesList = [];
        }
        this.changeDetectorRef.detectChanges();
      },
      error: (err) => {
        this.subservicesList = [];
        this.changeDetectorRef.detectChanges();
      }
    });
    this.unsubscribe.push(subservicesSub);
  }

  loadService(id: string) {
    const serviceSub = this.serviceService.getServiceById(id).subscribe({
      next: (res) => {
        const service  = res.results
        console.log("sector",service)
        this.createServiceForm.patchValue({
          englishTitle: service.title.english,
          arabicTitle: service.title.arabic,
          breadColor: service.breadColor ? service.breadColor : "light",
          englishShort: service.short.english,
          arabicShort: service.short.arabic,
          englishSlogan: service.description.title.english,
          arabicSlogan: service.description.title.arabic,
          englishContent: service.contentHTML.english,
          arabicContent: service.contentHTML.arabic,
          HWCHList: service.list.items,
          relatedSymbols: service.related.split(','),
          keywords: service.keywords.map((keyword: string) => ({ display: keyword, value: keyword }))
        });
        this.previewUrl = this.sanitizer.bypassSecurityTrustUrl(service.imgURL);
        this.changeDetectorRef.detectChanges();
      },
      error: (error) => {
        console.error('Error loading sector', error);
      }
    });
    this.unsubscribe.push(serviceSub);
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
    const field = this.createServiceForm.get(fieldName);
    return !!field && field.invalid && (field.dirty || field.touched);
  }
  onSubmit() {
    if (this.createServiceForm.valid) {
      const formData = new FormData();
      const serviceData:any = this.prepareSectorObject();
      console.log("serviceData",serviceData)
      // Handle IDsymbol and breadColor separately
      formData.append('IDsymbol', serviceData.IDsymbol);
      formData.append('breadColor', serviceData.breadColor);
      formData.append('related', serviceData.related);

      // Handle other fields
      Object.keys(serviceData).forEach(key => {
        if (key !== 'IDsymbol' && key !== 'breadColor' && key !== 'related') {
          formData.append(key, JSON.stringify(serviceData[key]));
        }
      });

      if (this.selectedFile) {
        formData.append('imgURL', this.selectedFile, this.selectedFile.name);
      }

      const submission$ = this.isEditMode
        ? this.serviceService.updateService(this.serviceId!, formData)
        : this.serviceService.createService(formData);

      const submissionSub = submission$.subscribe({
        next: (response) => {
          const action = this.isEditMode ? 'updated' : 'created';
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: `Service ${action} successfully.`,
            confirmButtonText: 'OK'
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(['/apps/a-b-system/services/all-services']);
            }
          });
        },
        error: (error) => {
          console.error(this.isEditMode ? 'Error updating service' : 'Error creating service', error);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'An error occurred. Please try again.',
            confirmButtonText: 'OK'
          });
        }
      });

      this.unsubscribe.push(submissionSub);
    } else {
      Object.keys(this.createServiceForm.controls).forEach(key => {
        const control = this.createServiceForm.get(key);
        control?.markAsTouched();
      });
    }
  }



  prepareSectorObject() {
    const formValue = this.createServiceForm.value;
    const date = new Date()
    return {
      IDsymbol: `Y${date}`, // You might want to make this dynamic
      breadColor: formValue.breadColor,
      contentHTML: {
        arabic: formValue.arabicContent,
        english: formValue.englishContent
      },
      title: {
        arabic: formValue.arabicTitle,
        english: formValue.englishTitle
      },
      preview_title: {
        arabic: formValue.arabicTitle,
        english: formValue.englishTitle
      },
      short: {
        arabic: formValue.arabicShort,
        english: formValue.englishShort
      },
      introTitle: {
        arabic: formValue.arabicTitle,
        english: formValue.englishTitle
      },
      description: {
        title: {
          arabic: formValue.arabicSlogan,
          english: formValue.englishSlogan
        },
        content: {
          arabic: formValue.arabicContent,
          english: formValue.englishContent
        }
      },
      list: {
        items: formValue.HWCHList
      },
      related: formValue.relatedSymbols.join(','),
      keywords: formValue.keywords.map((val: any) => val.value)
    };
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
