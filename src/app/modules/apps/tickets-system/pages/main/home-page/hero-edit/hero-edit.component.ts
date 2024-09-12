import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Hero, HeroService, HeroUpdateData } from 'src/app/services/hero/hero.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-hero-edit',
  templateUrl: './hero-edit.component.html',
  styleUrl: './hero-edit.component.scss'
})
export class HeroEditComponent implements OnInit, OnDestroy {
heroFrom:FormGroup;
errorMessage: string | null = null;
isLoading$: Observable<boolean>;
private unsubscribe: Subscription[] = [];
selectedFile: File | null = null;
previewUrl: SafeUrl | null = null;
hero:Hero ;
isEditMode: boolean = false;
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
  toolbar: 'undo redo | bold | forecolor | alignleft aligncenter alignright alignjustify | ltr rtl ',  // Add ltr and rtl buttons to the toolbar
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
  private fb:FormBuilder,
  private sanitizer: DomSanitizer,
  private changeDetectorRef: ChangeDetectorRef,
  public _heroService : HeroService,
  private router:Router
){this.isLoading$ = this._heroService.isLoading$;}
 

ngOnInit(): void {
  this.initForm();
  this.getHeroInfo();
}

initForm(){
  this.heroFrom = this.fb.group({
    heroArabicTitle  : ["", Validators.required],
    heroEnglishTitle :["", Validators.required],
    heroArabicSlogan  : ["", Validators.required],
    heroEnglishSlogan :["", Validators.required],
    heroEnglishDescription  : ["", Validators.required],
    heroArabicDescription :["", Validators.required],
  })
}

getHeroInfo(){
  const heroinfoSub = this._heroService.getHero().subscribe({
next : (res)=>{
      this.hero = res ;
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
  });

  this.unsubscribe.push(heroinfoSub)
}

loadData(){
  this.heroFrom.patchValue({
    heroArabicTitle : this.hero.heroTitle.arabic,
    heroEnglishTitle : this.hero.heroTitle.english,
    heroArabicSlogan : this.hero.heroSlogan.arabic,
    heroEnglishSlogan : this.hero.heroSlogan.english,
    heroEnglishDescription: this.hero.heroDescription.english,
    heroArabicDescription : this.hero.heroDescription.arabic
  });
  this.previewUrl = this.sanitizer.bypassSecurityTrustUrl(this.hero.heroImage);
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
  const field = this.heroFrom.get(fieldName);
  return !!field && field.invalid && (field.dirty || field.touched);
}


onSubmit(){
  if (this.heroFrom.valid) {
    const heroData:HeroUpdateData | undefined =this.prepareHeroObject();
    if (heroData) {
      const submisstion$ = this._heroService.updateHero(heroData).subscribe({
        next: (res) =>{
          if(res){
            Swal.fire({
              icon: 'success',
              title: '',
              text: 'Hero updated successfully.',
              confirmButtonText: 'OK'
            }).then(()=>{
              this.router.navigate(['/apps/a-b-system'])
            })
          }
        },
        error : (err)=>{
          Swal.fire(
            'Error!',
            'There was an error updating hero.',
            'error'
          );
        }
      });

      this.unsubscribe.push(submisstion$)
    }
   
  }
 
  
}

prepareHeroObject(){
  const formValue = this.heroFrom.value;
  this.errorMessage = ""
  if(this.selectedFile){
    return {
      heroImage : this.selectedFile,
      heroSlogan : {
        arabic : formValue.heroArabicSlogan,
        english :formValue.heroEnglishSlogan
      },
      heroTitle :{
        arabic : formValue.heroArabicTitle,
        english :formValue.heroEnglishTitle
      },
      heroDescription :{
        arabic : formValue.heroArabicDescription,
        english :formValue.heroEnglishDescription
      }
    }
  }else if(this.previewUrl){
    return {
      heroSlogan : {
        arabic : formValue.heroArabicSlogan,
        english :formValue.heroEnglishSlogan
      },
      heroTitle :{
        arabic : formValue.heroArabicTitle,
        english :formValue.heroEnglishTitle
      },
      heroDescription :{
        arabic : formValue.heroArabicDescription,
        english :formValue.heroEnglishDescription
      }
    }
  }
  else{
    this.errorMessage = "Please Upload a picture"
  }
  
}
}
