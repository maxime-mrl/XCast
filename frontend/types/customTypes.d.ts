import { LatLng } from "leaflet";

declare type mapDataTypes = "wind" | "temp";

declare type dbUserSettings = {
  forecastSettings?: {
    model?: string;
    selected?: mapDataTypes;
    level?: number;
    maxHeight?: number;
    position?: LatLng | false;
  };
  units: Record<string, { selected: string }>;
};
