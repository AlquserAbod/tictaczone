import { useRoomContext } from "../../../context/RoomContext"
import MatchTr from "./MatchTr";

const MatchHistoryTable = () => {
const { room } = useRoomContext();
  return (
    <div className="overflow-auto matchHistory ">
        <table className="table ">
        <thead>
            <tr>
            <th>Match History</th>
            <th>Playr 1</th>
            <th>Player 2</th>
            <th>Winner</th>
            <th>Rounds</th>
            </tr>
        </thead>
        <tbody>
            {room.matchHistory.length > 0 ? (
                room.matchHistory.map((match,index) => (
                    <MatchTr key={index} match={JSON.parse(match)} index={index} />
                ))

            ) : (
                <tr className=" text-gray-400 text-center">
                    <td colSpan={5}>
                        No Match Played in this room

                    </td>
                </tr>
            )}
        </tbody>

        </table>

    </div>
  )
}

export default MatchHistoryTable