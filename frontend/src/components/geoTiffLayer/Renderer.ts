import L, { LeafletGeotiffRendererOptions } from "leaflet";
import "leaflet-geotiff-2";
import chroma from "chroma-js";

const defaultScale = chroma.scale(["ffffff", "000000"]).domain([0, 30]);

interface CustomRendererOptions extends LeafletGeotiffRendererOptions {
    chromaScale?: chroma.Scale; // Optional color scale
}

const Renderer = L.LeafletGeotiffRenderer.extend({
    initialize: function (options:CustomRendererOptions) {
        // Call the base class’s initialize method
        L.setOptions(this, options);
        this.scale = options && options.chromaScale ? options.chromaScale : defaultScale;
    },
    
    render: function (raster: {data: Uint32Array[], width: number, height: number}, _canvas:HTMLCanvasElement, ctx:CanvasRenderingContext2D, args:any) {
        const rasterImageData = ctx.createImageData(raster.width, raster.height);
  
        raster.data[0].forEach((value, i) => {
            // Set R, G, B And Alpha
            rasterImageData.data[i * 4] = this.scale(value).rgba()[0];       // Red
            rasterImageData.data[i * 4 + 1] = this.scale(value).rgba()[1];   // Green
            rasterImageData.data[i * 4 + 2] = this.scale(value).rgba()[2];   // Blue
            rasterImageData.data[i * 4 + 3] = value < 0 ? 0 : 150;     // Alpha
        })
  
        const imageData = this.parent.transform(rasterImageData, args);
        ctx.putImageData(imageData, args.xStart, args.yStart); // debug output
      }
    
}) as any;

export default Renderer;
