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

    public emitEvent(event: string, body: string) {
        if (body) this.io.emit(event, body);
    }
}
