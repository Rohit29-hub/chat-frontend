export const formatLastSeen = (date: string | Date): string => {
    const lastSeenDate = new Date(date);
    const now = new Date();
    const diff = now.getTime() - lastSeenDate.getTime();
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
    return lastSeenDate.toLocaleDateString();
};