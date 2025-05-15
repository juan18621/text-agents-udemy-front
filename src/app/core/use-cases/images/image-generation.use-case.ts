import { environment } from "environments/environment.development"

type GeneratedImage = ImageResponse | null

interface ImageResponse {
    url: string
    alt: string
}

export const imageGenerationUseCase = async (prompt: string, originalImage: string, maskImage: string): Promise<GeneratedImage> => {


    try {
        const response = await fetch(`${environment.backendApi}/image-generation`, {
            method: 'POST',
            body: JSON.stringify({ prompt, originalImage, maskImage }),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const {url, revised_prompt:alt} = await response.json()

        return {url, alt}

    } catch (error) {
        console.log('Error in image generation use case:', error)
        return null
    }
}
