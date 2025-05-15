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
  selector: 'app-audio-to-text-page',
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
  templateUrl: './audioToTextPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AudioToTextPageComponent { 


  public messages = signal<Message[]>([])
  public isLoading = signal(false)

  public openaiService = inject(OpenaiService)

  handleMessage(message: string) {
    console.log('Message from child:', message);
  }

  handleMessageWithFile({prompt, file}: TextMessageEvent) {
    console.log('Message from child:', prompt);
    console.log('Message from child: file', file);

    const text = prompt ?? file?.name ?? 'Traducción de audio'

    this.isLoading.set(true)

    this.messages.update(prev => {
      return [
        ...prev,
        {
          text,
          isGpt: false
        }
      ]
    })

      this.openaiService.audioToText(file as any, text).subscribe((response) => this.handleResponse(response))
  }

  handleResponse(response: any) {

    console.log('Response from child:', response);
    this.isLoading.set(false)

    if(!response) return 

    const text = `
## Traducción de audio

    duración: ${Math.round(response.duration )} segundos
    texto: ${response.text} 
    `

    this.messages.update(prev => {
      return [...prev, { text, isGpt: true }]
    })

    for (const segment  of response.segments) {
      const segmentMessage = `
      ## Segmento
      duración: ${Math.round(segment.start)} a ${Math.round(segment.end)}
      texto: ${segment.text}
      `

      this.messages.update(prev => {
        return [...prev, { text: segmentMessage, isGpt: true }]
      })
      
    }
  }

  handleMessageWithSelect({prompt, selectedOption}: TextMessageBoxEvent) {
    console.log('Message from child:', prompt);
    console.log('Message from child: select', selectedOption);
  }

}
