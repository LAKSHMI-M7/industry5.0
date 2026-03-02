/**
 * Utility to format image URLs from the backend.
 * Prefixes relative paths with the Backend API URL if necessary.
 */
export const getImageUrl = (path) => {
    if (!path) return null;

    // If it's already a full URL, return as is
    if (path.startsWith('http')) return path;

    // Check if it's a profile photo path
    if (path.startsWith('/uploads/profiles/') || path.startsWith('/avatars/')) {
        const fileName = path.split('/').pop();
        // Since we moved everything to public/assets, we can access them via /assets/filename
        return `/assets/${fileName}`;
    }

    // Get the base URL from env
    const baseUrl = import.meta.env.VITE_API_URL || '';

    // Ensure the path starts with a slash
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;

    return `${baseUrl}${normalizedPath}`;
};
