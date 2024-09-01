import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSubserviceComponent } from './create-subservice.component';

describe('CreateSubserviceComponent', () => {
  let component: CreateSubserviceComponent;
  let fixture: ComponentFixture<CreateSubserviceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateSubserviceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateSubserviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
