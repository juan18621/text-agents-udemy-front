import { environment } from "environments/environment.development"
import { OrthographyResponse } from "@interfaces/orthography.response"
import { TranslateResponse } from "@interfaces/translate.response"
export const translateTextUseCase = async (prompt: string, lang: string) => {
    try {
        const resp = await fetch(`${environment.backendApi}/translate`, {
            method: 'POST',
            body: JSON.stringify({ prompt, lang }),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        if(!resp.ok) {
            throw new Error(`Error al traducir el texto: ${resp.status} ${resp.statusText}`)
        }

        const contentType = resp.headers.get('content-type')
        if (!contentType || !contentType.includes('application/json')) {
            // If the response is not JSON, read it as text
            const text = await resp.text()
            return {
                ok: true,
                message: text
            }
        }

        const data: TranslateResponse = await resp.json() as TranslateResponse
        return {
            ok: true,
            message: data.message,
        }
        
    } catch (error) {
        console.error('Translation error:', error)
        return {
            ok: false,
            message: error instanceof Error ? error.message : 'Error al traducir el texto',
        }
    }
}