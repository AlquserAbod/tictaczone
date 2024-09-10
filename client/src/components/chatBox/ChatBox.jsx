/* eslint-disable react-hooks/exhaustive-deps */
import MenuButton from "./MenuButton";
import ChatMenu from "./ChatMenu";
import { useEffect, useRef, useState } from "react";
import { useChatContext } from "../../context/ChatContext";
import useClickOutside from "../../hooks/useClickOutside";

const ChatBox = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [unreadedMessageDividerCount, setUnreadedMessageDividerCount] = useState(0);
    const { markMessagesAsReaded, unReadedMessageCount, messages } = useChatContext();
    const buttonRef = useRef(null);
    const menuRef = useRef(null);
    const chatbox = useRef(null);

    
    useClickOutside(chatbox,() => handleCloseModal())

    useEffect(() => {
        if(isMenuOpen) { return markMessagesAsReaded(); } 
        
        setUnreadedMessageDividerCount(unReadedMessageCount)
    },[isMenuOpen]);

    useEffect(() => { if(isMenuOpen) markMessagesAsReaded() }, [messages.length])

    const clickMenuButton = () => {
        if(isMenuOpen) handleCloseModal();
        else {
            setIsMenuOpen(true);
            markMessagesAsReaded();
        }
    };

    const handleCloseModal = () => {
        setIsMenuOpen(false);
        setUnreadedMessageDividerCount(0);
    }

    return (
        <div 
            ref={chatbox}
            className={`absolute right-5 bottom-5 dropdown dropdown-top dropdown-end max-xs:right-1 max-xs:bottom-1 ${isMenuOpen && "dropdown-open"}`}>
            <MenuButton ref={buttonRef} onClick={clickMenuButton}/> 

            
            <ChatMenu unReadedDividerCount={unreadedMessageDividerCount} ref={menuRef} isOpen={isMenuOpen}  />
        </div>
    )
}

export default ChatBox