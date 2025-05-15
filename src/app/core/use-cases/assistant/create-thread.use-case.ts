import { environment } from "environments/environment.development";

 


 export const createThreadUseCase = async  () => {
     const response = await fetch(`${environment.assistantApi}/create-thread`, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json'
        }
     });
     
    const {id} = await response.json()
    return id
 }
 