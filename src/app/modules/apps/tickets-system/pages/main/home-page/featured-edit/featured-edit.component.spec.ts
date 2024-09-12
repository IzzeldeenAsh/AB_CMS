import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeaturedEditComponent } from './featured-edit.component';

describe('FeaturedEditComponent', () => {
  let component: FeaturedEditComponent;
  let fixture: ComponentFixture<FeaturedEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeaturedEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FeaturedEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
