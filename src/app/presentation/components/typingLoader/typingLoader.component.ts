import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-typing-loader',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './typingLoader.component.html',
  styleUrls: ['./typingLoader.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TypingLoaderComponent { }
