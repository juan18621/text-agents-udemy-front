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
import { GptMessageEditableImageComponent } from '@components/GptMessageEditableImage/GptMessageEditableImage.component';

@Component({
  selector: 'app-image-tunnig-page',
  standalone: true,
  imports: [
    CommonModule,
    ChatMessageComponent,
    MyMessageComponent,
    TypingLoaderComponent,
    TextMessageBoxComponent,
    GptMessageEditableImageComponent
  ],
  templateUrl: './imageTunnigPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ImageTunnigPageComponent { 


  public messages = signal<Message[]>([
     {
       isGpt: true,
       text: 'Dummy image',
       imageInfo: {
         alt: 'Dummy image',
         url: 'http://localhost:3000/gpt/image-generation/1747325235428.png'
       }
     }
  ]);

  public isLoading = signal(false)

  public originalImage = signal<string>('')

  public openaiService = inject(OpenaiService)

  public maskImage = signal<string|undefined>(undefined);

  handleMessage(message: string) {
    console.log('Message from child:', message);
    this.isLoading.set(true)
    this.messages.update(prev => 
      [
        ...prev,
        {
          text: message,
          isGpt: false
        }
      ]
    )

    this.openaiService.imageGeneration(message, this.originalImage(), this.maskImage() || '').subscribe(response => {
      console.log('Response from child:', response);
      if(!response) return
      this.messages.update(prev => 
        [
          ...prev,
          {
            text: response.alt,
            isGpt: true,
            imageInfo: response
          }
        ]
      )

      this.isLoading.set(false)
    })
  }

  handleImageChange(newImage: string, originalImage: string ) {
    this.originalImage.set( originalImage );
    this.maskImage.set(newImage);
  }


  generateVariation() {
    if ( !this.originalImage() )return;

    this.isLoading.set(true);

    this.openaiService.imageVariation( this.originalImage()! )
      .subscribe( resp => {
        this.isLoading.set(false);
        if ( !resp ) return;

        this.messages.update( prev => [
          ...prev,
          {
            isGpt: true,
            text: resp.alt,
            imageInfo: resp
          }
        ]);


      })


  }

}
