import { createContext, useContext, useState, useEffect } from "react";
import { useSocketContext } from "./SocketContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const RoomContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useRoomContext = () => {
    return useContext(RoomContext);
}

// eslint-disable-next-line react/prop-types
export const RoomContextProvider = ({ children }) => {
    const { socket } = useSocketContext();
    const [room, setRoom] = useState(null);
    const [isAdmin, setIsAdmin] = useState(null);
    const navigate = useNavigate();
    const [members, setMembers] = useState([]);
    const [waitToComplateMatch,setWaitToComplateMatch] = useState();



    useEffect(() => {
        if (!socket) return;

        if(room == null) {
            setIsAdmin(false)
        } else {
            let users = [];
    
            room.members.forEach(user => {
              users.push(JSON.parse(user))
            });
        
            setMembers(users)
        }

        const handleRoomEvents = {

            room_created: (room) => {
                setIsAdmin(true);
                setRoom(room);
            },

            room_not_found: (roomId) => {
                toast.error(`Room '${roomId}' not found`);
            },

            room_updated: ({room}) => {
                setRoom(room);
            },
            
            room_destroyed: ({ roomId, message }) => {
                if (!room || roomId !== room.id) return;
                setRoom(null);
                navigate('/')
                toast.error(message);
            },
            room_full: (roomId) => toast.error(`The room with "${roomId}" id is full`),
            member_not_found: (memberId) => {
                toast.error(`Member '${memberId}' not found`);
            },

            permission_denied: () => {
                toast.error("You do not have permission to do this");
            },

            no_rooms_available: () => {
                toast.error("There are no public rooms available. Try creating a public room and waiting for players");
            },
            room_in_match: () => {
                setWaitToComplateMatch(true)
            },
            match_ended: () => {
                if(waitToComplateMatch) setWaitToComplateMatch(false)
            },
        };

        Object.entries(handleRoomEvents).forEach(([eventName, handler]) => {
            socket.on(eventName, handler);
        });

        return () => {
            Object.entries(handleRoomEvents).forEach(([eventName, handler]) => {
                socket.off(eventName, handler);
            });
        };
    }, [socket, room, navigate]);

    const createRoom = (data) => {
        if (!socket) return;
        socket.emit('create_room', data);
    }

    const joinRoom = (roomId) => {
        if (!socket) return;
        socket.emit('join_room', roomId);
    };

    const joinRandomRoom = () => {
        if (!socket) return;
        socket.emit('join_random_room');
    };

    const leaveRoom = () => {
        if (!socket || !room) {
            return toast.error('No user or room detected');
        }
        socket.emit('leave_room', room.id);
        setRoom(null);
        navigate('/');
    };

    const changeMemberRole = (memberId, role) => {
        if (!socket) return;
        socket.emit('edit_role', { roomId: room.id, memberId, role });
    }

    return (
        <RoomContext.Provider value={{ room, joinRoom, leaveRoom, createRoom, changeMemberRole, joinRandomRoom, isAdmin, members, waitToComplateMatch }}>
            {children}
        </RoomContext.Provider>
    );
};

