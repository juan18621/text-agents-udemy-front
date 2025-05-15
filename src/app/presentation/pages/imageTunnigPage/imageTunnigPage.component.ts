import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-image-tunnig-page',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './imageTunnigPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ImageTunnigPageComponent { }
