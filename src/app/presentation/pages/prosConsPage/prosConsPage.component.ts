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
  selector: 'app-chat-template',
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
  templateUrl: './prosConsPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProsConsPageComponent { 


  public messages = signal<Message[]>([])
  public isLoading = signal(false)

  public openaiService = inject(OpenaiService)

  handleMessage(message: string) {
    this.isLoading.set(true)

    this.messages.update(prev => [
      ...prev,
      {
        isGpt: false,
        text: message
      }
    ])
    this.openaiService.prosConsDiscusser(message).subscribe((res) => {
      this.isLoading.set(false)
      this.messages.update((prev) => [
        ...prev,
        {
          isGpt: true,
          text: res.content,
        }
      ])
    })
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
