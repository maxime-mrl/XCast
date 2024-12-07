import loadable from '@loadable/component';
const GeotiffLayer = loadable(() => import('./geoTiffLayer/GeoTiffLayer'));
const TimeSelector = loadable(() => import('./timeSelector/TimeSelector'));
const Sounding = loadable(() => import('./sounding/Sounding'));
const Meteogram = loadable(() => import('./meteogram/Meteogram'));

export {
    GeotiffLayer,
    TimeSelector,
    Sounding,
    Meteogram
}
