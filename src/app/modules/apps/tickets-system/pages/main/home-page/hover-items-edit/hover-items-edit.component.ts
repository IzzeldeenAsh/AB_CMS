import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { GetIndustrialDataService, industrialData } from 'src/app/services/get-industiral-subservices/get-industrial-data.service';
import { CombinedDataItem } from 'src/app/services/get-short-data/get-short-data.service';
import { hoverItem, hoverItemsService, UpdatehoverItem } from 'src/app/services/hover-cards/hover-cards.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-hover-items-edit',
  templateUrl: './hover-items-edit.component.html',
  styleUrl: './hover-items-edit.component.scss'
})
export class HoverItemsEditComponent implements OnInit, OnDestroy {
  isLoading$: Observable<boolean>;
  isLoadinghoveritems$: Observable<boolean>;
  combinedData:industrialData;
  allData:CombinedDataItem[];
  hoveritems:hoverItem[];
  updatedhoveritems: UpdatehoverItem[] = [];
  private unsubscribe: Subscription[] = [];
    constructor(
      private _getCombinedData:GetIndustrialDataService,
      private _gethoverdItems : hoverItemsService,
      private changeDetectorRef: ChangeDetectorRef,
    ){
      this.isLoading$ = this._getCombinedData.isLoading$
      this.isLoadinghoveritems$ =this._gethoverdItems.isLoading$
    }
  ngOnInit(): void {
   this.getShortData();
   this.gethoveritemsData();
  }

  getShortData(){
    const getData = this._getCombinedData.getCombinedData()
    .subscribe({
      next : (res)=>{
        this.combinedData = res
        this.allData = [...this.combinedData['subservices']]
        this.changeDetectorRef.detectChanges()
        console.log("this.allData",this.allData)
      },
      error : (err)=>{
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'An error occurred. Please try again.',
        });
        this.changeDetectorRef.detectChanges();
      }
    });
    
    this.unsubscribe.push(getData)
  }
  gethoveritemsData(){
    const getData = this._gethoverdItems.gethoverItems().subscribe({
      next : (res)=>{
        this.hoveritems = res;
        this.updatedhoveritems  = this.hoveritems.map((item)=>({id:item.id , type : item.type}))
        this.changeDetectorRef.detectChanges()
        console.log("this.hoveritems",this.hoveritems)
      },
      error : (err)=>{
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'An error occurred. Please try again.',
        });
        this.changeDetectorRef.detectChanges()
      }
    });
    
    
    this.unsubscribe.push(getData)
  }

  onFeaturedItemChange(index: number, event: Event) {
    const newItemId = (event.target as HTMLSelectElement).value;
    const newItem = this.allData.find(item => item.id === newItemId);
    if (newItem) {
      this.updatedhoveritems[index] = { id: newItem.id, type: newItem.type };
      this.hoveritems[index] = newItem;
    }
    console.log("updatedhoveritems", this.updatedhoveritems);
  }
  submithoveritems() {
    this._gethoverdItems.updatehoverItems(this.updatedhoveritems).subscribe({
      next: (res) => {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'hoveritems items updated successfully.',
        });
        this.gethoveritemsData(); // Refresh the data
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'An error occurred while updating hoveritems items. Please try again.',
        });
      }
    });
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
  


}

