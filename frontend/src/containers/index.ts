import loadable from '@loadable/component';
const Map = loadable(() => import('./map/Map'));
const Settings = loadable(() => import('./settings/Settings'));
const Forecast = loadable(() => import('./forecast/Forecast'));
const TimeSelector = loadable(() => import('./timeSelector/TimeSelector'));

export {
    Map,
    Settings,
    Forecast,
    TimeSelector,
}
