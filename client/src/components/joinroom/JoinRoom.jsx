import { useEffect, useRef, useState } from "react";
import { useSoundContext } from "../../context/SoundContext";
import toast from "react-hot-toast";
import { useRoomContext } from "../../context/RoomContext";
import useTimer from "../../hooks/useTimer";
import WaitMatchCompleteModal from "../models/waitMatchToComplate/WaitMatchCompleteModal"

// eslint-disable-next-line react/prop-types
const JoinRoom = ({ setPage }) => {
    const { playClickSound } = useSoundContext();
    const { joinRoom,room, waitToComplateMatch, joinRandomRoom} = useRoomContext();

    const [roomId, setRoomId] = useState('');
    const waitMatchCompleteModal = useRef(null);

    const {  startTimer, isActive: searchingForRandomRoom,resetTimer } = useTimer(7,() => {
        joinRandomRoom();
        resetTimer();
    });


    const handleJoinRoomWithId = () => {
        if(roomId.length < 6) {
            toast.error('Room ID must be at least 6 characters long')
            return
        }

        playClickSound()
        joinRoom(roomId)
    }

    useEffect(() => {
        if(room == null) return

        if(waitToComplateMatch) {
            waitMatchCompleteModal.current.showModal();
        } else {
            setPage('waiting-room');
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[waitMatchCompleteModal,room])

    const handleSearchRandomRoom = () => {
        if(searchingForRandomRoom) return;
        

        playClickSound();

        startTimer();
    }

    return (
        <div className="flex flex-col justify-center items-center gap-20 container my-24">
            <div className=' flex justify-around  w-full gap-y-20 max-md:flex-col items-center '>
                        
                <button className={`btn btn-neutral min-w-60 min-h-32 cursor-pointer ${searchingForRandomRoom ? "scale-110" : "hover:scale-110 "}`} onClick={() => {handleSearchRandomRoom()}}>
                    Find a random room
                    {searchingForRandomRoom && (<span className="loading loading-dots loading-md"></span>)}
                </button>

                <div className="join">
                    <input className="input input-lg input-bordered join-item" placeholder="Enter room id" 
                        value={roomId}
                        disabled= {searchingForRandomRoom && "disabled"}
                        onChange={(e) => setRoomId(e.target.value)}/>
                    <button className="btn join-item rounded-r-full btn-lg" onClick={handleJoinRoomWithId}
                        disabled= {searchingForRandomRoom && "disabled"}
                        >Join</button>
                </div>
            </div>

            <div className="goBack w-full flex justify-center">
                <button className="btn w-1/2" onClick={() => {
                    playClickSound();
                    setPage('')
                }}> Go back</button>
            </div>

            <WaitMatchCompleteModal ref={waitMatchCompleteModal} />
        </div>
    )
}

export default JoinRoom