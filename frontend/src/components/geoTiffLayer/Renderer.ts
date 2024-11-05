import L, { LeafletGeotiffRendererOptions } from "leaflet";
import "leaflet-geotiff-2";
import chroma from "chroma-js";
import { windUnits } from "./units";

const windScale = chroma.scale(windUnits.colorScale[0]).domain(windUnits.colorScale[1])

// Define your custom renderer by extending L.LeafletGeotiffRenderer
const Renderer = L.LeafletGeotiffRenderer.extend({
    initialize: function (options:LeafletGeotiffRendererOptions) {
        // Call the base class’s initialize method
        L.setOptions(this, options);
    },
    
    render: function (raster: {data: Uint32Array[], width: number, height: number}, canvas:HTMLCanvasElement, ctx:CanvasRenderingContext2D, args:any) {
        const rasterImageData = ctx.createImageData(raster.width, raster.height);
  
        raster.data[0].forEach((value, i) => {
            // Grayscale: Set R, G, and B to the same intensity
            rasterImageData.data[i * 4] = windScale(value).rgb()[0];       // Red
            rasterImageData.data[i * 4 + 1] = windScale(value).rgb()[1];   // Green
            rasterImageData.data[i * 4 + 2] = windScale(value).rgb()[2];   // Blue
            rasterImageData.data[i * 4 + 3] = value < 0 ? 0 : 255;     // Alpha
        })
  
        const imageData = this.parent.transform(rasterImageData, args);
        ctx.putImageData(imageData, args.xStart, args.yStart); // debug output
      }
    
});

export default Renderer;
