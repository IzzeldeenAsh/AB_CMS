import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { CombinedData, CombinedDataService } from 'src/app/services/get-short-data/get-short-data.service';
import { GridItem, GridItemsService, UpdateGridItem } from 'src/app/services/grid-items/grid-items.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-grid-edit',
  templateUrl: './grid-edit.component.html',
  styleUrl: './grid-edit.component.scss'
})
export class GridEditComponent  implements OnInit, OnDestroy {
  isLoading$: Observable<boolean>;
  isLoadingFeatured$: Observable<boolean>;
  combinedData:CombinedData;
  allData:GridItem[];
  gridItems:GridItem[];
  updatedGridItems: UpdateGridItem[] = [];
  private unsubscribe: Subscription[] = [];
  constructor(
    private _getCombinedData:CombinedDataService,
    private _getGridItems : GridItemsService,
    private changeDetectorRef: ChangeDetectorRef,
  ){
    this.isLoading$ = this._getCombinedData.isLoading$
    this.isLoadingFeatured$ =this._getGridItems.isLoading$
  }


  ngOnInit(): void {
    this.getShortData();
    this.getGridData();
   }
   getShortData(){
    const getData = this._getCombinedData.getCombinedData()
    .subscribe({
      next : (res)=>{
        this.combinedData = res
        this.allData = [...this.combinedData['services'],...this.combinedData['subservices'], ...this.combinedData['sectors']]
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
  getGridData(){
    const getData = this._getGridItems.getGridItems().subscribe({
      next : (res)=>{
        this.gridItems = res;
        this.updatedGridItems  = this.gridItems.map((item)=>({id:item.id , type : item.type}))
        this.changeDetectorRef.detectChanges()
        console.log("this.featuredItems",this.gridItems)
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
      this.updatedGridItems[index] = { id: newItem.id, type: newItem.type };
      this.gridItems[index] = newItem;
    }
    console.log("updatedFeaturedItems", this.updatedGridItems);
  }
  submitFeaturedItems() {
    this._getGridItems.updateGridItems(this.updatedGridItems).subscribe({
      next: (res) => {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Featured items updated successfully.',
        });
        this.getGridData(); // Refresh the data
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'An error occurred while updating featured items. Please try again.',
        });
      }
    });
  }
  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
  
}
