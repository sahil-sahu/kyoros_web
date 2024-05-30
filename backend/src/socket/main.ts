import { Socket } from "socket.io";
import { Patientlog } from "../types";
// import { handlePatientEvent } from "./handlePatientInfo";


  export function mainSocket(socket:Socket){
        console.log('A user connected');

        socket.on('message', (data) => {
            console.log(`Received message: ${data}`);
        });

        socket.on('disconnect', () => {
            console.log('A user disconnected');
        });

        socket.on('join-room', (roomName) => {
            socket.join(roomName);
            console.log(`User ${socket.id} joined room ${roomName}`);
        });

        socket.on('leave-room', (roomName) => {
            socket.leave(roomName);
            console.log(`User ${socket.id} left room ${roomName}`);
        });

        socket.on('get-rooms', () => {
            const rooms = Array.from(socket.rooms);
            console.log(`User ${socket.id} is part of rooms: ${rooms.join(', ')}`);
        });

        socket.on('patient', ({patientId, log}:{patientId:string, log:Patientlog}) => {
            console.log(`Received event from patient ${patientId}: ${log.timeStamp}`);
            socket.to(`patient/${patientId}`).emit('patient-event', log);
            // handlePatientEvent(patientId, socket, log);
        });

  }