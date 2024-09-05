import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {
  constructor(private router:Router){

  }
  isLoading$:Observable<any>;
  editHero(){
  this.router.navigate(["/apps/a-b-system/update-hero"])
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
