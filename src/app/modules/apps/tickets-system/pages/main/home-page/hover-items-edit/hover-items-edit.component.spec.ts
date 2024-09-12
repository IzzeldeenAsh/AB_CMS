import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HoverItemsEditComponent } from './hover-items-edit.component';

describe('HoverItemsEditComponent', () => {
  let component: HoverItemsEditComponent;
  let fixture: ComponentFixture<HoverItemsEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HoverItemsEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HoverItemsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
