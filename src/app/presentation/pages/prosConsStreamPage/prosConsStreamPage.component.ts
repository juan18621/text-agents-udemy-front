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
  selector: 'app-pros-cons-stream-page',
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
  templateUrl: './prosConsStreamPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProsConsStreamPageComponent { 


  public messages = signal<Message[]>([])
  public isLoading = signal(false)

  public openaiService = inject(OpenaiService)

  public abortController = new AbortController()

  async handleMessage(message: string) {

    this.abortController.abort()
    this.abortController = new AbortController()

    this.messages.update(prev => {
      return [
        ...prev,
        {
          isGpt: false,
          text: message
        },
        {
          isGpt: true,
          text: '...' ,
          
        }
      ]
    })

    this.isLoading.set(true)

    const stream = this.openaiService.prosConsStream(message, this.abortController.signal)

    this.isLoading.set(false)

    
    for await (const text of stream) {
      this.handleStreamResponse(text)
    }

    this.isLoading.set(false)
  }

  handleStreamResponse(text: string) {
    this.messages().pop()
    const messages = this.messages()
    
    this.messages.set([...messages, {
      isGpt: true,
      text
    }])
  }

  handleMessageWithFile({prompt, file}: TextMessageEvent) {
    console.log('Message from child:', prompt);
    console.log('Message from child: file', file);
  }

  handleMessageWithSelect({prompt, selectedOption}: TextMessageBoxEvent) {
    console.log('Message from child:', prompt);
    console.log('Message from child: select', selectedOption);
  }

}
