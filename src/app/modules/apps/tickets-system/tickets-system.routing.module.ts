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
        path: "user-manage",
        component: ReplyComponent,
      },
      
      {
        path: "home-page",
        component: HomePageComponent,
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
