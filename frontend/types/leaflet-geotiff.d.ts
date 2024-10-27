import "leaflet";

declare module "leaflet" {
  class LeafletGeotiff extends Layer {
    constructor(url: string, options?: LeafletGeotiffOptions);
    
    // Static renderer methods
    static plotty(options: PlottyOptions): LeafletGeotiffRenderer;
    static vectorArrows(options: VectorArrowsOptions): LeafletGeotiffRenderer;
  }

  interface LeafletGeotiffOptions extends GridLayerOptions {
    band?: number;
    renderer?: LeafletGeotiffRenderer;
    clampLow?: boolean;
    clampHigh?: boolean;
    noDataValue?: number;
    name?: string;
    colorScale?: string;
  }

  interface PlottyOptions {
    colorScale?: string;
    displayMin?: number;
    displayMax?: number;
  }

  interface VectorArrowsOptions {
    arrowSize?: number;
    color?: string;
  }

  interface LeafletGeotiffRenderer {}
}
