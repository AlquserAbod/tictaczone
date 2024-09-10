/* eslint-disable react/prop-types */

import { forwardRef } from 'react';
import { useChatContext } from '../../context/ChatContext';
import { IoChatbox } from 'react-icons/io5';

// eslint-disable-next-line react/display-name
const MenuButton = forwardRef((props, ref) => {
    const { unReadedMessageCount } = useChatContext();



    return (
        <div role="button"
        className="indicator rounded-full bg-primary p-4 text-2xl cursor-pointer hover:scale-110 transition-all"
        ref={ref}
        onClick={props.onClick}>
                {unReadedMessageCount() > 0 && (
                    <span className="indicator-item indicator-start badge badge-error">{unReadedMessageCount()}+</span> 
                )}
            <IoChatbox />
        </div>
    );
});

export default MenuButton;
