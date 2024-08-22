import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { NavigationCancel, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { KTHelpers } from 'src/app/_metronic/kt';
import { LayoutService } from '../../core/layout.service';
import { Tab, tabs } from './tabs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { abUser } from 'src/app/modules/auth/models/abUser.model';

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.scss'],
})
export class AsideComponent implements OnInit, OnDestroy {
  activeTab: Tab = tabs[0];
  asideMenuSecondary: boolean = true;
  private unsubscribe: Subscription[] = [];
  user: abUser;
  constructor(
    private layout: LayoutService,
    private cd: ChangeDetectorRef,
    private router: Router,
    private auth: AuthService,
  ) {}

  ngOnInit(): void {
    this.asideMenuSecondary = this.layout.getProp(
      'aside.secondaryDisplay'
    ) as boolean;
    this.user = this.auth.getUser();
  }

  routingChanges() {
    const routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd || event instanceof NavigationCancel) {
        KTHelpers.menuReinitialization();
      }
    });
    this.unsubscribe.push(routerSubscription);
  }

  setActiveTab = (
    activeTabLink:
      | 'projects'
      | 'menu'
      | 'subscription'
      | 'tasks'
      | 'notifications'
      | 'authors'
  ) => {
    const tab = tabs.find((t) => t.link === activeTabLink);
    if (tab) {
      this.activeTab = tab;
      this.cd.detectChanges();
      KTHelpers.menuReinitialization();
    }
  };

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
