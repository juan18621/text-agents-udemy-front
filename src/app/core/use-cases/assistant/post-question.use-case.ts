import { environment } from "environments/environment.development";
import { QuestionResponse } from "@interfaces/question.response";
export const postQuestionUseCase = async  (threadId: string, question: string) => {
    const response = await fetch(`${environment.assistantApi}/post-question`, {
        method: 'POST',
        body: JSON.stringify({ threadId, question }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    
   const  replies: QuestionResponse[] = await response.json()
   return replies
}
