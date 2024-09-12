import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutUsEditComponent } from './about-us-edit.component';

describe('AboutUsEditComponent', () => {
  let component: AboutUsEditComponent;
  let fixture: ComponentFixture<AboutUsEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutUsEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AboutUsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
