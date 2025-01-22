import loadable from "@loadable/component";
const Map = loadable(() => import("./map/Map"));
const Settings = loadable(() => import("./settings/Settings"));
const Forecast = loadable(() => import("./forecast/Forecast"));
const Register = loadable(() => import("./register/Register"));
const Login = loadable(() => import("./login/Login"));

export { Map, Settings, Forecast, Register, Login };
