import { Injectable } from '@angular/core';
import { orthographyUseCase, textToAudioUseCase, audioToTextUseCase  } from '@use-cases/index';
import { prosConsStreamUseCase } from '@use-cases/pros-cons/pros-cons-discusser-stream.use-case';
import { prosConsDiscusserUseCase } from '@use-cases/pros-cons/pros-cons-discusser.use-case';
import { translateTextUseCase } from '@use-cases/translate/translate-text.use-case';
import { from } from 'rxjs';
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
}