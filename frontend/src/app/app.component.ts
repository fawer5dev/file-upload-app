import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { FileViewComponent } from './components/file-view/file-view.component';

/**
 * App Component
 * Main application component
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FileUploadComponent, FileViewComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'File Upload Application';
}
