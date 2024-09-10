import { useRoomContext } from "../../context/RoomContext"
import toast from "react-hot-toast";
import { useSoundContext } from "../../context/SoundContext"
import { useSocketContext } from "../../context/SocketContext";
import { useGameContext } from "../../context/GameContext";
import { useEffect } from "react";
import MatchHistoryTable from "./matchHistoryTable/MatchHistoryTable";
import Avatar from "../avatar/avatar";

// eslint-disable-next-line react/prop-types
const WaitingRoom = ({ setPage }) => {
  const { room, isAdmin, leaveRoom, changeMemberRole, members } = useRoomContext();
  const { startGame, startGameTimer } = useGameContext();
  const { playClickSound } = useSoundContext();
  const {socket} = useSocketContext();
  const { game} = useGameContext();
  
  useEffect(() => {
    if(room === null) {
      return setPage('')
    }
  },[room, setPage])

  const handleStartGame = () => {
    playClickSound();

    const player1Count = members.filter(member => member.role === "player1").length;
    const player2Count = members.filter(member => member.role === "player2").length;

    // Check if there are more than one player of any role
    if (player1Count > 1 || player2Count > 1) {
        return toast.error('There can be only one player of each role (Player 1 and Player 2)');
    }

    // Check if any role is missing
    if (player1Count === 0 || player2Count === 0) {
        return toast.error('It requires one player of each role (Player 1 and Player 2) to start the game');
    }

    startGame();
  }

  const handleLeaveRoom = () => {
    playClickSound();
    leaveRoom();
    setPage('');
  }

  const handleChangeRole = (e, memberId) => {
    e.preventDefault();
    changeMemberRole(memberId,e.target.value)
  }

  return (
    room != null ? (
      <div className="w-full">
              <div className="flex flex-col w-full px-10 max-xs:px-3 gap-20">
        <div className="flex justify-between  max-md:flex-col items-center gap-5">

          <div className="overflow-auto members-table max-sm:w-11/12">
            <table className="table text-center">
              <thead>
                <tr>
                  <th>Room Members</th>
                  <th>Avatar</th>
                  <th>Nickname</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>

                {members.map((user,index) => (
                  <tr key={user.id} className={`${user.id == socket.id && "bg-base-200"}`}>
                    <th className="flex items-center gap-4">
                      <span>{index + 1} </span> {user.isAdmin && (<span>⭐</span>) }
                    </th>

                    <td>
                      <Avatar widthClass="w-12" player={user} ring={true} username={user.username}  />
                    </td>
                    
                    <td>{user.username}</td>
                    <td>
                      {isAdmin ? (
                        <select className="select select-bordered " value={user.role}
                          onChange={(e) => {handleChangeRole(e,user.id)}} >
                          <option value="player1" >
                            Player 1
                          </option>
                          <option value="player2" >
                            Player 2
                          </option>
                          <option value="spectator" disabled={members.length <= 2 ? "disabled" : ""}>
                            Spectator
                          </option>
                        </select>
                      )  : (user.role == "player1" ? "Player 1" : user.role == "player2" ? "Player 2" : "Spectator")}

                    </td>
                  </tr>

                ))}
              </tbody>

            </table>
          </div>

          <div className="roomId flex flex-col items-center gap-2 max-sm:mt-5">
            <div className="text-5xl">Room ID</div>
            <div className="text-3xl tracking-widest">{room.id}</div>
          </div>
        </div>
              
        <div className="flex flex-col gap-20">
          <div className="flex flex-col gap-10">
            <span className="text-4xl font-semibold text-center"> Match History </span>
            <MatchHistoryTable />
            
            {game && !room.allowSpectators && room.status === 'Ingame' && ((game.player1.id != socket.id) && (game.player2.id != socket.id))  && (
              <div className="waitingMessage text-3xl text-center font-semibold">
                Match in progress between {game.player1.username} and {game.player2.username} . Please wait <span className="loading loading-ball loading-lg"></span>
              </div>
            )}

          </div>


            <div className="flex justify-start  max-md:justify-center">
              
              <ul className="list-disc flex flex-col gap-3">
                <li>The room is {room.private ? "private" :"public"}</li>
                <li>The chat box feature is {room.allowChat ? "activated" :"disabled"}</li>
                <li>{room.allowSpectators ? "Spectators will be allowed in this room" : "Spectators will not be allowed in this room"}</li>
              </ul>
            </div>
        </div>

        <div className="flex justify-center items-center gap-10 max-sm:flex-col">

          { startGameTimer.isActive ? (
          <span className="countdown font-mono text-6xl">
            <span style={{"--value":startGameTimer.seconds - 1}}></span>
          </span>
    
          ) : (
            <>
              {isAdmin && (
                <button className="btn btn-success w-1/4 max-sm:w-full" onClick={() => handleStartGame()}>Start Game</button>
              )  }
              <button className="btn btn-error w-1/4 max-sm:w-full" onClick={() => handleLeaveRoom()}>Leave Room</button>
              
            </>
          )}
        </div>
      </div>
      </div>
    ) : (<></>)
  )
}

export default WaitingRoom