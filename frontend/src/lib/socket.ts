'use client'
import { PatientFormData, PatientRealtimeObj, Patientlog } from '@/types/pateintinfo';
import io, { Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const connectToSocket = (room:string, setMessages:((message:Patientlog) => void) | null) => {
  
  socket = socket?socket:io('http://localhost:8000');
  socket.on('connect', () => {
    console.log('Connected to Socket.IO server');
  });

  subscribeToRoom(room);

  socket.on('disconnect', () => {
    console.log('Disconnected from Socket.IO server');
    socket = null;
  });
  socket.on('patient-event', ({data, room:curr}:{data: Patientlog, room:string}) => {
      if (room===curr && setMessages) {
        setMessages(data);
      }
    });

  return socket;
};

// export const connectToGlance = (room:string, setMessages:((message:Patientlog) => void) | null) => {
//   socket = socket?socket:io('http://localhost:8000');


//   socket.on('connect', () => {
//     console.log('Connected to Socket.IO server');
//   });
//   subscribeToRoom(room);

//   socket.on('disconnect', () => {
//     console.log('Disconnected from Socket.IO server');
//     socket = null;
//   });

//   socket.on('patient-event', (data: Patientlog) => {
//       if (setMessages) {
//         setMessages(data);
//       }
//     });

//   return socket;
// };

export const subscribeToRoom = (room: string) => {
  if (!socket) {
    throw new Error('Socket.IO connection not established');
  }

  socket.emit('join-room', room);
  console.log(`Subscribed to room ${room}`);
};

export const unsubscribeFromRoom = (room: string) => {
  if (!socket) {
    throw new Error('Socket.IO connection not established');
  }
  console.log("unsubscribed" + room)
  socket.emit('leave-room', room);
};

export const sendMessage = (room: string, message: string) => {
  if (!socket) {
    throw new Error('Socket.IO connection not established');
  }

  socket.emit('message', { room, message });
};
