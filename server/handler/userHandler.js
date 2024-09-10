import  PlayerStatus  from "../Enums/PlayerStatus.js"

export const OnlineUsers = {};



export default function handleUserEvents(io, socket) {
    OnlineUsers[socket.id] = {
        id: socket.id,
        username: socket.handshake.query.username || '',
        status: PlayerStatus.Lobbye
    };

    io.emit("get_online_users", Object.values(OnlineUsers));

    socket.on("set_username",(username) => {
        if(!OnlineUsers[socket.id]) return socket.emit('user_not_found')

        OnlineUsers[socket.id].username = username;

        io.emit("get_online_users", Object.values(OnlineUsers));
    });

    socket.on("update_user_state",( status ) => {
        if(!OnlineUsers[socket.id]) return socket.emit('user_not_found')

        OnlineUsers[socket].status = status;

        io.emit("get_online_users", Object.values(OnlineUsers));
    });

    socket.on("disconnect",async ()=> {
        delete OnlineUsers[socket.id];

        io.emit("get_online_users",Object.values(OnlineUsers));
    });


}
