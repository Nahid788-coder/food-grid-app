import { io } from 'socket.io-client';

const URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api$/, '');

// Connected only on the tracking and admin pages. Going straight to a WebSocket skips
// the handful of HTTP long-polling requests Socket.io otherwise makes before upgrading.
export const socket = io(URL, {
    autoConnect: false,
    transports: ['websocket'],
});
