import { useForecastStore } from "@store/useForecastStore";
import { useUserStore } from "@store/useUserStore";

import "./Loader.css";

// very basic loader
export default function Loader() {
  // get status
  const forecastStatus = useForecastStore.use.status();
  const userStatus = useUserStore.use.status();
  // if not loading return null
  if (forecastStatus !== "loading" || userStatus !== "loading") return null;

  return (
    <div className="loader">
      <div className="lds-ellipsis">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}
