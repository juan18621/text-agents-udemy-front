import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

interface Option {
  id: string;
  text: string;
}

export interface TextMessageBoxEvent {
  prompt: string;
  selectedOption: string;
}

@Component({
    selector: 'app-text-message-box-select',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule
    ],
    templateUrl: './textMessageBoxSelect.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextMessageBoxSelectComponent { 

    @Input() placeholder: string = 'Type a message...';
    @Input() disableCorrections = false;
    @Output() onMessage = new EventEmitter<TextMessageBoxEvent>();

    @Input({required: true}) options: Option[] = [];
  
    public fb = inject(FormBuilder);
  
    public form = this.fb.group({
      prompt: ['', Validators.required],
      selectedOption: ['', Validators.required]
    })
  
    public file : File | null = null;
  
    handleSubmit() {
      if (this.form.invalid) {
        return
      }
  
      const { prompt, selectedOption } = this.form.value as TextMessageBoxEvent;
  
      this.onMessage.emit({prompt, selectedOption});
  
      this.form.reset();
    }

}
