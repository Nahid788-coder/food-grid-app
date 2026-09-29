import api from './axios';

// The menu is the same for every page (Home, Menu, Admin), so it is loaded once
// and shared. Pages filter it in the browser instead of asking the server again.
const TTL = 5 * 60 * 1000;

let cache = null; // { data, at }
let inflight = null;

/** Full available menu. Parallel callers share one request; results are reused for 5 minutes. */
export function getMenu({ fresh = false } = {}) {
    if (!fresh && cache && Date.now() - cache.at < TTL) return Promise.resolve(cache.data);
    if (inflight) return inflight;
    inflight = api
        .get('/menu')
        .then(({ data }) => {
            cache = { data, at: Date.now() };
            return data;
        })
        .finally(() => {
            inflight = null;
        });
    return inflight;
}

/** Synchronous read, so a page can render instantly when the menu is already loaded. */
export const cachedMenu = () => (cache && Date.now() - cache.at < TTL ? cache.data : null);

/** Call after the admin changes the menu, so the next read is fresh. */
export const clearMenuCache = () => {
    cache = null;
};
