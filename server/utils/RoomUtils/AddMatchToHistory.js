import { determineMatchWinner } from "../../GameLogic.js";
import { updateRoom } from "../../handler/roomHandler.js";

export default function addMatchToHistory(room, game) {
  if (room != null) {
    room.matchHistory.push(
      JSON.stringify({
        player1: game.player1,
        player2: game.player2,
        rounds: game.rounds,
        winner: determineMatchWinner(game.rounds),
      })
    );

    updateRoom(room);
  }
}
