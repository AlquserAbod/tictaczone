import PlayerStatus from "../../Enums/PlayerStatus.js";
import RoomStatus from "../../Enums/RoomStatus.js";
import { emitToLeaveChat } from "../../handler/chatHandler.js";
import { rooms } from "../../handler/roomHandler.js"
import { io } from "../../socket/socket.js"
import destroyGame from "../GameUtils/destroyGame.js";

const messages = {
    "leave-admin": "The room was destroyed because the admin left",
    "leave-player1": "The room was destroyed because the player 1 left",
    "leave-player2": "The room was destroyed because the player 2 left",
    "default": "The room was destroyed"
};

export default async function  destroyRoom (roomId, reason)  {

    const message = messages[reason] || messages["default"]; 
    const roomIndex = rooms.findIndex(room => room.id === roomId);
    
    if (roomIndex !== -1) {
        const room = rooms[roomIndex];

        const sockets = await io.in(roomId).fetchSockets();

        sockets.forEach(socket => {
            socket.leave(roomId)

            emitToLeaveChat(socket,room);

            socket.emit('update_user_state', {status: PlayerStatus.Lobbye});
        })
        
        rooms.splice(roomIndex, 1);

        //if room in match destroy game
        if(room.status == RoomStatus.Ingame) {
            await destroyGame(room.id)
        }

        io.emit('room_destroyed', { roomId, message });
        
        console.log(`Room ${roomId} has been destroyed.`);
    }
}