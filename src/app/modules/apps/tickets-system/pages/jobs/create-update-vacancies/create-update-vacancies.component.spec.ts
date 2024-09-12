import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUpdateVacanciesComponent } from './create-update-vacancies.component';

describe('CreateUpdateVacanciesComponent', () => {
  let component: CreateUpdateVacanciesComponent;
  let fixture: ComponentFixture<CreateUpdateVacanciesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateUpdateVacanciesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateUpdateVacanciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
