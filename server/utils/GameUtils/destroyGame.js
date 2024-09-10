import { games } from "../../handler/gameHandler.js"

export default async function  destroyGame(roomId)  {
    const gameIndex = games.findIndex(game => game.roomId === roomId);
    
    if (gameIndex !== -1) {

        games.splice(gameIndex, 1);
          
        console.log("games index: " , gameIndex);
        console.log("games length: " , games.length);

        console.log(`room ${roomId}  game has been destroyed.`);
    }
}