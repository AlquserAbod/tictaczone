import  generateUniqueRoomId  from '../utils/RoomUtils/generateUniqueRoomId.js';
import  destroyRoom  from '../utils/RoomUtils/destroyRoom.js';
import  deleteRoomMemberById  from '../utils/RoomUtils/deleteRoomMemberById.js';

import RoomStatus from "../Enums/RoomStatus.js"
import PlayerStatus from "../Enums/PlayerStatus.js"
import { io } from "../socket/socket.js"

import { OnlineUsers  } from './userHandler.js';
import { createChat, emitToJoinChat, emitToLeaveChat } from './chatHandler.js';
import { games } from './gameHandler.js';

export const rooms = [];

export const updateRoom = (updatedRoomData) => {
    
    const index = rooms.findIndex(room => room.id === updatedRoomData.id);

    
    if (index !== -1) {
        rooms[index] = updatedRoomData;
        
        io.in(updatedRoomData.id).emit('room_updated', { room: updatedRoomData });
    }

}

export default function handleRoomEvents(io, socket) {

    socket.on('create_room', (data) => {
        const creator = {
            id: socket.id ,
            username: OnlineUsers[socket.id].username,
            role: 'player1',
            isAdmin: true,
            waitingMatchToComplate: false,
        };

        const roomData = {
            id: generateUniqueRoomId(),
            private: data.private,
            allowSpectators: data.allowSpectators,
            allowChat: data.allowChat,
            status: RoomStatus.Waiting,
            creator: JSON.stringify(creator),
            members: [ JSON.stringify(creator),],
            matchHistory: [],
        };
        
        rooms.push(roomData);

        socket.emit('room_created', roomData);

        if(data.allowChat) createChat(socket,roomData);

        socket.join(roomData.id)

        socket.emit('update_user_state', {status: PlayerStatus.InRoom});
    });

    socket.on('join_room', (roomId) => {
        const room = rooms.find(room => room.id === roomId);

        
        if (room) {
            
            if(!room.allowSpectators && room.members.length >= 2)  return socket.emit('room_full', roomId);
            
            socket.join(roomId);
            
            room.members.push(JSON.stringify({
                id: socket.id ,
                username: OnlineUsers[socket.id].username,
                role: room.members.length == 1 ? "player2" : "spectator",
                isAdmin: false,
                waitingMatchToComplate: room.status == RoomStatus.Ingame
            }));
            
            
            socket.emit('update_user_state', {status: PlayerStatus.InRoom});
            
            if(room.status == RoomStatus.Ingame) socket.emit('room_in_match', roomId);
            else emitToJoinChat(socket,room);
            
            updateRoom(room);
        }else {
            socket.emit('room_not_found', roomId);
        }
    });

    socket.on('join_random_room', () => {
        const publicRooms = rooms.filter(room => !room.private && !(!room.allowSpectators && room.members.length >= 2));
    
        if (publicRooms.length > 0) {
            const randomRoom = publicRooms[Math.floor(Math.random() * publicRooms.length)];
    
            socket.join(randomRoom.id);
    
            randomRoom.members.push(JSON.stringify({
                id: socket.id ,
                username: OnlineUsers[socket.id].username,
                role: randomRoom.members.length == 1 ? "player2" : "spectator",
                isAdmin: false,
                waitingMatchToComplate: randomRoom.status == RoomStatus.Ingame
            }));
    
            socket.emit('update_user_state', {status: PlayerStatus.InRoom});

            if(randomRoom.status == RoomStatus.Ingame) socket.emit('room_in_match', randomRoom.id);
            else emitToJoinChat(socket,randomRoom);
            updateRoom(randomRoom);
        } else {
            socket.emit('no_rooms_available');
        }
    });

    socket.on('leave_room', async (roomId) => {
        const room = rooms.find(room => room.id === roomId);
    
        if (room) {
            const player = room.members.find(member => JSON.parse(member).id == socket.id);
            const parsedPlayer = player ? JSON.parse(player) : null;
            
            if(room.status == RoomStatus.Ingame && player != null && parsedPlayer.role != "spectator") {
                await destroyRoom(room.id,`leave-${parsedPlayer.role}`)
            }
            else if(socket.id == JSON.parse(room.creator).id) {
                await destroyRoom(room.id,"leave-admin")
            }else {
                socket.leave(roomId);
        
                deleteRoomMemberById(room,socket.id)
        
                socket.emit('update_user_state', {status: PlayerStatus.InRoom});

                emitToLeaveChat(socket,room);
            }


        } else {
            socket.emit('room_not_found', { roomId });
        }
    });

    socket.on("edit_role", ({roomId ,memberId, role}) => {
        const room = rooms.find(room => room.id === roomId);

        if (!room) {
            socket.emit('room_not_found', { roomId });
            return;
        }
    
        const creatorId = JSON.parse(room.creator).id;
    
        if (socket.id !== creatorId) {
            socket.emit('permission_denied', { memberId });
            return;
        }
    
        const memberIndex = room.members.findIndex(member => JSON.parse(member).id === memberId);
    
        if (memberIndex === -1) {
            socket.emit('member_not_found', { memberId });
            return;
        }
    
        const member = JSON.parse(room.members[memberIndex]);
        member.role = role;
    
        room.members[memberIndex] = JSON.stringify(member);
    
        updateRoom(room)
    });



    socket.on('disconnect', async () => {
        const room = rooms.find(room => room.members.filter((user) => JSON.parse(user).id == socket.id));
        
        if(room != null) {
            const player = room.members.find(member => JSON.parse(member).id == socket.id);
            const parsedPlayer = player ? JSON.parse(player) : null;

            if(room.status == RoomStatus.Ingame && player != null && parsedPlayer.role != "spectator") {
                await destroyRoom(room.id,`leave-${parsedPlayer.role}`)
            }
            else if(socket.id == JSON.parse(room.creator).id) {
                await destroyRoom(room.id,"leave-admin")
            }else {
                deleteRoomMemberById(room,socket.id)
            }
        }
    })

}

