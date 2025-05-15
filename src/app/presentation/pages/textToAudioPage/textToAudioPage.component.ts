import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ChatMessageComponent } from '@components/chat-bubbles/chatMessage/chatMessage.component';
import { MyMessageComponent } from '@components/chat-bubbles/myMessage/myMessage.component';
import { TextMessageBoxSelectComponent } from '@components/text-boxes/TextMessageBoxSelect/TextMessageBoxSelect.component';
import { TextMessageBoxComponent } from '@components/text-boxes/textMessageBox/textMessageBox.component';
import { TextMessageBoxFileComponent, TextMessageEvent } from '@components/text-boxes/textMessageBoxFile/textMessageBoxFile.component';
import { TextMessageBoxEvent } from '@components/text-boxes/TextMessageBoxSelect/TextMessageBoxSelect.component';
import { TypingLoaderComponent } from '@components/typingLoader/typingLoader.component';
import { Message } from '@interfaces/message.interface';
import { OpenaiService } from 'app/presentation/services/openai.service';

@Component({
  selector: 'app-text-to-audio-page',
  standalone: true,
  imports: [
    CommonModule,
    ChatMessageComponent,
    MyMessageComponent,
    TypingLoaderComponent,
    TextMessageBoxComponent,
    TextMessageBoxFileComponent,
    TextMessageBoxSelectComponent
  ],
  templateUrl: './textToAudioPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class TextToAudioPageComponent { 


  public messages = signal<Message[]>([])
  public isLoading = signal(false)

  public openaiService = inject(OpenaiService)

  public voices = signal<{ id: string, text: string }[]>([
    { id: "nova", text: "Nova" },
    { id: "alloy", text: "Alloy" },
    { id: "echo", text: "Echo" },
    { id: "fable", text: "Fable" },
    { id: "onyx", text: "Onyx" },
    { id: "shimmer", text: "Shimmer" },
  ]);

  handleMessage(message: string) {
    console.log('Message from child:', message);
  }

  handleMessageWithFile({prompt, file}: TextMessageEvent) {
    console.log('Message from child:', prompt);
    console.log('Message from child: file', file);
  }

  handleMessageWithSelect({prompt, selectedOption}: TextMessageBoxEvent) {
    console.log('Message from child:', prompt);
    console.log('Message from child: select', selectedOption);

    const message = `${selectedOption} - ${prompt}`

    this.messages.update(prev => {
      return [
        ...prev,
        {
          text: message,
          isGpt: false
        }
      ]
    })

    this.isLoading.set(true) 

    this.openaiService.textToAudio(message).subscribe({
      next: (resp) => {
        this.isLoading.set(false)
         

        this.messages.update(prev => {
          return [
            ...prev,
            { text: resp.message, isGpt: true, audioUrl: resp.audioUrl || undefined }
          ]
        }) 
      },
      error: (err) => {
        console.log('Message from child: error', err);
      }
    })
  }

}