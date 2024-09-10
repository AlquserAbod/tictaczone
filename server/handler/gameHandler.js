import RoomStatus from "../Enums/RoomStatus.js";
import {
  checkWinPattern,
  determineMatchWinner,
  resetBoard,
  toggleCurrentPlayer,
} from "../GameLogic.js";
import { updateRoom } from "./roomHandler.js";
import { io } from "../socket/socket.js";
import addMatchToHistory from "../utils/RoomUtils/AddMatchToHistory.js";
import destroyGame from "../utils/GameUtils/destroyGame.js";
import joinWaitingPlayerToChat from "../utils/ChatUtils/CheckToWaitingPlayerTojoin.js";

export let games = [];

export const updateGame = (updatedGameData) => {
  const index = games.findIndex((room) => room.id === updatedGameData.id);

  if (index !== -1) {
    games[index] = updatedGameData;
  }

  io.in(updatedGameData.roomId).emit("game_updated", { game: updatedGameData });
};

export default function handleGameEvents(io, socket) {
  socket.on("start_game", (room) => {
    const game = {
      roomId: room.id,
      player1: JSON.parse(
        room.members.find((member) => JSON.parse(member).role == "player1")
      ),
      player2: JSON.parse(
        room.members.find((member) => JSON.parse(member).role == "player2")
      ),
      rounds: [],
      currentPlayer: "player1",
      board: Array(9).fill(null),
      roundCount: 0,
    };

    games.push(game);

    room.status = RoomStatus.Ingame;

    updateRoom(room);

    io.in(room.id).emit("start_game", game);
  });

  socket.on("make_move", async ({ room, position }) => {
    try {
      const game = games.find((game) => game.roomId === room.id);
      const player = JSON.parse(
        room.members.find((member) => JSON.parse(member).id == socket.id)
      );

      const symbol = player.role === "player1" ? "X" : "O";
      game.board[position] = symbol;

      io.in(room.id).emit("update_board", { room, board: game.board });

      const winPattern = checkWinPattern(game.board, symbol);

      let roundData = { board: game.board };

      if (winPattern != undefined) {
        const roundWinner =
          player.role === "player1" ? game.player1 : game.player2;

        roundData = {
          ...roundData,
          winner: roundWinner,
          winPattern: winPattern,
        };

        game.rounds.push(roundData);

        io.in(room.id).emit("round_winner", roundData);
        game.roundCount++;

        const matchWinner = determineMatchWinner(game.rounds);

        if (matchWinner !== null) {
          io.in(room.id).emit("match_ended", { winner: matchWinner });
          addMatchToHistory(room, game);
          room.status = RoomStatus.Waiting;
          updateRoom(room);
          joinWaitingPlayerToChat(room.id);
          await destroyGame(room.id);
          roundData = null;
        } else {
          // Start next round
          game.board = resetBoard();
          game.currentPlayer = toggleCurrentPlayer(game);
        }
      } else if (game.board.every((cell) => cell !== null)) {
        game.rounds.push(roundData);

        io.in(room.id).emit("round_winner", { roundData });

        game.roundCount++;

        if (game.roundCount === 7) {
          // Match ends in a draw
          io.in(room.id).emit("match_ended", { winner: "tie" });
          addMatchToHistory(room, game);
          room.status = RoomStatus.Waiting;
          updateRoom(room);
          joinWaitingPlayerToChat(room.id);
          await destroyGame(room.id);
          roundData = null;
        } else {
          // Start next round
          game.board = resetBoard();
          game.currentPlayer = toggleCurrentPlayer(game);
        }
      } else {
        // Next player's turn
        game.currentPlayer = toggleCurrentPlayer(game);
      }

      updateGame(game);
    } catch (error) {
      return console.log("make_move handlare error", error);
    }
  });
}
