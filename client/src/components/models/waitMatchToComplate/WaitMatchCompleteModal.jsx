import {forwardRef} from 'react'
import { useRoomContext } from '../../../context/RoomContext'

// eslint-disable-next-line react/display-name
const WaitMatchCompleteModal = forwardRef((props, ref) => {

  const { leaveRoom } = useRoomContext();

  return (
    <dialog id="waitMatchCompleteModal" ref={ref} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
            <h3 className="font-bold text-lg">
              <span> Room in match  </span>
              
              <span className="loading loading-spinner loading-sm"></span>
              </h3>
            <p className="py-4">Room members are now in a match, please wait until the match ends </p>

            <div className="modal-action">
              <form method="dialog">
                <button className="btn btn-warning" onClick={() => leaveRoom()}>Leave Room</button>
              </form>
            </div>
        </div>
    </dialog>
  )
})

export default WaitMatchCompleteModal