import loadable from '@loadable/component';
const GeotiffLayer = loadable(() => import('./geoTiffLayer/GeoTiffLayer'));
const TimeSelector = loadable(() => import('./timeSelector/TimeSelector'));
const Sounding = loadable(() => import('./sounding/Sounding'));
const Meteogram = loadable(() => import('./meteogram/Meteogram'));
const StepSlider = loadable(() => import('./StepSlider/StepSlider'));

export {
    GeotiffLayer,
    TimeSelector,
    Sounding,
    Meteogram,
    StepSlider
}
