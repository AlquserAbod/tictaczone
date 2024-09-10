import {   useEffect, useState } from "react";
import { useSoundContext } from "../../context/SoundContext"
import { FaLock,FaLockOpen } from "react-icons/fa";
import { FaEye,FaEyeSlash } from "react-icons/fa6";
import { IoChatbox } from "react-icons/io5";
import { RiChatOffFill } from "react-icons/ri";
import { useRoomContext } from "../../context/RoomContext";

// eslint-disable-next-line react/prop-types
const CreateRoom = ({ setPage }) => {
    const { playClickSound,playSwitchSound } = useSoundContext();
    const [privateRoom,setPrivateRoom] = useState(false);
    const [allowSpectators,setAllowSpectators] = useState(true);
    const [allowChat,setAllowChat] = useState(true);
    const [selectedGame, setSelectedGame] = useState(0);
    const { createRoom,room } = useRoomContext();

    const setGame = (e) => {
        e.preventDefault();
        if(e === selectedGame) return 
        playClickSound();
        setSelectedGame(e.target.value)
    }

    const handleSubmitButton = () => {
        playClickSound();

        createRoom({
            private: privateRoom,
            allowSpectators,
            allowChat,
            gameId: selectedGame
        });
    }

    useEffect(() => {
        if(room == null) return
        setPage('waiting-room')
    },[room, setPage])
    
  return (
    <div className="flex flex-col items-center w-full mb-5 mt-5  flex-wrap"> 
    
        <div className="flex justify-between p-20 gap-10 items-center w-full max-sm:justify-start max-md:flex-col max-lg:p-5">

            <div className="controllse flex-1 flex items-center flex-col pr-5 pl-5">
                <div className="form-control w-52 mt-5">
                    <label className="cursor-pointer label">
                        <span className="label-text">Private Room :</span> 
                        <input type="checkbox" className="toggle toggle-primary" checked={privateRoom} 
                            onChange={() => {
                                playSwitchSound();
                                setPrivateRoom(!privateRoom)
                            }}/>
                        <label className={`swap swap-flip`}>
                            <div className={`${!privateRoom ? 'swap-off' : 'swap-on'}`}><FaLockOpen /></div>
                            <div className={`${!privateRoom ? 'swap-on' : 'swap-off'}`}><FaLock /></div>
                        </label>
                    </label>
                </div>

                <div className="form-control w-52 mt-5">
                    <label className="cursor-pointer label">
                        <span className="label-text">Allow spectators:</span> 
                        <input type="checkbox" className="toggle toggle-primary" checked={allowSpectators} 
                            onChange={() => {
                                playSwitchSound();
                                setAllowSpectators(!allowSpectators);
                            }} />
                        <label className={`swap swap-rotate`}>
                            <div className={`${!allowSpectators ? 'swap-off' : 'swap-on'}`}><FaEyeSlash /></div>
                            <div className={`${!allowSpectators ? 'swap-on' : 'swap-off'}`}><FaEye /></div>
                        </label>                      
                    </label>
                </div>

                <div className="form-control w-52 mt-5">
                    <label className="cursor-pointer label">
                        <span className="label-text">Allow chat box:</span> 
                        <input type="checkbox" className="toggle toggle-primary" checked={allowChat} 
                            onChange={() => {
                                playSwitchSound();
                                setAllowChat(!allowChat)
                            }} />
                        <label className={`swap swap-rotate`}>
                            <div className={`${!allowChat ? 'swap-off' : 'swap-on'}`}><RiChatOffFill /></div>
                            <div className={`${!allowChat ? 'swap-on' : 'swap-off'}`}><IoChatbox /></div>
                        </label>                        
                    </label>
                </div>
            </div>
            
                            
            <div role="alert" className="alert mx-20">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <ul>
                    <li>If the room is private, the room can only be entered via the room ID. If it is public, any player on the site can enter it randomly.</li>
                    <div className="divider"></div> 
                    <li>If you allow spectators, more than the required number can enter the room. If you do not allow spectators, only the specified number of players can enter the room.</li>
                </ul>
            </div>

        </div>

        <div className="btn-group flex justify-center gap-10 w-1/2 mt-20 max-sm:flex-col-reverse">
            <div className="goBack flex justify-center w-full">
                <button className="btn w-full" onClick={() => {
                    playClickSound();
                    setPage('');
                }}>Go back</button>
            </div>
            <div className="createButton  flex justify-center w-full">
                <button className="btn btn-success w-full" onClick={() => handleSubmitButton()}>
                    Create room
                </button>
            </div>

        </div>
    </div>
  )
}

export default CreateRoom