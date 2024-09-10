export function checkWinPattern(board, symbol) {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6] // Diagonals
    ];

    return winPatterns.find(pattern => {
        return pattern.every(index => board[index] === symbol);
    });
}

export function determineMatchWinner(rounds) {
    const player1Wins = rounds.filter(round => round.winner != null ? round.winner.role === 'player1' : false ).length;
    const player2Wins = rounds.filter(round => round.winner != null ? round.winner.role === 'player2' : false ).length;
    const totalRounds = rounds.length;

    // Check if any player has won 4 rounds
    if (player1Wins >= 4) {
        return 'player1';
    } else if (player2Wins >= 4) {
        return 'player2';
    } else if(rounds.length === 7) {
        return "tie";
    } else {
        return null
    }
}

export function resetBoard() {
    return Array(9).fill(null);
}

export function toggleCurrentPlayer(game) {
    return (game.currentPlayer === 'player1') ? 'player2' : 'player1';
   
}
