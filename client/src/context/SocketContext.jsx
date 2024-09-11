import { createContext, useContext, useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import io from 'socket.io-client';

const SocketContext = createContext();

export const useSocketContext = () => {
    return useContext(SocketContext);
}

// eslint-disable-next-line react/prop-types
export const SocketContextProvider = ({ children }) => {
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [username, setUsername] = useState([]);
    const socketRef = useRef(null); // Using ref to store socket instance

    useEffect(() => {
        if (socketRef.current) {
            // Emit username when it's updated
            socketRef.current.emit('set_username', username);
        }
    }, [username]);

    useEffect(() => {
        const connectSocket = () => {
            try {
                const socket = io(import.meta.env.VITE_SERVER_URL, {
                    transports: ['websocket'],  // Use WebSocket only
                    withCredentials: true,
                    query: {
                        username: localStorage.getItem('gamesquare_nickname') || null
                    }
                });

                // Save the socket instance in the ref
                socketRef.current = socket;

                // Listen for online users
                socket.on('get_online_users', (users) => {
                    setOnlineUsers(users);
                });

                // Handle connection errors
                socket.on('connect_error', (error) => {
                    toast.error("Connection Error: " + error.message);
                    console.log("Connection error:", error);
                });

                socket.on('disconnect', () => {
                    toast.error("Disconnected from server");
                });

                return () => {
                    // Clean up the socket connection and listeners
                    socket.off('get_online_users');
                    socket.close();
                };

            } catch (error) {
                toast.error("Socket initialization failed: " + error.message);
                console.error("Socket error:", error.message);
            }
        };

        connectSocket();

    }, []);

    return (
        <SocketContext.Provider value={{ socket: socketRef.current, onlineUsers, setUsername }}>
            {children}
        </SocketContext.Provider>
    );
};
