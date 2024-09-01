import { Component, OnInit, OnDestroy, ChangeDetectorRef } from "@angular/core";
import { Observable, Subscription } from "rxjs";
import { SubserviceService } from "src/app/services/subservice/subservice.service";
import { Router } from "@angular/router";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-all-subservices',
  templateUrl: './all-subservices.component.html',
  styleUrls: ['./all-subservices.component.scss']
})
export class AllSubservicesComponent implements OnInit, OnDestroy {
  subservicesList: any[] = [];
  filteredSubservicesList: any[] = [];
  private unsubscribe: Subscription[] = [];
  isLoading$: Observable<boolean>;
  searchQuery: string = '';

  constructor(
    private _subservices: SubserviceService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.isLoading$ = this._subservices.isLoading$;
  }

  ngOnInit(): void {
    this.getAllSubservices();
  }

  searchSubservices(): void {
    if (!this.searchQuery.trim()) {
      this.filteredSubservicesList = this.subservicesList;
    } else {
      this.filteredSubservicesList = this.subservicesList.filter((subservice: any) =>
        subservice.title?.english?.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
    this.changeDetectorRef.detectChanges();
  }

  getAllSubservices() {
    const subservicesSub = this._subservices.getAllSubservices().subscribe({
      next: (res) => {
        if (res.code === 1) {
          if (res.results) {
            this.subservicesList = res.results;
            this.filteredSubservicesList = this.subservicesList;
            this.changeDetectorRef.detectChanges();
          }
        } else {
          this.subservicesList = [];
          this.changeDetectorRef.detectChanges();
        }
      },
      error: (err) => {
        this.subservicesList = [];
        this.changeDetectorRef.detectChanges();
      }
    });
    this.unsubscribe.push(subservicesSub);
  }

  editSubservice(id: string) {
    this.router.navigate([`/apps/a-b-system/subservices/edit-subservices/${id}`]);
  }

  deleteSubservice(id: string) {
    Swal.fire({
      title: `Are you sure to delete this subservice?`,
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        const unsubfromDelete = this._subservices.deleteSubservice(id).subscribe({
          next: (res) => {
            Swal.fire({
              icon: 'success',
              title: '',
              text: 'Subservice deleted successfully.',
              confirmButtonText: 'OK'
            });
            this.getAllSubservices();
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'An error occurred. Please try again.',
            });
          }
        });

        this.unsubscribe.push(unsubfromDelete);
      }
    });
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}