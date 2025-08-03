import { Component, EventEmitter, HostListener, Input, Output, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div #modalDiv
         class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
         [class.hidden]="!open"
         (click)="onBackdropClick($event)">
      <div class="bg-white text-black rounded-lg shadow-lg p-6 relative min-w-[300px]" (click)="$event.stopPropagation()">
        <span class="absolute top-2 right-3 text-2xl cursor-pointer" (click)="close()">&times;</span>
        <ng-content></ng-content>
      </div>
    </div>
  `
})
export class ModalComponent {
  @Input() open = false;
  @Output() openChange = new EventEmitter<boolean>();
  @ViewChild('modalDiv') modalDiv!: ElementRef<HTMLDivElement>;

  close() {
    if (this.open) {
      this.open = false;
      this.openChange.emit(false);
    }
  }

  onBackdropClick(event: MouseEvent) {
    // Only close if click is on the backdrop, not the modal content
    if (event.target === this.modalDiv?.nativeElement) {
      this.close();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    this.close();
  }
}
