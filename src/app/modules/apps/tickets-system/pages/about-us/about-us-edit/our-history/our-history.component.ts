import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { TimelineEntry, TimelineService } from 'src/app/services/timeline/timeline.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-our-history',
  templateUrl: './our-history.component.html',
  styleUrl: './our-history.component.scss'
})
export class OurHistoryComponent  implements OnInit, OnDestroy {
  timelineForm: FormGroup;
  isLoading$: Observable<boolean>;
  private unsubscribe: Subscription[] = [];
  timelineEntries: TimelineEntry[] = [];

  constructor(
    private fb: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef,
    public timelineService: TimelineService,
  ) {
    this.isLoading$ = this.timelineService.isLoading$;
  }

  ngOnInit(): void {
    this.initForm();
    this.getTimelineData();
  }

  initForm() {
    this.timelineForm = this.fb.group({
      id: [''],
      year: ['', Validators.required],
      titleEnglish: ['', Validators.required],
      titleArabic: ['', Validators.required],
      contentEnglish: ['', Validators.required],
      contentArabic: ['', Validators.required],
      logo :['']
    });
  }

  getTimelineData() {
    const data = this.timelineService.getTimeline().subscribe({
      next: (res) => {
        this.timelineEntries = res;
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

    this.unsubscribe.push(data);
  }

  loadData(entry: TimelineEntry) {
    this.timelineForm.patchValue({
      id: entry.id,
      year: entry.year,
      titleEnglish: entry.titleEnglish,
      titleArabic: entry.titleArabic,
      contentEnglish: entry.contentEnglish,
      contentArabic: entry.contentArabic,
      logo:entry.logo
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.timelineForm.get(fieldName);
    return !!field && field.invalid && (field.dirty || field.touched);
  }

  onSubmit() {
    if (this.timelineForm.valid) {
      const timelineData: TimelineEntry = this.prepareData();
      const submission$ = this.timelineService.updateTimelineEntry(timelineData).subscribe({
        next: (res) => {
          Swal.fire({
            icon: 'success',
            title: '',
            text: 'Updated successfully.',
            confirmButtonText: 'OK'
          });
          this.getTimelineData(); // Refresh the data after update
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

  prepareData(): TimelineEntry {
    return this.timelineForm.value;
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}