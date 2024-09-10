import  handleRoomEvents  from './roomHandler.js';
import  handleGameEvents  from './gameHandler.js';
import  handleUserEvents  from './userHandler.js';
import handleChatEvents from './chatHandler.js';


export default function handleSocketEvents(io) {

    io.on('connection', (socket) => {
        handleChatEvents(io, socket)
        handleUserEvents(io, socket)
        handleRoomEvents(io, socket);
        handleGameEvents(io, socket);
        
    });
}