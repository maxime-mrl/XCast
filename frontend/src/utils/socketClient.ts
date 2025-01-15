import { io } from "socket.io-client";
import { useUserStore } from "@store/useUserStore";
import { useForecastStore } from "@store/useForecastStore";
import { dbUserSettings } from "types/customTypes";
import { mergeUnits, useUnitStore } from "@store/useUnitsStore";

const socket = io(process.env.REACT_APP_API_URL);
let socketRegistered = false;

// connect user to backend
export function registerSocket(userState?: object) {
    const { user } = useUserStore.getState() || userState;
    if (!socketRegistered && user) {
        socket.emit("register", user);
        socketRegistered = true;
    }
}

// reset socket if disconnected
socket.on("disconnect", () => socketRegistered = false);

// listen for sync from backend
socket.on('sync', (data:Partial<dbUserSettings>) => {
    if (data.forecastSettings) {
        const { position, ...syncSettings } = data.forecastSettings || { position: undefined, otherDbSetting: { } };
        useForecastStore.setState((prev) => ({
            ...prev, position,
            userSettings: { ...prev.userSettings, ...syncSettings }
        }));
    }
    if (data.units) useUnitStore.setState((prev) => mergeUnits(prev, data.units));
});
