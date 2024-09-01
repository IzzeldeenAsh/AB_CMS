import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { SubserviceService } from "src/app/services/subservice/subservice.service";
import { SectorsService } from "src/app/services/sectors/sectors.service";
import { ServiceService } from "src/app/services/service/service.service";
import Swal from 'sweetalert2';

@Component({
  selector: "app-create-update-subservice",
  templateUrl: "./create-update-subservice.component.html",
  styleUrls: ["./create-update-subservice.component.scss"],
})
export class CreateUpdateSubserviceComponent implements OnInit, OnDestroy {
  private unsubscribe: Subscription[] = [];
  selectedFile: File | null = null;
  previewUrl: SafeUrl | null = null;
  isEditMode: boolean = false;
  subserviceId: string | null = null;
  relatedOptions: any[] = ["T", "B", "C", "I"];
  createSubserviceForm: FormGroup;
  errorMessage: string | null = null;
  listOfSectors: any[] = [];
  listOfServices: any[] = [];
  infograph:any;
  tinymceConfig = {
    base_url: 'https://cdn.jsdelivr.net/npm/tinymce',
    suffix: '.min',
    plugins: [
      'image',
      'textcolor',
      'lists',
      'link'  // Add the link plugin
    ],
    toolbar: 'undo redo | bold | bullist numlist | forecolor | alignleft aligncenter alignright alignjustify | image | link',  // Add link to the toolbar
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
    extended_valid_elements: 'a[href|target|class]',
    custom_elements: 'a',
    formats: {
      customLink: { selector: 'a', classes: 'hyper-link' }
    },
    setup: function (editor:any) {
      editor.on('BeforeSetContent', function (e:any) {
        e.content = e.content.replace(/<a /g, '<a class="hyper-link" ');
      });
    }
};;
  
