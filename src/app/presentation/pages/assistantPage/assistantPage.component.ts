import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
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
  selector: 'app-assistant-page',
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
  templateUrl: './assistantPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AssistantPageComponent implements OnInit {

  public threadId = signal<string>('')

  ngOnInit(): void {
    this.openaiService.createThread().subscribe((threadId) => {
      console.log('threadId', threadId)
      this.threadId.set(threadId)
    })
  } 


  public messages = signal<Message[]>([])
  public isLoading = signal(false)

  public openaiService = inject(OpenaiService)

  handleMessage(message: string) {
    this.isLoading.set(true)
    this.messages.update((prev) => [...prev, { text: message, isGpt: false }])
    this.openaiService.postQuestion(this.threadId(), message).subscribe((replies) => {
      this.isLoading.set(false)


      for(const reply of replies) {
        for(const message of reply.content) {
          this.messages.update((prev) => [
            ...prev,
            { text: message, isGpt: reply.role === 'assistant' }
          ])
        }
      }
    })
  }

}
