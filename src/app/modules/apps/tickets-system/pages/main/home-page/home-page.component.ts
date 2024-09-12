import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent {
  isLoading$: Observable<boolean>;

  sections = [
    { name: 'Hero', editFunction: () => this.editHero() },
    { name: 'Featured', editFunction: () => this.editFeatured() },
    { name: 'Industrial Services', editFunction: () => this.editIndustrial() },
    { name: 'Grid Services', editFunction: () => this.editGrid() },
    { name: 'Success Partners', editFunction: () => this.editSuccessParnters() }
  ];

  constructor(private router: Router) {}

  editHero() {
    this.router.navigate(["/apps/a-b-system/update-hero"]);
  }

  editFeatured() {
    this.router.navigate(["/apps/a-b-system/update-featured"]);
  }

  editIndustrial() {
    this.router.navigate(["/apps/a-b-system/hover-items-edit"]);
  }

  editGrid() {
    this.router.navigate(["/apps/a-b-system/update-grid"]);
  }

  editSuccessParnters() {
    this.router.navigate(["/apps/a-b-system/partners-edit"]);
  }
}