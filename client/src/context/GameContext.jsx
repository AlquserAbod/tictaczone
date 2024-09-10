import { createContext, useContext, useState, useEffect } from "react";
import { useSocketContext } from "./SocketContext";
import toast from "react-hot-toast";
import { useRoomContext } from "./RoomContext";
import { useNavigate } from "react-router-dom";
import useTimer from "../hooks/useTimer";
import { useSoundContext } from "./SoundContext";

const GameContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useGameContext = () => {
    return useContext(GameContext);
}

// eslint-disable-next-line react/prop-types
export const GameContextProvider = ({ children }) => {
    const [game, setGame] = useState(null);
    const [myTurn, setMyTurn] = useState(false);
    const [board, setBoard] = useState(null)
    const [rounds, setRounds] = useState(null)
    const [matchWinner, setMatchWinner] = useState(null)
    const [winPattern, setWinPattern] = useState([]);
    
    const navigate = useNavigate();

    const { socket } = useSocketContext();
    const {room, members, waitToComplateMatch} = useRoomContext();
    const { playLoasingGameSound,playWiningGameSound, playTiaGameSound } = useSoundContext();

    const startGameTimer  = useTimer(4, () => {
        // eslint-disable-next-line no-undef
        startGameTimer.resetTimer();
        navigate('/game');
    });

    const endGameTimer  = useTimer(2, () => {
        setRounds(null);
        setMatchWinner(null)
        setGame(null)
        setBoard(Array(9).fill(null));
        // eslint-disable-next-line no-undef
        endGameTimer.resetTimer();
        navigate('/');
    });


    const nextRoundTimer = useTimer(2, () => {
        setWinPattern([]);
        setBoard(Array(9).fill(null))
        nextRoundTimer.resetTimer();
    });
    

    const checkRole = (role) => role == (members.find((member) => member.id == socket.id )).role;

    useEffect(() => {
        if(game == null || members == null || nextRoundTimer.isActive) return
        setMyTurn(checkRole(game.currentPlayer))
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[game, members, board, socket, nextRoundTimer.isActive]);

    useEffect(() => {
        if (!socket || waitToComplateMatch) return

        const handleGameEvents = {
            start_game: (game) => {
                if (game === null) {
                    toast.error('No game found.');
                } else {
                    startGameTimer.startTimer();
                    setBoard(game.board);
                    setGame(game);
                    setRounds([]);
                }
            },
            game_updated: ({game}) => {
                setGame(game);
            },
            update_board: ({ board }) => {
                if(board == null) return toast.error('no board found.')

                setBoard(board)
            },
            round_winner: (roundData) => {
                if(game == null || roundData == null) return;

                setRounds(prevRounds => [...prevRounds, roundData]);

                if(roundData.winPattern == null) {
                    setWinPattern(null);
                } else {
                    setWinPattern(roundData.winPattern);
                }
                setMyTurn(false);
                nextRoundTimer.startTimer();
            },
            match_ended: ({winner}) => {
                if(winner == null) return;
                                
                setMatchWinner(winner);

                if(winner ==  "tie") {
                    playTiaGameSound();
                } else if(checkRole(winner)) { 
                    playWiningGameSound();
                } else {
                    playLoasingGameSound();
                }

                endGameTimer.startTimer();
            },
        };

        Object.entries(handleGameEvents).forEach(([eventName, handler]) => {
            socket.on(eventName, handler);
        });

        return () => {
            Object.entries(handleGameEvents).forEach(([eventName, handler]) => {
                socket.off(eventName, handler);
            });
        };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ game, members, socket, startGameTimer]);


    const makeMove = (position) => {
        socket.emit('make_move', { room , position });
    };

    const startGame = () => {
        if (!socket || !room) return;
        
        socket.emit('start_game', room);
    }


    return (
        <GameContext.Provider value={{ 
            makeMove, 
            startGame,
            board,
            startGameTimer,
            nextRoundTimer,
            myTurn,
            game,
            winPattern,
            rounds,
            matchWinner
         }}>
            {children}
        </GameContext.Provider>
    );
};
