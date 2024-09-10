/* eslint-disable react/prop-types */
import Avatar from "../../avatar/avatar"

const MatchTr = ({index, match}) => {

    const player1 = match.player1;
    const player2 = match.player2;
    const winner = match[match.winner];

    return (
        <tr key={index}>
            <th>
                <span>{index + 1} </span>
            </th>

            <td>
                <div className="flex gap-5 items-center w-fit max-sm:flex-col  max-sm:justify-center ">
                    <Avatar widthClass="w-9" player={player1} ring={true} username={player1.username}  />
                    <span>{player1.username}</span>
                </div>
            </td>

            <td>
                <div className="flex gap-5 items-center w-fit max-sm:flex-col max-sm:justify-center">
                    <Avatar widthClass="w-9" player={player2} ring={true} username={player2.username}  />
                    <span>{player2.username}</span>
                </div>
            </td>

            <td>
                <span className="font-extrabold">{winner != null ? winner.username : "Tie"}</span>
            </td>

            <td>
                <div className="flex flex-col gap-2">
                    <div className="">
                        <div key={index} className={`badge badge-md badge-primary text-nowrap`}>
                        {player1.username} Win {match.rounds.filter(round => round.winner != null ? round.winner.role == player1.role : false).length} round
                        </div>
                    </div>

                    <div className="">
                        <div key={index} className={`badge badge-md badge-secondary text-nowrap`}>
                        {player2.username} Win {match.rounds.filter(round => round.winner != null ? round.winner.role == player2.role : false).length} round
                        </div>
                    </div>

                    <div className="flex">
                        <div key={index} className={`badge badge-md badge-neutral text-nowrap`}>
                        {match.rounds.filter(round => round.winner == null).length} round is tie
                        </div>
                    </div>
                </div>
            </td>

        </tr>
    )
}

export default MatchTr