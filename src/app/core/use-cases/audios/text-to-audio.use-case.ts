import { environment } from "environments/environment.development"
import { OrthographyResponse } from "@interfaces/orthography.response"
export const textToAudioUseCase = async (prompt: string) => {
    try {

        const resp = await fetch(`${environment.backendApi}/text-to-audio`, {
            method: 'POST',
            body: JSON.stringify({ prompt }),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        
        if(!resp.ok) {
            throw new Error('Error al convertir el texto a audio')
        }

        const audioFile = await resp.blob()

        const audioUrl = URL.createObjectURL(audioFile)

        return {
            ok: true,
            message: prompt,
            audioUrl
        }
        
    } catch (error) {
        return {
            ok: false,
            message: 'Error al convertir el texto a audio',
            audioUrl: null
        }
    }
}