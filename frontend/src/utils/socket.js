import { io } from 'socket.io-client';

let socket;

const getSocketUrl = () => {
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
    const fromApi = apiUrl.replace(/\/+$/, '').replace(/\/api$/, '');
    return process.env.REACT_APP_SOCKET_URL || fromApi;
};

export const getSocket = () => {
    const token = localStorage.getItem('token');

    if (socket) {
        socket.auth = { token };
        if (!socket.connected) {
            socket.connect();
        }
        return socket;
    }

    socket = io(getSocketUrl(), {
        auth: { token },
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 500,
        timeout: 20000
    });

    return socket;
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = undefined;
    }
};
