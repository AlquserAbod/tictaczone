import { useEffect, useState } from "react"
import generateRandomNickname from "../../utils/generateRandomNickname";
import { useSocketContext } from "../../context/SocketContext";
import toast from "react-hot-toast";
import Avatar from "../avatar/avatar";

const SetUserForm = () => {
    const [nickname, setNickname] = useState('');
    const { setUsername } = useSocketContext();


    useEffect(() => {
        const savedNickName = localStorage.getItem('gamesquare_nickname');

        if(savedNickName == null) {
            if(nickname == '') {
                const randomNickname = generateRandomNickname()
                localStorage.setItem('gamesquare_nickname',randomNickname);

                setNickname(randomNickname);
            }

            return
        }

        setNickname(savedNickName);

        setUsername(savedNickName)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    const handleBlurNickname = (e) => {
        e.preventDefault();
        
        if(e.target.value == "") {
            toast.error('Please enter the nickname with at least one letter')
            e.target.value = generateRandomNickname()
            setNickname(e.target.value)
        }

        localStorage.setItem('gamesquare_nickname',e.target.value);

        setUsername(e.target.value)
    }

    return (
        <div className=" mb-20 flex items-center gap-20 max-sm:flex-col ">
            <div className="avatar-holder">
                <Avatar widthClass="w-32" ring={true} username={localStorage.getItem('gamesquare_nickname')} />
            </div>

            <div className="nickname w-full">
                <input type="text" placeholder="Enter Nickname"
                    className="input input-bordered w-full max-w-xs input-lg input-accent" 
                    value={nickname}
                    onBlur={(e) => handleBlurNickname(e)}
                    onChange={(e) => {setNickname(e.target.value)}}
                    />
                    
                <div className="reset">

                </div>
            </div>
        </div>
    )
}

export default SetUserForm