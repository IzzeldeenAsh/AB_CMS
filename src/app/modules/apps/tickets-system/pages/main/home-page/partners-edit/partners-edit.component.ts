import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { HomePagePranter, HomePagePrantersService } from 'src/app/services/home-page-parnters/homepage-partners.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-partners-edit',
  templateUrl: './partners-edit.component.html',
  styleUrl: './partners-edit.component.scss'
})
export class PartnersEditComponent implements OnInit, OnDestroy {
  partnersForm:FormGroup
  isLoading$: Observable<boolean>;
  private unsubscribe: Subscription[] = [];
  selectedFile: File | null = null;
  parternsData:HomePagePranter;
  tinymceConfig = {
    base_url: 'https://cdn.jsdelivr.net/npm/tinymce',
    suffix: '.min',
    plugins: [
        'image',
        'textcolor',
        'lists',
        'link',
        'directionality'
    ],
    toolbar: 'undo redo | bold | bullist numlist | forecolor | alignleft aligncenter alignright alignjustify | ltr rtl | image | link | mil_thin',
    menubar: false,
    height: 200,
    image_title: true,
    content_style: 'body { font-size: 22px; line-height: 140%; color:rgba(0,0,0,0.7) } .mil-thin { font-weight: 100; }',
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
    link_default_target: '_blank',
    formats: {
        mil_thin: { inline: 'span', classes: 'mil-thin' }
    },
    setup: function(editor:any) {
        editor.ui.registry.addToggleButton('mil_thin', {
            text: 'Mil Thin',
            onAction: function(_:any) {
                editor.execCommand('mceToggleFormat', false, 'mil_thin');
            },
            onSetup: function(api:any) {
                editor.formatter.formatChanged('mil_thin', function(state:any) {
                    api.setActive(state);
                });
                return function() {};
            }
        });
    }
};
  constructor(
    private fb:FormBuilder,
    private changeDetectorRef: ChangeDetectorRef,
    public _partnersService : HomePagePrantersService,
  ){this.isLoading$ = this._partnersService.isLoading$;}

  ngOnInit(): void {
    this.initForm();
    this.getPartnersData();
  }

  initForm(){
    this.partnersForm = this.fb.group({
      arabicTitle  : ["", Validators.required],
      englishTitle :["", Validators.required],
      arabicText  : ["", Validators.required],
      englishText :["", Validators.required],
    })
  }

  getPartnersData(){
    const data = this._partnersService.getHomePagePranter().subscribe(
      {
        next : (res)=>{
          this.parternsData = res ;
          this.loadData()
          this.changeDetectorRef.detectChanges()
    },
    error :(err)=>{
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'An error occurred. Please try again.',
      });
      this.changeDetectorRef.detectChanges()
    }
      }
    );

    this.unsubscribe.push(data)
  }

  loadData(){
    this.partnersForm.patchValue({
      arabicTitle  : this.parternsData.arabicTitle,
      englishTitle :this.parternsData.englishTitle,
      arabicText  : this.parternsData.arabicText,
      englishText :this.parternsData.englishText,
    });
  }
  
  isFieldInvalid(fieldName: string): boolean {
    const field = this.partnersForm.get(fieldName);
    return !!field && field.invalid && (field.dirty || field.touched);
  }

  onSubmit() {
    if (this.partnersForm.valid) {
      const partnersData: HomePagePranter = this.prepareData();
      const submission$ = this._partnersService.updateHomePagePranter(partnersData).subscribe({
        next: (res) => {
          Swal.fire({
            icon: 'success',
            title: '',
            text: 'Updated successfully.',
            confirmButtonText: 'OK'
          });
        },
        error: (err) => {
          Swal.fire(
            'Error!',
            'There was an error updating.',
            'error'
          );
        }
      });

      this.unsubscribe.push(submission$);
    }
  }

  prepareData(): HomePagePranter {
    return this.partnersForm.value;
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
