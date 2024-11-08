import "leaflet";

declare module "leaflet" {
  class LeafletGeotiff extends Layer {
    constructor(url: string, options?: LeafletGeotiffOptions);
    
    // Static renderer methods
    static plotty(options: PlottyOptions): LeafletGeotiffRenderer;
    static vectorArrows(options: VectorArrowsOptions): LeafletGeotiffRenderer;
    static rgb(options: RGBOptions): LeafletGeotiffRenderer;

    getMinMax(): {min: null | number, max: null | number};
    getBounds(): LatLng;
    getValueAtLatLng(lat: number, lon: number): number;
  }

  // Base renderer class that other renderers extend
  class LeafletGeotiffRenderer extends L.Class {
    constructor(options?: LeafletGeotiffRendererOptions);
    
    setParent(parent: LeafletGeotiff): void;
    
    render(raster: {data: Uint32Array[], width: number, height: number}, canvas:HTMLCanvasElement, ctx:CanvasRenderingContext2D, args:any): void;
  }


  interface LeafletGeotiffOptions extends GridLayerOptions {
    renderer: LeafletGeotiffRenderer;
    useWorker?: boolean;
    bounds?: [LatLng, LatLng];
    band?: number;
    image?: number;
    clip?: LatLng[];
    pane?: any; // din't understand what is this / i dont need it
    onError?: CallableFunction;
    sourceFunction?: GeoTIFF.fromArrayBuffer | GeoTIFF.fromUrl | GeoTIFF.fromBlob;
    arrayBuffer?: ArrayBuffer;
    noDataValue?: number; 
    noDataKey?: any; // also not sure 
    blockSize?: number;
    opacity?: number;
    clearBeforeMove?: boolean;

    colorScale?: string;
  }

  interface LeafletGeotiffRendererOptions {
    displayMin?: number;
    displayMax?: number;
    colorScale?: string;
    noDataValue?: number;
  }

  interface PlottyOptions {
    displayMin?: number;
    displayMax?: number;
    applyDisplayRange?: boolean;
    clampLow?: boolean;
    clampHigh?: boolean;
    colorScale?: string;
  }

  interface VectorArrowsOptions {
    arrowSize?: number;
  }

  interface RGBOptions {
    rBand?: number,
    gBand?: number,
    bBand?: number,
    alphaBand?: number,
    transpValue?: number,
    renderer: any, // wtf?
  }
}
