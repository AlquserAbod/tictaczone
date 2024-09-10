import { io } from "../socket/socket.js";
import { rooms } from "./roomHandler.js";


const chats = [

];

export const createChat = (socket,room) => {
    let chat = chats.find((chat) => chat.roomId == room.id);

    if(chat == null) {
        chat = {
            roomId: room.id,
            messages: []
        }

        chats.push(chat);
    }

    emitToJoinChat(socket,room)
}

export const emitToJoinChat = (socket,room) => {
    if(!room.allowChat) return;

    const chat = chats.find(chat => chat.roomId == room.id);

    if(chat == null) return;

    socket.emit('join_chat', chat);
}

export const emitToLeaveChat = (socket,room) => {
    const chat = chats.find(chat => chat.roomId == room.id);

    console.log("emit to leave chat", room.id);

    if(chat == null) return;

    socket.emit('leave_chat', chat);
}

export default function handleChatEvents(io,socket) {
    
    socket.on("send_message",({room, message}) =>{
        if(room.allowChat == false) return

        let chat = chats.find((chat) => chat.roomId == room.id);

        if(chat == null) return;
        
        const roomMembers = room.members;
        const memeber = JSON.parse(roomMembers.find(member => JSON.parse(member).id === socket.id));

        const newMessage = {
            senderId: socket.id,
            senderUsername: memeber.username,
            message: message,
            role: memeber.role == "player1" ? "P1" : memeber.role == "player2" ? "P2" : 'SP' 
        }

        chat.messages.push(newMessage);
        
        io.in(room.id).emit('new_message',  {chat, message: newMessage});
    })
}