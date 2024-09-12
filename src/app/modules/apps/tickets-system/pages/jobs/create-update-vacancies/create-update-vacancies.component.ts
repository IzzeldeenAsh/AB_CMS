import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators, FormArray } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { JobsService, Job, JobInput } from "src/app/services/Jobs/jobs-list.service";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-update-vacancies',
  templateUrl: './create-update-vacancies.component.html',
  styleUrl: './create-update-vacancies.component.scss'
})
export class CreateUpdateVacanciesComponent  implements OnInit, OnDestroy {
  private unsubscribe: Subscription[] = [];
  isEditMode: boolean = false;
  jobId: number | null = null;
  createJobForm: FormGroup;
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
    public jobsService: JobsService,
    private changeDetectorRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.jobId = +params['id'];
        this.loadJob(this.jobId);
      }
    });
  }

  initForm() {
    this.createJobForm = this.fb.group({
      interest: this.fb.group({
        arabic: ["", Validators.required],
        english: ["", Validators.required]
      }),
      title: this.fb.group({
        arabic: ["", Validators.required],
        english: ["", Validators.required]
      }),
      description: this.fb.group({
        arabic: ["", Validators.required],
        english: ["", Validators.required]
      }),
      link: ["/link", Validators.required],
      cities: this.fb.array([]),
      availability: ["", Validators.required] // Add this field
    });
  }

  get citiesFormArray() {
    return this.createJobForm.get('cities') as FormArray;
  }

  addCity() {
    const cityForm = this.fb.group({
      arabic: ['', Validators.required],
      english: ['', Validators.required]
    });
    this.citiesFormArray.push(cityForm);
  }

  removeCity(index: number) {
    this.citiesFormArray.removeAt(index);
  }

  loadJob(id: number) {
    const jobSub = this.jobsService.getJobById(id).subscribe({
      next: (job) => {
        this.createJobForm.patchValue({
          interest: job.interest,
          title: job.title,
          description: job.description,
          link: job.link,
          availability: job.availability // Load this field
        });
        job.cities.forEach(city => {
          this.citiesFormArray.push(this.fb.group({
            arabic: [city.arabic, Validators.required],
            english: [city.english, Validators.required]
          }));
        });
        this.changeDetectorRef.detectChanges();
      },
      error: (error) => {
        console.error('Error loading job', error);
        this.errorMessage = 'Failed to load job details.';
      }
    });
    this.unsubscribe.push(jobSub);
  }
  isFieldInvalid(fieldName: string): boolean {
    const field = this.createJobForm.get(fieldName);
    return !!field && field.invalid && (field.dirty || field.touched);
  }

  onSubmit() {
    if (this.createJobForm.valid) {
      const jobData: JobInput = this.createJobForm.value;
      
      const submission$ = this.isEditMode
        ? this.jobsService.updateJob({ ...jobData, id: this.jobId! })
        : this.jobsService.createJob(jobData);
  
      const submissionSub = submission$.subscribe({
        next: (response) => {
          const action = this.isEditMode ? 'updated' : 'created';
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: `Job ${action} successfully.`,
            confirmButtonText: 'OK'
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(['/apps/a-b-system/jobs/vacancies']); // Adjust this route as needed
            }
          });
        },
        error: (error) => {
          console.error(this.isEditMode ? 'Error updating job' : 'Error creating job', error);
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
      Object.keys(this.createJobForm.controls).forEach(key => {
        const control = this.createJobForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}