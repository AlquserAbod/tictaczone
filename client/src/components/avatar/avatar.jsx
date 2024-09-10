
// eslint-disable-next-line react/prop-types
const Avatar = ({widthClass="w-24",ring=false, player= null,username=""}) => {

    const ringColor = player != null? player.role == "player1" ? "ring-primary" : player.role == "player2" ? "ring-secondary" : "ring-neutral" : "ring-accent";

    return (
        <div className="avatar">
            <div className={`${widthClass} 
            rounded-full ${ring && "ring ring-offset-base-100 ring-offset-2" } ${ring && ringColor}`}>
                <img src={`https://avatar.iran.liara.run/public?username=${username}`} />
            </div>
        </div>
    )
}

export default Avatar