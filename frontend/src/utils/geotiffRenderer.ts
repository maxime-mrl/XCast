import L, { LeafletGeotiffRendererOptions } from "leaflet";
import "leaflet-geotiff-2";
import chroma from "chroma-js";

const defaultScale = chroma.scale(["ffffff", "000000"]).domain([0, 100]);

interface CustomRendererOptions extends LeafletGeotiffRendererOptions {
  chromaScale?: chroma.Scale; // Optional color scale
  min?: number; // Optional color scale
  max?: number; // Optional color scale
}

/* ------------------ Custom renderer from leafleatgeotiff ------------------ */
const Renderer = L.LeafletGeotiffRenderer.extend({
  initialize: function (options: CustomRendererOptions) {
    // Call the base class’s initialize method
    L.setOptions(this, options);
    // user scales provided or default one
    this.scale = options?.chromaScale ?? defaultScale;
    this.min = options?.min ?? -100;
    this.max = options?.max ?? 100;
    this.range = this.max - this.min;
    // create a LUT for the color scale (aprox 10x faster rendering lol)
    this.LUT_SIZE = Math.max(this.range * 5, 256);
    this.lut = new Uint8ClampedArray(this.LUT_SIZE * 3);
    for (let i = 0; i < this.LUT_SIZE; i++) {
      // precompute the color for each value in the LUT
      const v = this.min + (i / (this.LUT_SIZE - 1)) * this.range;
      // set the color scale
      const color = this.scale(v).rgb();
      this.lut[i * 3] = color[0]; // Red
      this.lut[i * 3 + 1] = color[1]; // Green
      this.lut[i * 3 + 2] = color[2]; // Blue
    }
  },

  render: function (
    raster: { data: Uint32Array[]; width: number; height: number },
    _canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    args: any
  ) {
    const startTime = performance.now(); // perf logging (debug)
    const rasterImageData = ctx.createImageData(raster.width, raster.height);
    
    const { min, max, range, lut, LUT_SIZE } = this;
    const N1 = LUT_SIZE - 1;
    raster.data[0].forEach((value, i) => {
      if (value > min && value < max) {
        // get the position of the value in the LUT
        const idx = Math.round(((value - min) / range) * N1) * 3;
        // Set R, G, B And A
        rasterImageData.data[i * 4] = lut[idx]; // Red
        rasterImageData.data[i * 4 + 1] = lut[idx + 1]; // Green
        rasterImageData.data[i * 4 + 2] = lut[idx + 2]; // Blue
        rasterImageData.data[i * 4 + 3] = 150; // Alpha
      }
    });

    const imageData = this.parent.transform(rasterImageData, args);
    ctx.putImageData(imageData, args.xStart, args.yStart); // add image
    console.log(
      `Rendering took ${Math.round(performance.now() - startTime)} ms`
    );
  },
}) as typeof L.LeafletGeotiffRenderer;

export default Renderer;
