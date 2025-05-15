import { Injectable } from '@angular/core';
import { postQuestionUseCase } from '@use-cases/assistant/post-question.use-case';
import { createThreadUseCase } from '@use-cases/assistant/create-thread.use-case';
import { imageVariationUseCase } from '@use-cases/images/image-variation.use-case';
import { orthographyUseCase, textToAudioUseCase, audioToTextUseCase, imageGenerationUseCase  } from '@use-cases/index';
import { prosConsStreamUseCase } from '@use-cases/pros-cons/pros-cons-discusser-stream.use-case';
import { prosConsDiscusserUseCase } from '@use-cases/pros-cons/pros-cons-discusser.use-case';
import { translateTextUseCase } from '@use-cases/translate/translate-text.use-case';
import { from, Observable, of, tap } from 'rxjs';
import { QuestionResponse } from '@interfaces/question.response';
@Injectable({
  providedIn: 'root'
})
export class OpenaiService {

    checkOrthography(prompt: string) {
        return from(orthographyUseCase(prompt))
    }

    prosConsDiscusser(prompt: string) {
        return from(prosConsDiscusserUseCase(prompt))
    }

    prosConsStream(prompt: string, abortSignal: AbortSignal) {
        return prosConsStreamUseCase(prompt, abortSignal)
    }

    translateText(prompt: string, lang: string) {
        return from(translateTextUseCase(prompt, lang))
    }

    textToAudio(prompt: string) {
        return from(textToAudioUseCase(prompt))
    }

    audioToText(audioFile: File, prompt?: string) {
        return from(audioToTextUseCase(audioFile, prompt))
    }

    imageGeneration(prompt: string, originalImage: string, maskImage: string) {
        return from(imageGenerationUseCase(prompt, originalImage, maskImage))
    }

    imageVariation(originalImage: string) {
        return from(imageVariationUseCase(originalImage))
    }

    createThread(): Observable<string> {
        if(localStorage.getItem('thread')) {
            return of(localStorage.getItem('thread') as string)
        }

        return from(createThreadUseCase()).pipe(tap((threadId) => {
          console.log('threadId', threadId)
            localStorage.setItem('thread', threadId)
        }))
    }

    postQuestion(threadId: string, question: string): Observable<QuestionResponse[]> {
        return from(postQuestionUseCase(threadId, question))
    }

   
}