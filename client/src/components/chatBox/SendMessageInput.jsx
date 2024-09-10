import { useState } from 'react'
import { IoSend } from 'react-icons/io5'
import { useChatContext } from '../../context/ChatContext';

const SendMessageInput = () => {
    const [message, setMessage] = useState('');
    const { sendMessage } = useChatContext();
    const { markMessagesAsReaded } = useChatContext();

    const handleSendMessage = () => {
        if(!message) return

        sendMessage(message);
        setMessage('');
        markMessagesAsReaded();
    }

  return (
    <label className="input input-bordered flex items-center gap-2 max-xs:gap-0">
        <input type="text" className="grow max-xs:w-fit" placeholder="Enter Message.."
            value={message}
            onChange={(e) => setMessage(e.target.value)} 
            onKeyDown={e => e.key == "Enter" && handleSendMessage()}/>
        <div className="cursor-pointer" onClick={handleSendMessage}>
            <IoSend />
        </div>
    </label>
  )
}

export default SendMessageInput