import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    timeout: 70000, // the free server can take ~40s to wake up
});

// The backend runs on Render's free plan, which sleeps after 15 idle minutes.
// If a request is slow, tell the visitor instead of leaving them staring at a spinner.
let pending = 0;
let wakeTimer = null;
const WAKE_TOAST = 'server-waking';

const done = () => {
    pending = Math.max(0, pending - 1);
    if (pending === 0) {
        clearTimeout(wakeTimer);
        wakeTimer = null;
        toast.dismiss(WAKE_TOAST);
    }
};

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    pending += 1;
    if (!wakeTimer) {
        wakeTimer = setTimeout(() => {
            toast.loading('Waking up the kitchen server… this can take up to 40 seconds on free hosting.', {
                id: WAKE_TOAST,
                duration: 60000,
            });
        }, 4000);
    }
    return config;
});

api.interceptors.response.use(
    (r) => {
        done();
        return r;
    },
    (err) => {
        done();
        if (err.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
        return Promise.reject(err);
    }
);

export default api;
