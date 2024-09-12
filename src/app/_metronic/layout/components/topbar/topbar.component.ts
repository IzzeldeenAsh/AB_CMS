import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { abUser } from "src/app/modules/auth/models/abUser.model";
import { AuthService } from "src/app/services/auth/auth.service";

@Component({
  selector: "app-topbar",
  templateUrl: "./topbar.component.html",
})
export class TopbarComponent implements OnInit, OnDestroy {
  user: abUser;
  constructor(
    private auth: AuthService,
    private route:Router
  ) {}

  itemClass: string = "ms-1 ms-lg-2";
  btnClass: string =
    "btn btn-icon btn-active-light btn-active-color-primary w-30px h-30px w-md-40px h-md-40px";
  toolbarButtonIconSizeClass: string = "svg-icon-1";
  ngOnInit(): void {
    this.user = this.auth.getUser();
  
  }
  logout() {
    this.auth.signOut();
    this.route.navigate(["/auth/signin"])
  }
  ngOnDestroy(): void {
   
  }
}
