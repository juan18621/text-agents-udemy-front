import { environment } from "environments/environment.development";


export const audioToTextUseCase = async (audioFile: File, prompt?: string) => {
    try {
        const formData = new FormData();
        formData.append('file', audioFile);
        if (prompt) {
            formData.append('prompt', prompt);
        }

        const response = await fetch(`${environment.backendApi}/audio-to-text`, {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        return data;  
    } catch (error) {
        console.error(error);
        return null;
    }
}