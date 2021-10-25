import { Server } from 'socket.io';
import http from 'http';

export class SocketService {
    private io;

    constructor(server: http.Server) {
        this.io = new Server(server);
        this.io.on('connection', () => {
            console.log('user connected');
        });
    }

    public emitToAll(event: string, body: string) {
        this.io.emit(event, body);
    }

    public emitToRoom(event: string, body: string, roomId: string) {
        this.io.to(roomId).emit(event, body);
    }

    public joinRoom(socketId: string, roomId: string) {
        const socket = this.io.sockets.sockets.get(socketId);
        if (socket) socket.join(roomId);
    }

    public leaveRoom(socketId: string, roomId: string) {
        const socket = this.io.sockets.sockets.get(socketId);
        if (socket) socket.leave(roomId);
    }
}
