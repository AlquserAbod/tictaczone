import {  useEffect, useState } from "react";
import { useSoundContext } from "../../context/SoundContext"
import CreateRoom from "../../components/createroom/CreateRoom";
import SetUserForm from "../../components/setUserForm/setUserForm";
import WaitingRoom from "../../components/waitingroom/WaitingRoom";
import JoinRoom from "../../components/joinroom/JoinRoom";
import { useRoomContext } from "../../context/RoomContext";

const Home = () => {
  const { playClickSound } = useSoundContext();
  const [page, setPage] = useState('');
  const { room,waitToComplateMatch } = useRoomContext();

  useEffect(() => { 
    if(room != null && !waitToComplateMatch ) setPage('waiting-room')
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[room]);

  return (
    <>
      <div className="flex justify-center flex-col items-center h-full pb-20">

          <div className="logo w-1/5 max-lg:w-1/2 max-sm:w-64  cursor-pointer" onClick={() => setPage('')}>
            <img src="/images/logo.png" alt="Site Logo" className='disable-selection'/>
          </div>

          {page !== 'waiting-room' ? (
            <>
              <SetUserForm />
            </>
          ) : (<></>)}
          <div className="divider mr-5 ml-5"></div>

          {page === '' ? (

            <div className=' flex justify-around gap-52 flex-wrap'>
              
                <button className="btn btn-neutral min-w-60 min-h-32 cursor-pointer hover:scale-110" onClick={() => {
                  playClickSound()
                  setPage('create-room')
                }}>
                  Create Room
                </button>
                <button className="btn btn-neutral min-w-60 min-h-32 cursor-pointer hover:scale-110" onClick={() => {
                  playClickSound()
                  setPage('join-room')
                }}>
                  Join Room
                </button>
            </div>
          ) : page === "create-room" ? 
          (<CreateRoom  setPage={setPage}/>) : page === "waiting-room" ? (<WaitingRoom setPage={setPage}/>) : page == "join-room" ? (<JoinRoom setPage={setPage}/>) :
           (<></>)}

          
      </div> 
      <div>

      </div>
      
    </>

  )
}



export default Home