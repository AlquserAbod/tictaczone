/* eslint-disable react/prop-types */

import { GiCheckMark,GiCrossMark } from "react-icons/gi";
import { useGameContext } from "../../context/GameContext";
import { TiEquals } from "react-icons/ti";

const PlayerShow = ({reverse = false, player}) => {
  const { rounds } = useGameContext();
  
  return (
    <div className={`flex gap-5 ${reverse ? "flex-row-reverse" : ""}  max-md:flex-col items-center`}>
        <div className="avatarHolder">
            <div className="avatar">
                 <div className={`w-24 rounded-full ring
                  ${player.role == "player1" ? "ring-primary" : "ring-secondary"} ring-offset-base-100 ring-offset-2`}>
                    <img src={`https://avatar.iran.liara.run/public?username=${player.username}`} />
                </div>
            </div>
        </div>

        <div className={`flex flex-col max-md:items-center gap-2 ${reverse && "items-end"}`}>
            <span className="text-xl">{player.username}</span>

            <div className="flex flex-wrap gap-2 justify-center">
              {rounds.map((value, index) => (
                  <div key={index} className={`badge badge-md 
                  ${player.role == "player1" ? 'badge-primary' : "badge-secondary"}`}>
                    {value.winner == null ? <TiEquals /> : value.winner.role == player.role ? <GiCheckMark /> : <GiCrossMark />}
                  </div>
              ))}
            </div>
        </div>
    </div>
  )
}

export default PlayerShow