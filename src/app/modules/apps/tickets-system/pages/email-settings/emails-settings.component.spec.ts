import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailsSettingsComponent } from './emails-settings.component';

describe('EmailsSettingsComponent', () => {
  let component: EmailsSettingsComponent;
  let fixture: ComponentFixture<EmailsSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailsSettingsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmailsSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
