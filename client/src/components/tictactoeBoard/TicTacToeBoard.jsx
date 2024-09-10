/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useGameContext } from "../../context/GameContext";
import Square from "./Square/Square";
  


const TicTacToeBoard = () => {
  const { game, board, winPattern } = useGameContext();

  const chunkBoardIntoRows = (board) => {
    const rows = [];
    for (let i = 0; i < board.length; i += 3) {
      rows.push(board.slice(i, i + 3));
    }
    return rows;
  };

  return (
    <div className="h-full flex w-3/12  max-2xl:w-1/3 max-lg:w-1/2  max-md:w-7/12 max-sm:w-9/12 max-xs:w-11/12  items-center flex-col">

    
      <div className="w-full">
        <div className="mx-3 flex justify-around max-xs:flex-col  items-center bg-neutral py-3 max-xs:py-1 rounded-t-3xl text-xl">
          <span className={`font-extrabold ${game.currentPlayer === "player1" ? "text-primary" : ""}`}>X Turn</span>
          <div className="divider xs:divider-horizontal my-0"></div> 
          <span className={`font-extrabold ${game.currentPlayer === "player2" ? "text-secondary" : ""}`}>O Turn</span>
        </div>
      </div>
      
      <table className=" w-full aspect-square  rounded-t-lg overflow-hidden  border-separate border-spacing-3">
          {chunkBoardIntoRows(board).map((row, rowIndex) => (
            <tr key={rowIndex} className="w-1/3 h-1/4">
              {row.map((value, colIndex) => (
                <Square
                  key={rowIndex * 3 + colIndex}
                  value={value}
                  index={rowIndex * 3 + colIndex}
                  isWinning={winPattern != null && winPattern.includes(rowIndex * 3 + colIndex)}
                />
              ))}
            </tr>
          ))}
      </table>

    </div>
  );
};

export default TicTacToeBoard