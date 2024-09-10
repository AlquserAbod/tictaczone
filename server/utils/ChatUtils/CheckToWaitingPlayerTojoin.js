import { emitToJoinChat } from "../../handler/chatHandler.js";
import { rooms, updateRoom } from "../../handler/roomHandler.js";
import { io } from "../../socket/socket.js";

export default function joinWaitingPlayerToChat (roomId) {
    const room = rooms.find(room => room.id == roomId);
    let anyChngeInRoom = false;

    room.members.forEach(m => {
        const member = JSON.parse(m);
        
       if(!member.waitingMatchToComplate) return;
       anyChngeInRoom = true

       const socket = io.sockets.sockets.get(member.id);

       emitToJoinChat(socket,room);

       room.member == (member.waitingMatchToComplate = false);
    });

    if(anyChngeInRoom) updateRoom(room)


}