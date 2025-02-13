import { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";

import { useForecastStore } from "@store/useForecastStore";
import { useUserStore } from "@store/useUserStore";

// get notifications from stores and display them
export default function Notifications() {
  const userStatus = useUserStore.use.status();
  const forecastStatus = useForecastStore.use.status();

  const userMessage = useUserStore.use.message();
  const forecastMessage = useForecastStore.use.message();

  const resetUser = useUserStore.use.logout();

  useEffect(() => {
    let message = "";
    let status = "error";
    // check who is sending the message
    if (userMessage && userStatus) {
      message = userMessage;
      status = userStatus;
      useUserStore.setState({ message: "", status: "" });
    } else if (forecastMessage && forecastStatus) {
      message = forecastMessage;
      status = forecastStatus;
    }
    // if message is not empty display it
    if (message.length > 0) {
      if (status !== "error") toast.success(message);
      else toast.error(message);
    }
    if (/token/.test(message)) resetUser(); // while we are here reset account state if token error
  }, [userStatus, userMessage, forecastStatus, forecastMessage, resetUser]);

  return <ToastContainer />; // necessary to toastify
}
