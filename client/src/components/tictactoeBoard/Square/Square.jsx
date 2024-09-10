import { useEffect, useState } from "react";
import { useGameContext } from "../../../context/GameContext";
import { useSoundContext } from "../../../context/SoundContext.jsx";
import "./styles.css"


// eslint-disable-next-line react/prop-types
const Square = ({ value, index, isWinning }) => {
    const { makeMove,myTurn, winPattern, matchWinner } = useGameContext();
    const [isEmpty, setIsEmpty] = useState(true);
    const { playSquareClickSound } = useSoundContext();
    const [winEffectBg,setWinEffectBg] = useState('')

    const handleMakeMove = (index) => {
      if(!isEmpty || !myTurn || matchWinner != null) return
      makeMove(index)
      playSquareClickSound();
    }

    useEffect(() => {
      if(matchWinner == null) return 

      setWinEffectBg(matchWinner == "player1" ? "bg-primary" : 
        matchWinner == "player2" ? "bg-secondary" : matchWinner == "tie" ? "bg-slate-400 opacity-50" : "");

    },[matchWinner]);

    useEffect(() => {
      setIsEmpty(value == null)
    },[value])

  return (
    <td className={`bg-neutral rounded-lg cursor-pointer w-1/3
        max-sm:text-5xl max-xs:text-3xl
        text-center text-8xl font-bold font-serif
        ${isWinning && matchWinner == null && (value == "X" ? "bg-primary" : value == 'O' ? "bg-secondary" : '')} 
        ${winPattern == null && "bg-slate-400 opacity-50"} ${winEffectBg}
        transition-all   ${isEmpty && matchWinner == null && myTurn ? "square-can-hover" : ""}`}
        onClick={() => handleMakeMove(index)}>
          {value}
    </td>
  )
}

export default Square