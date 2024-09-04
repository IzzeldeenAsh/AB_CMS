import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { SubserviceService } from "src/app/services/subservice/subservice.service";
import { SectorsService } from "src/app/services/sectors/sectors.service";
import Swal from 'sweetalert2';
@Component({
  selector: "app-create-update-sector",
  templateUrl: "./create-update-sector.component.html",
  styleUrls: ["./create-update-sector.component.scss"],
})
export class CreateUpdateSectorComponent implements OnInit, OnDestroy {
  private unsubscribe: Subscription[] = [];
  selectedFile: File | null = null;
  previewUrl: SafeUrl | null = null;
  isEditMode: boolean = false;
  sectorId: string | null = null;
  relatedOptions: any[] = ["T", "C", "I", "O" ,"E" , "A" , "P" , "R" , "H" , "V" , "G" ,"B", "L" ,"M" , "D"];
  subservicesList: any; 
  createSectorForm: FormGroup;
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
    public sectorsService: SectorsService,
    private subserviceService: SubserviceService,
    private sanitizer: DomSanitizer,
    private changeDetectorRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.getAllSubservices();

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.sectorId = params['id'];
        if(this.sectorId) this.loadSector(this.sectorId);
      }
    });
  }

  initForm() {
    this.createSectorForm = this.fb.group({
      englishTitle: ["", Validators.required],
      breadColor: ["light", Validators.required],
      arabicTitle: ["", Validators.required],
      englishShort: ["", [Validators.required, Validators.maxLength(250)]],
      arabicShort: ["", [Validators.required, Validators.maxLength(250)]],
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

  loadSector(id: string) {
    const sectorSub = this.sectorsService.getSectorById(id).subscribe({
      next: (res) => {
        const sector  = res.results
        console.log("sector",sector)
        this.createSectorForm.patchValue({
          englishTitle: sector.title.english,
          arabicTitle: sector.title.arabic,
          breadColor: sector.breadColor ? sector.breadColor : "light",
          englishShort: sector.short.english,
          arabicShort: sector.short.arabic,
          englishSlogan: sector.description.title.english,
          arabicSlogan: sector.description.title.arabic,
          englishContent: sector.contentHTML.english,
          arabicContent: sector.contentHTML.arabic,
          HWCHList: sector.list.items,
          relatedSymbols: sector.related.split(','),
          keywords: sector.keywords.map((keyword: string) => ({ display: keyword, value: keyword }))
        });
        this.previewUrl = this.sanitizer.bypassSecurityTrustUrl(sector.imgURL);
        this.changeDetectorRef.detectChanges();
      },
      error: (error) => {
        console.error('Error loading sector', error);
      }
    });
    this.unsubscribe.push(sectorSub);
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
    const field = this.createSectorForm.get(fieldName);
    return !!field && field.invalid && (field.dirty || field.touched);
  }

  onSubmit() {
    if (this.createSectorForm.valid) {
      const formData = new FormData();
      const sectorData:any = this.prepareSectorObject();
      console.log("sectorData",sectorData)
      // Handle IDsymbol and breadColor separately
      formData.append('IDsymbol', sectorData.IDsymbol);
      formData.append('breadColor', sectorData.breadColor);
      formData.append('related', sectorData.related);

      // Handle other fields
      Object.keys(sectorData).forEach(key => {
        if (key !== 'IDsymbol' && key !== 'breadColor' && key !== 'related') {
          formData.append(key, JSON.stringify(sectorData[key]));
        }
      });

      if (this.selectedFile) {
        formData.append('imgURL', this.selectedFile, this.selectedFile.name);
      }

      const submission$ = this.isEditMode
        ? this.sectorsService.updateSector(this.sectorId!, formData)
        : this.sectorsService.createSector(formData);

      const submissionSub = submission$.subscribe({
        next: (response) => {
          const action = this.isEditMode ? 'updated' : 'created';
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: `Sector ${action} successfully.`,
            confirmButtonText: 'OK'
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(['/apps/a-b-system/sectors/all-sectors']);
            }
          });
        },
        error: (error) => {
          console.error(this.isEditMode ? 'Error updating sector' : 'Error creating sector', error);
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
      Object.keys(this.createSectorForm.controls).forEach(key => {
        const control = this.createSectorForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  prepareSectorObject() {
    const formValue = this.createSectorForm.value;
    console.log("keywords" ,this.createSectorForm.get('keywords')?.value)
    const date = new Date()
    return {
      IDsymbol: `Z${date}`, // You might want to make this dynamic
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
        title: {
          arabic: "كيف يمكننا مساعدتك",
          english: "How we can help"
        },
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