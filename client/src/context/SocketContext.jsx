import { createContext, useContext, useEffect, useState } from "react"
import toast from "react-hot-toast";
import io from 'socket.io-client';

const SocketContext = createContext();

export const useSocketContext = () => {
    return useContext(SocketContext);
}

// eslint-disable-next-line react/prop-types
export const SocketContextProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [username, setUsername] = useState([]);

    useEffect(() => {
        socket?.emit('set_username',username);
    },[username]);

    useEffect(() => {
        try {        
            const socket = io(import.meta.env.VITE_SERVER_URL, {
                query: {
                    username: (localStorage.getItem('gamesquare_nickname') || null)
                }
            });
    
            setSocket(socket);
    
            socket.on('get_online_users', (users) => {
                setOnlineUsers(users);
            })

            return () => socket.close();
            
        } catch (error) {
            toast.error(error.message)
            console.log("error in socket context", error.message);
        }
    },[])

    return(
        <SocketContext.Provider value={{ socket, onlineUsers, setUsername }}>
            {children}
        </SocketContext.Provider>
    )
}



