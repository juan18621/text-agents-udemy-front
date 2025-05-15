import { environment } from "environments/environment.development";
import { ProsConsResponse } from "@interfaces/pros-cons.response";
export const prosConsDiscusserUseCase = async (prompt: string) => {
    try {

        const resp = await fetch(`${environment.backendApi}/pros-cons-discusser`, {
            method: 'POST',
            body: JSON.stringify({ prompt }),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        
        if(!resp.ok) {
            throw new Error('Error al discutir los pros y los contras')
        }

        const data: ProsConsResponse = await resp.json() as ProsConsResponse

        return {
            ok: true,
            ...data
        }
        
    } catch (error) {
        return {
            ok: false,
            role: '',
            content: 'Error al discutir los pros y los contras'
        }
    }
};
