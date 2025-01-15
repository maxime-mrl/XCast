// adapted from hackernoon.com/optimizing-performance-with-throttling-in-javascript
export default function throttle (fn: () => void, time: number) {
    let timeout: null | NodeJS.Timeout = null;
    return () => {
        if (timeout) return;
        const later = () => {
            fn();
            timeout = null;
        }
        timeout = setTimeout(later, time);
    }
}