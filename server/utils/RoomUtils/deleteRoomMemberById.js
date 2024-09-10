import { rooms, updateRoom } from "../../handler/roomHandler.js"

export default function deleteRoomMemberById(room, memberId) {
    if (room != null) {
        room.members = room.members.filter(member => JSON.parse(member).id !== memberId);
        
        updateRoom(room)
    }

}