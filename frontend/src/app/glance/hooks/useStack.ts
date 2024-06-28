import { GlanceInfo } from '@/types/glance';
import { Patientlog } from '@/types/pateintinfo';
import { useState } from 'react';

function useStack() {
  const [glances, setGlances] = useState<GlanceInfo[]>([]);

    const pushMessage = (message:Patientlog) =>{
      setGlances((_glances) => {
          const index = _glances.findIndex(e => e.id == message.bedID);
          if(index == -1) return _glances;
          const arr = [..._glances];
          arr[index].latest = message;
          return arr;
        });
    }

  return { glances, pushMessage, setGlances};
}

export default useStack;
