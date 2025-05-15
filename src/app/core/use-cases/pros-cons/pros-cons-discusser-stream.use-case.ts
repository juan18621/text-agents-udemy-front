import { environment } from "environments/environment.development";



export async function* prosConsStreamUseCase(prompt: string, abortSignal: AbortSignal) {
    try {

        const resp = await fetch(`${environment.backendApi}/pros-cons-discusser-stream`, {
            method: 'POST',
            body: JSON.stringify({ prompt }),
            headers: {
                'Content-Type': 'application/json'
            },
            signal: abortSignal
        })

        
        if(!resp.ok) {
            throw new Error('Error al discutir los pros y los contras')
        }

        const reader = resp.body?.getReader()
        if(!reader) {
            throw new Error('Error al discutir los pros y los contras')
        }

        const decoder = new TextDecoder()
        let text = ''

        while(true) {
            const {done, value} = await reader.read()
            if(done) {
                break
            }
            const decodedText = decoder.decode(value, {stream: true})
            text += decodedText
            console.log(text)
            yield text
        }
          
        return text
        
    } catch (error) {
        return {
            ok: false,
            role: '',
            content: 'Error al discutir los pros y los contras'
        }
    }
};
