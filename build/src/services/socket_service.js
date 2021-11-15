"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketService = void 0;
const socket_io_1 = require("socket.io");
class SocketService {
    constructor(server) {
        this.io = new socket_io_1.Server(server);
        this.io.on('connection', (socket) => {
            socket.on('join-room', (roomId) => {
                socket.join(roomId);
                console.log('User joined room: ' + roomId);
            });
            socket.on('leave-room', (roomId) => {
                socket.leave(roomId);
            });
        });
    }
    emitToRoom(event, body, roomId) {
        this.io.to(roomId).emit(event, body);
    }
}
exports.SocketService = SocketService;
