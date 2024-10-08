import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUpdateSectorComponent } from './create-update-sector.component';

describe('CreateUpdateSectorComponent', () => {
  let component: CreateUpdateSectorComponent;
  let fixture: ComponentFixture<CreateUpdateSectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateUpdateSectorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateUpdateSectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
