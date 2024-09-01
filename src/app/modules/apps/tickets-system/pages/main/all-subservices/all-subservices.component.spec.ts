import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllSubservicesComponent } from './all-subservices.component';

describe('AllSubservicesComponent', () => {
  let component: AllSubservicesComponent;
  let fixture: ComponentFixture<AllSubservicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllSubservicesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AllSubservicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
