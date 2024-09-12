import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Job, JobsService } from 'src/app/services/Jobs/jobs-list.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vacancies',
  templateUrl: './vacancies.component.html',
  styleUrl: './vacancies.component.scss'
})
export class VacanciesComponent implements OnInit, OnDestroy {
  isLoading$: Observable<boolean>;
  private unsubscribe: Subscription[] = [];
  jobsList: Job[] = [];

  constructor(
    public _jobsService: JobsService,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router
  ) {
    this.isLoading$ = this._jobsService.isLoading$;
  }

  ngOnInit(): void {
    this.loadJobs();
  }

  loadJobs(): void {
    const getJobs = this._jobsService.getJobs()
      .subscribe({
        next: (res) => {
          this.jobsList = res;
          this.changeDetectorRef.detectChanges();
        },
        error: (err) => {
          this.showErrorAlert('Failed to load jobs. Please try again.');
        }
      });

    this.unsubscribe.push(getJobs);
  }

  editJob(jobId: number): void {
    this.router.navigate(['/apps/a-b-system/jobs/create-update-vacancies', jobId]);
  }

  deleteJob(jobId: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        const deleteJob = this._jobsService.deleteJob(jobId)
          .subscribe({
            next: () => {
              this.jobsList = this.jobsList.filter(job => job.id !== jobId);
              this.showSuccessAlert('Job has been deleted.');
              this.changeDetectorRef.detectChanges();
            },
            error: (err) => {
              this.showErrorAlert('Failed to delete job. Please try again.');
            }
          });

        this.unsubscribe.push(deleteJob);
      }
    });
  }

  showSuccessAlert(message: string): void {
    Swal.fire({
      icon: 'success',
      title: 'Success!',
      text: message,
    });
  }

  showErrorAlert(message: string): void {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: message,
    });
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}