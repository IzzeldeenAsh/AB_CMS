import { Component, OnInit, OnDestroy, ChangeDetectorRef } from "@angular/core";
import { Observable, Subscription } from "rxjs";
import { ServiceService } from "src/app/services/service/service.service";
import { Router } from "@angular/router";
import Swal from "sweetalert2";

@Component({
  selector: 'app-all-services',
  templateUrl: './all-services.component.html',
  styleUrls: ['./all-services.component.scss']
})
export class AllServicesComponent implements OnInit, OnDestroy {
  servicesList: any[] = [];
  filteredServicesList: any[] = [];
  searchQuery: string = '';
  private unsubscribe: Subscription[] = [];
  isLoading$: Observable<boolean>;

  constructor(
    private _service: ServiceService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.isLoading$ = this._service.isLoading$;
  }

  ngOnInit(): void {
    this.getAllServices();
  }

  searchServices(): void {
    if (!this.searchQuery.trim()) {
      this.filteredServicesList = this.servicesList;
    } else {
      this.filteredServicesList = this.servicesList.filter((service: any) =>
        service.title?.english?.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
    this.changeDetectorRef.detectChanges();
  }

  getAllServices(): void {
    const servicesSub = this._service.getAllServices().subscribe({
      next: (res) => {
        if (res.code === 1) {
          if (res.results) {
            this.servicesList = res.results;
            this.filteredServicesList = this.servicesList;
            this.changeDetectorRef.detectChanges();
          }
        } else {
          this.servicesList = [];
          this.changeDetectorRef.detectChanges();
        }
      },
      error: (err) => {
        console.error('Error fetching services:', err);
        this.servicesList = [];
        this.changeDetectorRef.detectChanges();
      }
    });
    this.unsubscribe.push(servicesSub);
  }

  editService(id: string): void {
    this.router.navigate([`/apps/a-b-system/services/edit-service/${id}`]);
  }

  deleteService(id: string): void {
    Swal.fire({
      title: `Are you sure to delete this service?`,
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
      const unsubfromDelet =  this._service.deleteService(id).subscribe({
        next : (res)=>{
          Swal.fire({
            icon: 'success',
            title: '',
            text: 'Sector deleted successfully.',
            confirmButtonText: 'OK'
          })
          this.getAllServices();
        },
        error : (err)=>{
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'An error occurred. Please try again.',
          })
        }
      });

      this.unsubscribe.push(unsubfromDelet)
      }
    });
  
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}