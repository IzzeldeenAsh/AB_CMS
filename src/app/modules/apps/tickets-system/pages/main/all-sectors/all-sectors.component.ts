import { Component, OnInit, OnDestroy, ChangeDetectorRef } from "@angular/core";
import { paginationsList, Question, questionsList } from "../../../models";
import { Observable, Subscription } from "rxjs";
import { SectorsService } from "src/app/services/sectors/sectors.service";
import { Router } from "@angular/router";


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

  getAllSectors(){
  const sectorsSub =   this._sectors.getSectors().subscribe({
    next : (res)=>{
      if(res.code === 1){
        if(res.results){
          this.sectorsList = res.results;
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
    
  }


  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}

