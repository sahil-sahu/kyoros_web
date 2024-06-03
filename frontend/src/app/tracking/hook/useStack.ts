import { Patientlog } from '@/types/pateintinfo';
import { useState } from 'react';

function useStack() {
    const [messages, setMessages] = useState<Patientlog[]>([]);

    const pushMessage = (message:Patientlog) =>{
      setMessages((prevMessages) => {
          if(prevMessages[prevMessages.length -1].id == message.id) return prevMessages;
          const messages = [...prevMessages, message];
          return messages;
        });
    }

  return { messages, pushMessage, setMessages};
}

export default useStack;