  constructor(
    private fb: FormBuilder,
    public subserviceService: SubserviceService,
    private sectorsService: SectorsService,
    private serviceService: ServiceService,
    private sanitizer: DomSanitizer,
    private changeDetectorRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadSectorsAndServices();

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.subserviceId = params['id'];
        if(this.subserviceId) this.loadSubservice(this.subserviceId);
      }
    });

    // Add value change subscription for debugging

  }

  initForm() {
    this.createSubserviceForm = this.fb.group({
      englishTitle: ["", Validators.required],
      arabicTitle: ["", Validators.required],
      englishShort: ["", [Validators.required, Validators.maxLength(170)]],
      arabicShort: ["", [Validators.required, Validators.maxLength(170)]],
      englishSlogan: ["", [Validators.required, Validators.maxLength(120)]],
      arabicSlogan: ["", [Validators.required, Validators.maxLength(120)]],
      englishContent: ["", Validators.required],
      arabicContent: ["", Validators.required],
      relatedSymbols: [[]],
      keywords: [[], [Validators.required, Validators.minLength(1)]],
      isPureSubsector: [false],
      parentServiceField: [null],
      parentSectorField: [null],
      // Add other fields as needed
    });

    // React to changes in isPureSubsector
    this.createSubserviceForm.get('isPureSubsector')?.valueChanges.subscribe(value => {
      if (value) {
        this.createSubserviceForm.get('parentSectorField')?.setValidators(Validators.required);
        this.createSubserviceForm.get('parentServiceField')?.clearValidators();
        this.createSubserviceForm.get('parentServiceField')?.setValue(null);
      } else {
        this.createSubserviceForm.get('parentServiceField')?.setValidators(Validators.required);
        this.createSubserviceForm.get('parentSectorField')?.clearValidators();
        this.createSubserviceForm.get('parentSectorField')?.setValue(null);
      }
      this.createSubserviceForm.get('parentSectorField')?.updateValueAndValidity();
      this.createSubserviceForm.get('parentServiceField')?.updateValueAndValidity();
    });
  }

  loadSectorsAndServices() {
    const sectorsSub = this.sectorsService.getSectors().subscribe({
      next: (res) => {
        if (res.code === 1 && res.results) {
          this.listOfSectors = res.results.map((sector: any) => ({
            id: sector.id,
            title: sector.title.english
          }));
        }
        this.changeDetectorRef.detectChanges();
      },
      error: (err) => {
        console.error('Error loading sectors', err);
      }
    });

    const servicesSub = this.serviceService.getAllServices().subscribe({
      next: (res) => {
        if (res.code === 1 && res.results) {
          this.listOfServices = res.results.map((service: any) => ({
            id: service.id,
            title: service.title.english
          }));
        
         
        }
        this.changeDetectorRef.detectChanges();
      },
      error: (err) => {
        console.error('Error loading services', err);
      }
    });

    this.unsubscribe.push(sectorsSub, servicesSub);
  }

  loadSubservice(id: string) {
    const subserviceSub = this.subserviceService.getSubserviceById(id).subscribe({
      next: (res) => {
        const subservice = res.results;
        if(subservice.infograph){this.infograph = subservice.infograph}else{this.infograph={
          enabled: 0,
          name: "Goals"
        }}
        this.createSubserviceForm.patchValue({
          englishTitle: subservice.title.english,
          arabicTitle: subservice.title.arabic,
          englishShort: subservice.short.english,
          arabicShort: subservice.short.arabic,
          englishSlogan: subservice.slogan.english,
          arabicSlogan: subservice.slogan.arabic,
          englishContent: subservice.contentHtml.english,
          arabicContent: subservice.contentHtml.arabic,
          relatedSymbols: subservice.related,
          keywords: subservice.keywords.map((keyword: string) => ({ display: keyword, value: keyword })),
          isPureSubsector: subservice.isPureSubsector,
          parentServiceField: subservice.service,
          parentSectorField: subservice.sector,
        });
  
        // Ensure the correct field is set based on isPureSubsector
        if (subservice.isPureSubsector) {
          this.createSubserviceForm.get('parentSectorField')?.setValue(subservice.sector);
          this.createSubserviceForm.get('parentServiceField')?.setValue(null);
        } else {
          this.createSubserviceForm.get('parentServiceField')?.setValue(subservice.service);
          this.createSubserviceForm.get('parentSectorField')?.setValue(null);
        }
  
        this.previewUrl = this.sanitizer.bypassSecurityTrustUrl(subservice.imgURL);
        this.changeDetectorRef.detectChanges();
      },
      error: (error) => {
        console.error('Error loading subservice', error);
      }
    });
    this.unsubscribe.push(subserviceSub);
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
    const field = this.createSubserviceForm.get(fieldName);
    return !!field && field.invalid && (field.dirty || field.touched);
  }
  onSubmit() {
    if (this.createSubserviceForm.valid) {
      const formData = new FormData();
      const subserviceData:any = this.prepareSubserviceObject();
      
      Object.keys(subserviceData).forEach(key => {
        formData.append(key, JSON.stringify(subserviceData[key]));
      });

      if (this.selectedFile) {
        formData.append('imgURL', this.selectedFile, this.selectedFile.name);
      }
   
      const submission$ = this.isEditMode
        ? this.subserviceService.updateSubservice(this.subserviceId!, formData)
        : this.subserviceService.createSubservice(formData);

      const submissionSub = submission$.subscribe({
        next: (response) => {
          const action = this.isEditMode ? 'updated' : 'created';
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: `Subservice ${action} successfully.`,
            confirmButtonText: 'OK'
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(['/apps/a-b-system/subservices/all-subservices']);
            }
          });
        },
        error: (error) => {
          console.error(this.isEditMode ? 'Error updating subservice' : 'Error creating subservice', error);
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
      Object.keys(this.createSubserviceForm.controls).forEach(key => {
        const control = this.createSubserviceForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  prepareSubserviceObject() {
    const formValue = this.createSubserviceForm.value;
    return {
      IDsymbol: "Z1", // You might want to make this dynamic
      title: {
        arabic: formValue.arabicTitle,
        english: formValue.englishTitle
      },
      introTitle:{
        arabic: formValue.arabicTitle,
        english: formValue.englishTitle
      },
      short: {
        arabic: formValue.arabicShort,
        english: formValue.englishShort
      },
      slogan: {
        arabic: formValue.arabicSlogan,
        english: formValue.englishSlogan
      },
      contentHtml: {
        arabic: formValue.arabicContent,
        english: formValue.englishContent
      },
      related: formValue.relatedSymbols,
      keywords: formValue.keywords.map((val: any) => val.value),
      isPureSubsector: formValue.isPureSubsector,
      sector: formValue.isPureSubsector ? formValue.parentSectorField  : null,
      service: !formValue.isPureSubsector ? formValue.parentServiceField   : null,
      infograph : this.infograph ? this.infograph : {
        "enabled": 0,
        "name": "Goals"
      }
      // Add other fields as needed
    };
  
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}