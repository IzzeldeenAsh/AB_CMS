import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-about-us-edit',
  templateUrl: './about-us-edit.component.html',
  styleUrl: './about-us-edit.component.scss'
})
export class AboutUsEditComponent {
  constructor(private route:Router){}
  editAbout(){
    this.route.navigate(['/apps/a-b-system/about-us/our-company'])
  }

  editHistory(){
    this.route.navigate(['/apps/a-b-system/about-us/our-history'])
  }
}
