/**
 * Utility to format image URLs from the backend.
 * Prefixes relative paths with the Backend API URL if necessary.
 */
export const getImageUrl = (path) => {
    if (!path) return null;
    
    // If it's already a full URL, return as is
    if (path.startsWith('http')) return path;
    
    // Get the base URL from env
    const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
    
    // Ensure the path starts with a slash
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    
    return `${baseUrl}${normalizedPath}`;
};
