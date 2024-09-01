import { Component, OnInit, OnDestroy, ChangeDetectorRef } from "@angular/core";
import { paginationsList, Question, questionsList } from "../../../models";
import { Observable, Subscription } from "rxjs";
import { SectorsService } from "src/app/services/sectors/sectors.service";
import { Router } from "@angular/router";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-all-sectors',
  templateUrl: './all-sectors.component.html',
  styleUrl: './all-sectors.component.scss'
})
export class AllSectorsComponent  implements OnInit, OnDestroy {
  questions: ReadonlyArray<Question> = [];
  paginations: ReadonlyArray<string> = [];
  private unsubscribe: Subscription[] = [];
  isLoading$: Observable<boolean>;
  sectorsList :any;
  subservicesList:any;
  filteredSectorsList:any;
  searchQuery:string;
  constructor(private _sectors:SectorsService    ,
    private router:Router,
    private changeDetectorRef: ChangeDetectorRef) {
    this.isLoading$ = this._sectors.isLoading$
  }

  ngOnInit(): void {
    this.questions = questionsList;
    this.paginations = paginationsList;
    this.getAllSectors();
  
  }
  searchSectors(): void {
    if (!this.searchQuery.trim()) {
      this.filteredSectorsList = this.sectorsList;
    } else {
      this.filteredSectorsList = this.sectorsList.filter((sector: any) =>
        sector.title?.english?.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
    this.changeDetectorRef.detectChanges();
  }

  getAllSectors(){
  const sectorsSub =   this._sectors.getSectors().subscribe({
    next : (res)=>{
      if(res.code === 1){
        if(res.results){
          this.sectorsList = res.results;
          this.filteredSectorsList =this.sectorsList
          this.changeDetectorRef.detectChanges()
        }
      
      }else{
        this.sectorsList = [];
        this.changeDetectorRef.detectChanges()
      }
    },
    error : (err)=>{
      this.sectorsList = [];
      this.changeDetectorRef.detectChanges()
    }
  });
  this.unsubscribe.push(sectorsSub);
  }

  editSector(id:string){
    this.router.navigate([`/apps/a-b-system/sectors/create-sector/${id}`])
  }

  deleteSector(id:string){
    Swal.fire({
      title: `Are you sure to delete this sector?`,
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
      const unsubfromDelet =  this._sectors.deleteSector(id).subscribe({
        next : (res)=>{
          Swal.fire({
            icon: 'success',
            title: '',
            text: 'Sector deleted successfully.',
            confirmButtonText: 'OK'
          })
          this.getAllSectors();
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


  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}

