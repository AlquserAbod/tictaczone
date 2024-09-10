/* eslint-disable react/prop-types */

import { forwardRef, useEffect, useRef, useState } from 'react';
import { useChatContext } from '../../context/ChatContext';
import SendMessageInput from './SendMessageInput';

// eslint-disable-next-line react/display-name
const ChatMenu = forwardRef((props, ref) => {
    const { messages,unReadedMessageStartIndex } = useChatContext();

    const [startIndexToShowDivider, setStartIndexToShowDivider] = useState(null);
    const messageContainer = useRef(null);
    const unReadDivider = useRef(null);

    useEffect(() => {
        if (!props.isOpen) {
            setStartIndexToShowDivider(unReadedMessageStartIndex());
        }else {
            const timeoutId = setTimeout(() => {
                setStartIndexToShowDivider(null);
            }, 3000); // 3 seconds
            return () => clearTimeout(timeoutId);
        }
    }, [props.isOpen, unReadedMessageStartIndex]);

    useEffect(() => {
        if (props.isOpen) {
            if (unReadDivider.current) {
                unReadDivider.current.scrollIntoView({ behavior: 'smooth' });
            } else if (messageContainer.current) {
                messageContainer.current.scrollTop = messageContainer.current.scrollHeight;
            }
        }
    }, [props.isOpen]);
    
    return (
        <div 
            className={`dropdown-content z-[1] menu p-2 shadow 
            bg-base-100 rounded-box w-80 max-xs:w-auto mb-2
            ${props.isOpen && "dropdown-open"} `}
            ref={ref} >
            <div className="title text-2xl mx-2 mt-2 mb-1 text-info"> ChatBox</div>
            
            {messages != null && messages.length > 0 && (
                <div className="divider my-1"></div>
            )}

            <div className="flex flex-col max-h-72 overflow-auto" ref={messageContainer}>
                {messages != null && messages.map((value,index) => {
                    return (
                        <div key={index+ 1}>
                            {(index == startIndexToShowDivider) && (
                                <div className="divider divider-error" ref={unReadDivider} >new messages</div>
                            )}

                            <div className="message">
                                <span>(<span>{value.role}</span>) </span>
                                <span className={`font-semibold ${value.role == "P1" ? "text-primary" : value.role == "P2" ? "text-secondary" : "text-neutral"}`}> 
                                {value.senderUsername} :</span>
                                <span> {value.message}</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="divider my-1"></div>

            <SendMessageInput />
        </div>

    );
});

export default ChatMenu;
