import { environment } from "environments/environment.development"
import { OrthographyResponse } from "@interfaces/orthography.response"
export const orthographyUseCase = async (prompt: string) => {
    try {

        const resp = await fetch(`${environment.backendApi}/orthography-check`, {
            method: 'POST',
            body: JSON.stringify({ prompt }),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        
        if(!resp.ok) {
            throw new Error('Error al corregir la ortografía')
        }

        const data: OrthographyResponse = await resp.json() as OrthographyResponse

        return {
            ok: true,
            userScore: data.userScore,
            message: data.message,
            errors: data.errors
        }
        
    } catch (error) {
        return {
            ok: false,
            userScore: 0,
            message: 'Error al corregir la ortografía',
            errors: []
        }
    }
}