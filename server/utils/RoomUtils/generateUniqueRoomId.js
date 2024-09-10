import { rooms } from "../../handler/roomHandler.js"

export default function generateUniqueRoomId(){
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let roomId;
    do {
        roomId = '';
        for (let i = 0; i < 6; i++) {
            roomId += characters.charAt(Math.floor(Math.random() * characters.length));
        }
    } while (rooms.find(room => room.id === roomId)); // Check if ID is already in use
    return roomId;
}

