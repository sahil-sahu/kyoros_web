import { PatientRealtimeObj } from '@/types/pateintinfo';
import { MessageSquareShare } from 'lucide-react';
import { useState } from 'react';
import { measureMemory } from 'vm';

function useStack() {
    const [messages, setMessages] = useState<PatientRealtimeObj[]>([]);

    const pushMessage = (message:PatientRealtimeObj) =>{
        // console.log(message);
        setMessages((prevMessages) => {
          const messages = [...prevMessages, message];
          if(messages.length > 50){
            messages.shift();
          }
          return messages;
        });
    }

  return { messages, pushMessage, setMessages};
}

export default useStack;
