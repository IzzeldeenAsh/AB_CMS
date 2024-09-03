import { Component } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {
  isLoading$:Observable<any>;
  editHero(){
  
  }

  editFeatured(){

  }

  editIndustrial(){

  }

  editGrid(){

  }

  editSuccessParnters(){
    
  }
}
