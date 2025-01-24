import loadable from "@loadable/component";
const GeotiffLayer = loadable(() => import("./geoTiffLayer/GeoTiffLayer"));
const TimeSelector = loadable(() => import("./timeSelector/TimeSelector"));
const Sounding = loadable(() => import("./sounding/Sounding"));
const Meteogram = loadable(() => import("./meteogram/Meteogram"));
const StepSlider = loadable(() => import("./StepSlider/StepSlider"));
const Loader = loadable(() => import("./loader/Loader"));
const Notifications = loadable(() => import("./notifications/Notifications"));
const ModalContainer = loadable(() => import("./modalContainer/ModalContainer"));
const TextInput = loadable(() => import("./textInput/TextInput"));

export {
  GeotiffLayer,
  TimeSelector,
  Sounding,
  Meteogram,
  StepSlider,
  Loader,
  Notifications,
  ModalContainer,
  TextInput,
};
