import loadable from '@loadable/component';
const Map = loadable(() => import('./map/Map.tsx'));
const Settings = loadable(() => import('./settings/Settings.tsx'));
const Forecast = loadable(() => import('./forecast/Forecast.tsx'));

export {
    Map,
    Settings,
    Forecast
}
