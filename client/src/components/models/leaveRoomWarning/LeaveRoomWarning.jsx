import {forwardRef} from 'react'
import { useRoomContext } from '../../../context/RoomContext'

// eslint-disable-next-line react/display-name
const LeaveRoomWarning = forwardRef((props, ref) => {
    const { leaveRoom } = useRoomContext();
    
  return (
    <dialog id="waitMatchCompleteModal" ref={ref} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
            <h3 className="font-bold text-lg">Are you sure to exit the game now?!</h3>
            <div className="modal-action">
            <form method="dialog">
                <div className="flex gap-4">
                    <button className="btn">Close</button>
                    <button className="btn btn-error" onClick={() => {leaveRoom()}}>Leave Room</button>
                </div>    
            </form>
            </div>
        </div>
    </dialog>
  )
})

export default LeaveRoomWarning