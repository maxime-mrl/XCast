import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createSelectors } from "@utils/createSelector";
import { useEffect } from "react";
import { customStorage } from "@utils/storage";

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

    // store zoom level
    zoom: number,
    updateZoom: (zoom: number) => void,


    // handling of custom forecast width
    forecastWidth: number,
    updateForecastWidth: (event: MouseEvent) => void
};

export const useAppStore = createSelectors(create<AppStore>()(
    persist((set, get) => ({
        isSettingsOpen: false,
        width: 0,
        height: 0,
        isMobile: true,
        forecastWidth: 0.5,
        zoom: 7,
        updateZoom: (zoom) => set({ zoom }),
        toggleSettings: () => set((prev) => ({ isSettingsOpen: !prev.isSettingsOpen })),
        handleResize: throttle(() => {
            set(() => ({
                width: window.innerWidth,
                height: window.innerHeight,
                isMobile: window.innerWidth < mobileWidth
            }));
        }, resizeThrottle),
        updateForecastWidth: (e) => {
            set({ forecastWidth: e.clientX / get().width });
        }
    }), {
        name: "app-settings",
        partialize: (state) => ({
            // always only persisted (no need to sync since it's dependent on window size so device)
            forecastWidth: state.forecastWidth,
            zoom: state.zoom,
        }),
        storage: customStorage,
    })
));

// throttle to a certain timeoiut any function
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
