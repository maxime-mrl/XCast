import loadable from '@loadable/component';
const GeotiffLayer = loadable(() => import('./geoTiffLayer/GeoTiffLayer'));

export {
    GeotiffLayer
}
