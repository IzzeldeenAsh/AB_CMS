import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OurCompanyComponent } from './our-company.component';

describe('OurCompanyComponent', () => {
  let component: OurCompanyComponent;
  let fixture: ComponentFixture<OurCompanyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OurCompanyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OurCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
