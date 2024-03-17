let cache = new Map();

export const updateCache = (key: string, value: {}) => {
    cache.set(key, value);
}

export const getLocationFromCache = (key: string) => {
    return cache.get(key);
}
