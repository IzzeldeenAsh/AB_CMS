import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { FeaturedItem, FeaturedItemsService, UpdateFeaturedItem } from 'src/app/services/featured/featured.service';
import { CombinedData, CombinedDataItem, CombinedDataService } from 'src/app/services/get-short-data/get-short-data.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-featured-edit',
  templateUrl: './featured-edit.component.html',
  styleUrl: './featured-edit.component.scss'
})
export class FeaturedEditComponent  implements OnInit, OnDestroy {
  isLoading$: Observable<boolean>;
  isLoadingFeatured$: Observable<boolean>;
  combinedData:CombinedData;
  allData:CombinedDataItem[];
  featuredItems:FeaturedItem[];
  updatedFeaturedItems: UpdateFeaturedItem[] = [];
  private unsubscribe: Subscription[] = [];
    constructor(
      private _getCombinedData:CombinedDataService,
      private _getFeaturedData : FeaturedItemsService,
      private changeDetectorRef: ChangeDetectorRef,
    ){
      this.isLoading$ = this._getCombinedData.isLoading$
      this.isLoadingFeatured$ =this._getFeaturedData.isLoading$
    }
  ngOnInit(): void {
   this.getShortData();
   this.getFeaturedData();
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
  getFeaturedData(){
    const getData = this._getFeaturedData.getFeaturedItems().subscribe({
      next : (res)=>{
        this.featuredItems = res;
        this.updatedFeaturedItems  = this.featuredItems.map((item)=>({id:item.id , type : item.type}))
        this.changeDetectorRef.detectChanges()
        console.log("this.featuredItems",this.featuredItems)
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
      this.updatedFeaturedItems[index] = { id: newItem.id, type: newItem.type };
      this.featuredItems[index] = newItem;
    }
    console.log("updatedFeaturedItems", this.updatedFeaturedItems);
  }
  submitFeaturedItems() {
    this._getFeaturedData.updateFeaturedItems(this.updatedFeaturedItems).subscribe({
      next: (res) => {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Featured items updated successfully.',
        });
        this.getFeaturedData(); // Refresh the data
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
