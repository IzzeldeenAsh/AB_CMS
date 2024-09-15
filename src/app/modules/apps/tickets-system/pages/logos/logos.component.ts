import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, ViewChild, TemplateRef } from '@angular/core';
import { Logo, LogoCreateData, LogosService } from 'src/app/services/logo-slider/logos.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-logos',
  templateUrl: './logos.component.html',
  styleUrl: './logos.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LogosComponent implements OnInit {
  @ViewChild('addLogoModal') addLogoModal: TemplateRef<any>;
  isSubmitting: boolean = false;
  logos: Logo[] = [];
  newLogo: Partial<LogoCreateData> = {
    alt: 'uoi',
    link: 'lkinkj'
  };
  fileError: string = '';

  constructor(
    private logosService: LogosService,
    private modalService: NgbModal,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadLogos();
  }

  loadLogos(): void {
    this.logosService.getLogos().subscribe({
      next: logos => {
        this.logos = logos;
        this.cdr.markForCheck();
      },
      error: error => {
        console.error('Error fetching logos:', error);
        this.cdr.markForCheck();
      }
    });
  }

  openAddLogoModal(): void {
    this.modalService.open(this.addLogoModal, { ariaLabelledBy: 'modal-basic-title' });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (file.type === 'image/png') {
        this.newLogo.image = file;
        this.fileError = '';
      } else {
        this.fileError = 'Only PNG images are allowed.';
      }
      this.cdr.markForCheck();
    }
  }

  
  onSubmit(): void {
    if (this.newLogo.image && this.newLogo.alt && this.newLogo.link) {
      this.isSubmitting = true;
      this.cdr.markForCheck();

      this.logosService.createLogo(this.newLogo as LogoCreateData).subscribe({
        next: createdLogo => {
          console.log('Logo created:', createdLogo);
          this.logos.push(createdLogo);
          this.modalService.dismissAll();
          this.newLogo = { alt: 'uoi', link: 'lkinkj' };
          this.fileError = '';
          this.loadLogos();
          this.isSubmitting = false;
          this.cdr.markForCheck();
        },
        error: error => {
          console.error('Error creating logo:', error);
          this.isSubmitting = false;
          this.cdr.markForCheck();
        }
      });
    } else {
      console.error('Please fill all fields including image');
    }
  }
  deleteLogo(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.logosService.deleteLogo(id).subscribe({
          next: () => {
            this.logos = this.logos.filter(logo => logo.id !== id);
            this.cdr.markForCheck();
            Swal.fire(
              'Deleted!',
              'The logo has been deleted.',
              'success'
            );
          },
          error: error => {
            console.error('Error deleting logo:', error);
            Swal.fire(
              'Error!',
              'There was an error deleting the logo.',
              'error'
            );
            this.cdr.markForCheck();
          }
        });
      }
    });
  }
}