import { io } from "socket.io-client";
import { useUserStore } from "@store/useUserStore";
import { useForecastStore } from "@store/useForecastStore";
import { dbUserSettings } from "types/customTypes";
import { mergeUnits, useUnitStore } from "@store/useUnitsStore";

const socket = io(process.env.REACT_APP_API_URL);
let socketRegistered = false;

export function registerSocket(userState?: object) {
    const { user } = useUserStore.getState() || userState;
    console.log("registering socket for", user);
    if (!socketRegistered && user) {
        socket.emit("register", user);
        socketRegistered = true;
    }
}

socket.on('sync', (data:Partial<dbUserSettings>) => {
    console.log(data);
    if (data.forecastSettings) {
        const { position, ...syncSettings } = data.forecastSettings || { position: undefined, otherDbSetting: { } };
        useForecastStore.setState((prev) => ({
            ...prev, position,
            userSettings: { ...prev.userSettings, ...syncSettings }
        }));
    }
    if (data.units) {
        console.log(useUnitStore.getState());
        useUnitStore.setState((prev) => mergeUnits(prev, data.units));
    }
});
