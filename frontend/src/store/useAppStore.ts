import { create } from "zustand";
import { createSelectors } from "./createSelector";
import { useEffect } from "react";

const mobileWidth = 750;
const resizeThrottle = 300;

type AppStore = {
    // settings panel
    isSettingsOpen: boolean,
    toggleSettings: () => void,

    // handling window size and ismobile
    width: number,
    height: number,
    isMobile: boolean,
    handleResize: () => void

    // handling of custom forecast width
    forecastWidth: number,
    updateForecastWidth: (event: MouseEvent, container:HTMLElement) => void
};

export const useAppStore = createSelectors(create<AppStore>()((set) => {
    function throttle(fn: () => void, time: number) {
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

    return {
        isSettingsOpen: false,
        width: 0,
        height: 0,
        isMobile: true,
        forecastWidth: 0.5,
        
        toggleSettings: () => set((prev) => ({ isSettingsOpen: !prev.isSettingsOpen })),
        handleResize: throttle(() => {
            set(() => ({
                width: window.innerWidth,
                height: window.innerHeight,
                isMobile: window.innerWidth < mobileWidth
            }));
        }, resizeThrottle),
        updateForecastWidth: (e, elem) => {
            const widthRatio = e.clientX / window.innerWidth;
            console.log(widthRatio)
            elem.style.width = `${widthRatio*100}%`;
            set({ forecastWidth: widthRatio })
        }
    };
}));

// Initialize the resize listener
export function useWindowSizeInitializer() {
    const handleResize = useAppStore.use.handleResize();

    useEffect(() => {
        handleResize(); // Set initial size
        window.addEventListener("resize", handleResize);
        window.addEventListener("orientationchange",  handleResize);
        return () => {
            window.removeEventListener("resize",  handleResize);
            window.removeEventListener("orientationchange",  handleResize);
        };
    }, [handleResize]);
};
