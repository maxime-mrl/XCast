import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createSelectors } from "@utils/createSelector";
import { useEffect } from "react";
import { useUserStore } from "./useUserStore";
import customStorage from "@utils/storage";

const mobileWidth = 750;
const resizeThrottle = 300;

type AppStore = {
    // settings panel
    isSettingsOpen: boolean,
    toggleSettings: () => void,

    // acounts panel
    isRegisterOpen: boolean,
    isLoginOpen: boolean,
    setIsRegisterOpen: (isOpen: boolean) => void,
    setIsLoginOpen: (isOpen: boolean) => void,

    // handling window size and ismobile
    width: number,
    height: number,
    isMobile: boolean,
    handleResize: () => void

    // store zoom level
    zoom: number,
    updateZoom: (zoom: number) => void,

    // sync preferences
    sync: boolean,
    toggleSync: () => void,

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
        sync: false,
        isRegisterOpen: false,
        isLoginOpen: false,
        
        setIsRegisterOpen: (isOpen) => {
            if (isOpen) get().setIsLoginOpen(false); // make sure both modals are not oppened at the same time
            set({ isRegisterOpen: isOpen })
        },
        setIsLoginOpen: (isOpen) => {
            if (isOpen) get().setIsRegisterOpen(false);
            set({ isLoginOpen: isOpen })
        },
        toggleSync: () => {
            // check if user is logged in (user store)
            // if not logged in, open register panel
            if (!useUserStore.getState().user) get().setIsRegisterOpen(true);
            // else toggle sync
            else set((prev) => ({ sync: !prev.sync }));
        },
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
            sync: state.sync
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
