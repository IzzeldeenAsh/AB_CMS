import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TicketsSystemComponent } from "./tickets-system.component";
import { AskComponent } from "./pages/ask/ask.component";
import { MainComponent } from "./pages/main/main.component";
import { QuestionsComponent } from "./pages/questions/questions.component";
import { SearchComponent } from "./pages/search/search.component";
import { TagComponent } from "./pages/tag/tag.component";
import { ReplyComponent } from "./pages/reply/reply.component";
import { EmailsSettingsComponent } from "./pages/email-settings/emails-settings.component";
import { AllSectorsComponent } from "./pages/main/all-sectors/all-sectors.component";
import { CreateUpdateSectorComponent } from "./pages/main/create-sector/create-update-sector.component";
import { AllServicesComponent } from "./pages/main/all-services/all-services.component";
import { CreateServiceComponent } from "./pages/main/create-service/create-service.component";
import { AllSubservicesComponent } from "./pages/main/all-subservices/all-subservices.component";
import { CreateUpdateSubserviceComponent } from "./pages/main/create-subservice/create-subservice.component";
import { HomePageComponent } from "./pages/main/home-page/home-page.component";
import { HeroEditComponent } from "./pages/main/home-page/hero-edit/hero-edit.component";
import { FeaturedEditComponent } from "./pages/main/home-page/featured-edit/featured-edit.component";
import { HoverItemsEditComponent } from "./pages/main/home-page/hover-items-edit/hover-items-edit.component";
import { GridEditComponent } from "./pages/main/home-page/grid-edit/grid-edit.component";
import { PartnersEditComponent } from "./pages/main/home-page/partners-edit/partners-edit.component";
import { JobsComponent } from "./pages/jobs/jobs.component";
import { VacanciesComponent } from "./pages/jobs/vacancies/vacancies.component";
import { CreateUpdateVacanciesComponent } from "./pages/jobs/create-update-vacancies/create-update-vacancies.component";
import { AboutUsEditComponent } from "./pages/about-us/about-us-edit/about-us-edit.component";
import { OurCompanyComponent } from "./pages/about-us/about-us-edit/our-company/our-company.component";
import { OurHistoryComponent } from "./pages/about-us/about-us-edit/our-history/our-history.component";
import { AboutUsComponent } from "./pages/about-us/about-us.component";
import { LogosComponent } from "./pages/logos/logos.component";

const routes: Routes = [
  {
    path: "",
    component: TicketsSystemComponent,
    children: [
      {
        path: "sectors",
        component: MainComponent,
        children:[
        {path :"", redirectTo:"all-sectors"  , pathMatch:"full"},
        {path :"all-sectors",  component: AllSectorsComponent},
        {path :"create-sector",  component: CreateUpdateSectorComponent},
        {path :"create-sector/:id",  component: CreateUpdateSectorComponent}
        ]
      },
      {
        path: "services",
        component: SearchComponent,
        children:[
          {path :"", redirectTo:"all-services"  , pathMatch:"full"},
          {path :"all-services",  component: AllServicesComponent},
          {path :"create-service",  component: CreateServiceComponent},
          {path :"edit-service/:id",  component: CreateServiceComponent}
          ]
      },
      {
        path: "jobs",
        component: JobsComponent,
        children:[
          {path :"", redirectTo:"vacancies"  , pathMatch:"full"},
          {path :"vacancies",  component: VacanciesComponent},
          {path: "create-update-vacancies" , component : CreateUpdateVacanciesComponent},
          {path: "create-update-vacancies/:id" , component : CreateUpdateVacanciesComponent}
          ]
      },
      {
        path: "user-manage",
        component: ReplyComponent,
      },
      
      {
        path: "home-page",
        component: HomePageComponent,
      },
      {
        path: "update-hero",
        component: HeroEditComponent,
      },
      {
        path: "hover-items-edit",
        component: HoverItemsEditComponent,
      },
      {
        path: "slider-logos",
        component: LogosComponent,
      },
      {
        path: "about-us",
        component: AboutUsComponent,
        children:[
          {path :"", redirectTo:"about-us-edit"  , pathMatch:"full"},
          {  path: "about-us-edit",  component: AboutUsEditComponent},
          {path :"our-company",  component: OurCompanyComponent},
          {path :"our-history",  component: OurHistoryComponent},
          ]
      },
      {
        path: "partners-edit",
        component: PartnersEditComponent,
      },
      {
        path: "update-featured",
        component: FeaturedEditComponent,
      },
      {
        path: "update-grid",
        component: GridEditComponent,
      },
      {
        path: "emails-settings",
        component: EmailsSettingsComponent,
      },
      {
        path: "subservices",
        component: TagComponent,
        children:[
          {path :"", redirectTo:"all-subservices"  , pathMatch:"full"},
          {path :"all-subservices",  component: AllSubservicesComponent},
          {path :"create-subservices",  component: CreateUpdateSubserviceComponent},
          {path :"edit-subservices/:id",  component: CreateUpdateSubserviceComponent}
          ]
      },
      {
        path: "ask",
        component: AskComponent,
      },
      {
        path: "questions",
        component: QuestionsComponent,
      },
      { path: "", redirectTo: "sectors", pathMatch: "full" },
      { path: "**", redirectTo: "sectors", pathMatch: "full" },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TicketsSystemRoutingModule {}
