export const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const baseURL = import.meta.env.VITE_API_URL || '';
    // Ensure no double slashes
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${baseURL}${cleanPath}`;
};
