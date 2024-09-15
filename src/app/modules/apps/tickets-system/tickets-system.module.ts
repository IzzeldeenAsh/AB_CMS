import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CardsModule, DropdownMenusModule } from "src/app/_metronic/partials";
import { InlineSVGModule } from "ng-inline-svg-2";
import { TicketsSystemComponent } from "./tickets-system.component";
import { AskComponent } from "./pages/ask/ask.component";
import { MainComponent } from "./pages/main/main.component";
import { SearchComponent } from "./pages/search/search.component";
import { TagComponent } from "./pages/tag/tag.component";
import { QuestionsComponent } from "./pages/questions/questions.component";
import { TicketsSystemRoutingModule } from "./tickets-system.routing.module";
import { QuestionsListComponent } from "./components/questions-list/questions-list.component";
import { RepliesComponent } from "./components/replies/replies.component";
import { TextFormattingComponent } from "./components/text-formatting/text-formatting.component";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { ReplyComponent } from "./pages/reply/reply.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { EmailsSettingsComponent } from "./pages/email-settings/emails-settings.component";
import { SharedModule } from "src/app/_metronic/shared/shared.module";
import { AllSectorsComponent } from "./pages/main/all-sectors/all-sectors.component";
import { TrancateModule } from "src/app/pipes/trancate/trancate.module";
import { CreateUpdateSectorComponent } from "./pages/main/create-sector/create-update-sector.component";
import { EditorModule , TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { HttpClientModule } from "@angular/common/http";
import { NgSelectModule } from '@ng-select/ng-select';
import { TagInputModule } from 'ngx-chips';
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
import { VacanciesComponent } from "./pages/jobs/vacancies/vacancies.component";
import { JobsComponent } from "./pages/jobs/jobs.component";
import { CreateUpdateVacanciesComponent } from "./pages/jobs/create-update-vacancies/create-update-vacancies.component";
import { OurCompanyComponent } from "./pages/about-us/about-us-edit/our-company/our-company.component";
import { AboutUsEditComponent } from "./pages/about-us/about-us-edit/about-us-edit.component";
import { OurHistoryComponent } from "./pages/about-us/about-us-edit/our-history/our-history.component";
import { AboutUsComponent } from "./pages/about-us/about-us.component";
import { LogosComponent } from "./pages/logos/logos.component";
@NgModule({
  declarations: [
    TicketsSystemComponent,
    AskComponent,
    MainComponent,
    SearchComponent,
    TagComponent,
    QuestionsComponent,
    VacanciesComponent,
    JobsComponent,
    AllServicesComponent,
    CreateUpdateVacanciesComponent,
    CreateServiceComponent,
    QuestionsListComponent,
    RepliesComponent,
    LogosComponent,
    HoverItemsEditComponent,
    PartnersEditComponent,
    GridEditComponent,
    AboutUsComponent,
    AllSectorsComponent,
    TextFormattingComponent,
    CreateUpdateSectorComponent,
    FeaturedEditComponent,
    HeroEditComponent,
    ReplyComponent,
    AboutUsEditComponent,
    OurCompanyComponent,
    OurHistoryComponent,
    HomePageComponent,
    CreateUpdateSubserviceComponent,
    AllSubservicesComponent,
    EmailsSettingsComponent
  ],
  imports: [
    CommonModule,
    TicketsSystemRoutingModule,
    EditorModule,
    HttpClientModule,
    EditorModule,
    FormsModule,
    DropdownMenusModule,
    CardsModule,
    TagInputModule,
    NgSelectModule,
    TrancateModule,
    InlineSVGModule,
    ReactiveFormsModule,
    SharedModule,
    NgbTooltipModule,
  ],
  providers:[
    {
      provide : TINYMCE_SCRIPT_SRC , useValue :'tinymce/tinymce.min.js'
    }
  ]
})
export class TicketsSystemModule {}
