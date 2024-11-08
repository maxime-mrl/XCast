import loadable from '@loadable/component';
const GeotiffLayer = loadable(() => import('./geoTiffLayer/GeoTiffLayer'));
const TimeSelector = loadable(() => import('./timeSelector/TimeSelector'));

export {
    GeotiffLayer,
    TimeSelector
}
