import { BiExit } from "react-icons/bi";
import LeaveRoomWarning from "../../components/models/leaveRoomWarning/LeaveRoomWarning";
import {  useEffect, useRef } from "react";
import TicTacToeBoard from "../../components/tictactoeBoard/TicTacToeBoard";
import PlayerShow from "../../components/playerShow/playerShow";
import { useNavigate } from "react-router-dom";
import { useGameContext } from "../../context/GameContext";
import { useRoomContext } from "../../context/RoomContext";


const Game = () => {
    const leaveRoomWarning = useRef();
    const { game } = useGameContext();
    const { room } = useRoomContext();
    const navigate = useNavigate();

    useEffect(() => {
        if (game == null) {
            navigate('/'); // Redirect if room is null
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [game]);


    if (game == null) {
        return null;
    }

    return (
        <>
            <div className="flex flex-col gap-20">
                <div className="flex gap-3 items-center">
                    <div>
                        <img src="/images/logo.png" className="w-24" />
                    </div>

                    <button className="btn btn-sm btn-circle btn-outline" onClick={() => leaveRoomWarning.current.showModal()}>
                        <BiExit className="font-bold text-sm" />
                    </button>

                </div>

                <div className="flex flex-col  flex-1 gap-20 mb-20">
                    <div className="flex justify-around max-xs:flex-col gap-5">
                        <PlayerShow reverse={false} 
                            player={JSON.parse(room.members.find(member => JSON.parse(member).role == "player1"))} />
                        <PlayerShow reverse={true} 
                            player={JSON.parse(room.members.find(member => JSON.parse(member).role == "player2"))} />
                    </div>

                    <div className="flex justify-center flex-1">
                        <TicTacToeBoard />
                    </div>
                </div>
            </div>

            <>
                <LeaveRoomWarning  ref={leaveRoomWarning} />    
            </>
        </>

    )
}

export default Game