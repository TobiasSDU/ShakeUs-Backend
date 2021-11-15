import { Server } from 'socket.io';
import http from 'http';

export class SocketService {
    private io;

    constructor(server: http.Server) {
        this.io = new Server(server);

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

    public emitToRoom(
        event: string,
        body: Record<string, unknown>,
        roomId: string
    ) {
        this.io.to(roomId).emit(event, body);
    }
}
