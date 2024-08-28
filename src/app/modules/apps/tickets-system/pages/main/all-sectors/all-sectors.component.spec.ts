import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllSectorsComponent } from './all-sectors.component';

describe('AllSectorsComponent', () => {
  let component: AllSectorsComponent;
  let fixture: ComponentFixture<AllSectorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllSectorsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AllSectorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
