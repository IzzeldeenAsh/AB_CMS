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
  }else{
    this.errorMessage = "Please Upload a picture"
  }
  
}
}
