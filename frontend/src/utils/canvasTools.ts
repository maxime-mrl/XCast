import { Color, Scale } from "chroma-js";

export type chart = {
    min: number,
    max: number,
    displayed: number[],
    chartMargin: number
}

export default class Canvas {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    size: {
        width: number,
        height: number
    };
    unit: {
        xMax: number,
        xMin: number,
        yMax: number,
        yMin: number
    } | null;
    container: Element;
    drawfns: [((canvas:this, params?: any) => void), any][];

    constructor(parent:Element) {
        this.container = parent;
        this.drawfns = [];
        this.unit = null;
        if (parent.querySelector("canvas")) { // if canvas arleady exist just link back to it
            this.canvas = parent.querySelector("canvas") as HTMLCanvasElement;
        } else { // no canvas => create one and listen for resize
            this.canvas = document.createElement("canvas");
            parent.appendChild(this.canvas);
            parent.addEventListener("resize", this.resize);
            window.addEventListener("resize", this.resize);
            window.addEventListener("orientationchange", this.resize);
        }
        this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;

        // init the size
        this.size = { width: 0, height: 0 };
        this.resize();
    }

    // handle resizing of canvas
    resize = () => {
        this.size = {
            width: this.container.clientWidth,
            height: this.container.clientHeight,
        };
        this.canvas.setAttribute("width", this.size.width.toString());
        this.canvas.setAttribute("height", this.size.height.toString());

        this.render();
    }

    // not sure that's a good idea we'll see if i keep it
    addRenderer = (f: (canvas:this, params?: any) => void, params?: any) => {
        f(this, params);
        this.drawfns.push([f, params]);
    }

    // clear what's existing and draw with new dimensions
    render = () => {
        this.ctx.clearRect(0, 0, this.size.width * 2, this.size.height * 2);
        this.drawfns.forEach(f => f[0](this, f[1]));
    }

    /* ----------------------------- utility method ----------------------------- */
    getCoord = (x: number, y: number, xChart:chart, yChart:chart) => {
        const xIncrement = (this.size.width - xChart.chartMargin) / (xChart.max - xChart.min);
        const yIncrement = (this.size.height - yChart.chartMargin) / (yChart.max - yChart.min);
        return {
            x: (x - xChart.min) * xIncrement + xChart.chartMargin,
            y: this.size.height - (y - yChart.min) * yIncrement - yChart.chartMargin, // invert to start from bottom
        }
    }

    drawWindArrow = (x:number, y:number, size:number, wdir:number, wspd:number, colorScale?:Scale<Color>) => {
        // arrow size
        const thickness = size * Math.min(0.3,
            0.02 * Math.exp(0.075 * (wspd - 10)) + 0.13 // this seems to look good after testing
        );
        const length = size*0.9;
        const color = colorScale ? colorScale(wspd).hex() : "#00000";

        // save ctx
        this.ctx.save();
        this.ctx.beginPath();

        // translate and rotate
        // rotate from center
        this.ctx.translate(x + size * 0.5, y + size * 0.5);
        this.ctx.rotate(wdir * Math.PI / 180);
        // translate back to top left of arrow body
        this.ctx.translate(-thickness*0.5, -length*0.5);
        // just to flex that i can still math it was -(x + size * 0.5) then x + (size - thickness)/2

        // draw arrow
        this.ctx.roundRect(0, 0, thickness, length, [size]); // arrow body
        this.ctx.translate(0, thickness*0.25); // make arrow tips start with arrow
        this.ctx.rotate(45 * Math.PI / 180); // left part
        this.ctx.roundRect(0, -thickness*0.75, thickness*0.75, length/2 + thickness*0.75, [size]);
        this.ctx.rotate(-90 * Math.PI / 180); // right part
        this.ctx.roundRect(0, 0, thickness*0.75, length/2 + thickness*0.75, [size]);
        // fill
        this.ctx.fillStyle = color;
        this.ctx.fill();

        // restore canvas to its original state
        this.ctx.closePath();
        this.ctx.restore();
    }
}

