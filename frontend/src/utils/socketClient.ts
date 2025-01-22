import { io } from "socket.io-client";
import { useUserStore } from "@store/useUserStore";
import { useForecastStore } from "@store/useForecastStore";
import { dbUserSettings } from "types/customTypes";
import { mergeUnits, useUnitStore } from "@store/useUnitsStore";

// const socket = io(process.env.REACT_APP_API_URL);
const socket = io(`http://${window.location.hostname}`); // for local dev

// removed check if arleady connected: doesn't cause any problem to send multiple register
// and so we make sure that the user is connected
// also we don't need to reset the isConnect state on disconnect

// connect user to backend
export function registerSocket(userState?: object) {
  const { user } = useUserStore.getState() || userState;
  socket.emit("register", user);
}

// listen for sync from backend
socket.on("sync", (data: Partial<dbUserSettings>) => {
  if (data.forecastSettings) {
    const { position, ...syncSettings } = data.forecastSettings || {
      position: undefined,
      otherDbSetting: {},
    };
    useForecastStore.setState((prev) => ({
      ...prev,
      position,
      userSettings: { ...prev.userSettings, ...syncSettings },
    }));
  }
  if (data.units) useUnitStore.setState((prev) => mergeUnits(prev, data.units));
});
