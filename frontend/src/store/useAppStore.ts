import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createSelectors } from "@utils/createSelector";
import { useEffect } from "react";
import throttle from "@utils/throttle";

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
        updateForecastWidth: (e) => set({ forecastWidth: e.clientX / get().width }),
        handleResize: throttle(() => {
            set(() => ({
                width: window.innerWidth,
                height: window.innerHeight,
                isMobile: window.innerWidth < mobileWidth
            }));
        }, resizeThrottle),
    }), {
        name: "app-settings",
        partialize: (state) => ({
            // app is only local (sync between devices would be weird since it's dependant of screen size)
            forecastWidth: state.forecastWidth,
            zoom: state.zoom,
        }),
    })
));

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
