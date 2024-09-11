import { createContext, useContext, useState, useEffect } from "react";
import { useSocketContext } from "./SocketContext";
import { useRoomContext } from "./RoomContext";
import { useSoundContext } from "./SoundContext";
import { toast } from "react-hot-toast"
const ChatContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useChatContext = () => {
    return useContext(ChatContext);
}

// eslint-disable-next-line react/prop-types
export const ChatContextProvider = ({ children }) => {
    const { socket } = useSocketContext();
    const { room,waitToComplateMatch } = useRoomContext();
    const [chat, setChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const { playReceiveMessageSound, playSendMessageSound } = useSoundContext();

    useEffect(() => { if(room == null) setChat(null) },[room])

    useEffect(() => {
        if (!socket) return

        const handleChatEvents = {
            new_message : ({chat, message}) =>{
                if(waitToComplateMatch) return 
                setChat(chat);

                setMessages(prevMessages => {
                    const messagesArray = Array.isArray(prevMessages) ? prevMessages : [];
                    message.read = message.senderId == socket.id
                    return [...messagesArray, message];
                });

                if(message.senderId != socket.id) {
                    playReceiveMessageSound()
                }
            },
            join_chat: (chat) => {
                if(chat == null) toast.error('no chat founded')
                
                setChat(chat)
            },
            leave_chat: (chat) => {
                if(chat == null) toast.error('no chat founded')
                
                setChat(null)
                setMessages([])
            },
        };

        Object.entries(handleChatEvents).forEach(([eventName, handler]) => {
            socket.on(eventName, handler);
        });

        return () => {
            Object.entries(handleChatEvents).forEach(([eventName, handler]) => {
                socket.off(eventName, handler);
            });
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket, chat]);

    const sendMessage = (message) => {
        if(!message) return

        socket.emit('send_message',{ room, message});

        playSendMessageSound();
    }
    
    const markMessagesAsReaded = () => {
        const ReadedMessages = messages.map((m) => {
            m.read = true
            return m;
        })
        setMessages(ReadedMessages);
    };

    const unReadedMessageCount = () => messages.filter((message) => !message.read).length;
    
    const unReadedMessageStartIndex = () => messages.findIndex((m) => !m.read);


    return (
        <ChatContext.Provider value={{ sendMessage, chat , messages, unReadedMessageCount, markMessagesAsReaded,unReadedMessageStartIndex }}>
            {children}
        </ChatContext.Provider>
    );
};

