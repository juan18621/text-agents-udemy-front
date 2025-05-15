import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Message } from '@interfaces/message.interface';

@Component({
  selector: 'app-gpt-message-orthography',
  standalone: true,
  imports: [],
  templateUrl: './gptMessageOrthography.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GptMessageOrthographyComponent { 

  @Input() userScore!: number
  @Input() text!: string
  @Input() errors: string[] = []
}
