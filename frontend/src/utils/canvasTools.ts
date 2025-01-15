import { Color, Scale } from "chroma-js";
import throttle from "./throttle";

export type chart = {
    min: number,
    max: number,
    displayed: number[],
    chartMargin: number,
    minWidth?: number
};

export const generateYchart = ({ min, max, increments, margin=40 }: {
    min: number,
    max: number,
    increments: number[],
    margin?: number,
}) => {
    return {
        min: min,
        max: max + 125,
        displayed: [min, ...increments.filter(increment => increment >= min && increment <= max)],
        chartMargin: margin,
    } as chart;
}

/* -------------------------------------------------------------------------- */
/*                  Canvas utility for sounding and meteogram                 */
/* -------------------------------------------------------------------------- */
export default class Canvas {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    size: {
        width: number,
        height: number
    };
    container: HTMLElement;
    drawfns: [((canvas:this, params?: any) => void), any][];
    xChart: chart;
    yChart: chart;
    resizeObserver: ResizeObserver;

    constructor(parent:HTMLElement, xChart:chart, yChart:chart) {
        this.container = parent;
        this.drawfns = [];
        this.xChart = xChart;
        this.yChart = yChart;

        /* ------------------------ Create or retrieve canvas ----------------------- */
        if (parent.querySelector("canvas")) { // if canvas arleady exist just link back to it
            this.canvas = parent.querySelector("canvas") as HTMLCanvasElement;
        } else { // no canvas => create one
            this.canvas = document.createElement("canvas");
            parent.appendChild(this.canvas);
        }
        
        // create context
        this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;

        // listen for resize
        this.resizeObserver = new ResizeObserver(throttle(this.resize, 1000));
        this.resizeObserver.observe(this.canvas)
        this.resizeObserver.observe(this.container)

        // init the size
        this.size = { width: 0, height: 0 };
        this.resize();
    }


    /* --------------- handle resizing of canvas to fill container -------------- */
    private resize = () => {
        this.size = {
            width: Math.max(this.container.clientWidth, this.xChart.minWidth || 0), // allow scroll if not enough space
            height: this.container.clientHeight
        };
        this.canvas.style.width = this.size.width > this.container.clientWidth ?  `${this.size.width}px` : "100%";
        this.canvas.setAttribute("width", this.size.width.toString());
        this.canvas.setAttribute("height", this.size.height.toString());

        this.render();
    }

    /* ---------------------- render / rerender everything ---------------------- */
    private render = () => {
        // clear canvas
        this.ctx.clearRect(0, 0, this.size.width * 2, this.size.height * 2);
        // call every custom renderer
        this.drawfns.forEach(f => f[0](this, f[1]));
    }

    /* --- Clear everything class as made (canvas, AudioListener, Renderer...) -- */
    clear = () => {
        this.drawfns = [];
        this.resizeObserver.disconnect();
        this.canvas.remove();
    }

    /* --------------------- Add a custom renderer function --------------------- */
    addRenderer = (f: (canvas:Canvas, params?: any) => void, param?: any) => {
        f(this, param);
        this.drawfns.push([f, param]);
    }

    /* -------------------------------------------------------------------------- */
    /*                               UTILITY METHODS                              */
    /* -------------------------------------------------------------------------- */

    /* ------------ get pixel coordinate depending on the chart used ------------ */
    getCoord = (x: number, y: number) => {
        const { chartMargin: xMargin, min: xMin, max: xMax } = this.xChart;
        const { chartMargin: yMargin, min: yMin, max: yMax } = this.yChart;
        // increment is how much pixel we have to work with / chart range
        const xIncrement = (this.size.width - xMargin) / (xMax - xMin);
        const yIncrement = (this.size.height - yMargin) / (yMax - yMin);

        return {
            x: this.xChart.chartMargin + (x - this.xChart.min) * xIncrement, // start after margin multiply number by increment to get pixels
            y: this.size.height - (y - this.yChart.min) * yIncrement - this.yChart.chartMargin, // invert to start from bottom
            xIncrement,
            yIncrement
        }
    }

    /* ------------------- draw a line from a point to another ------------------ */
    drawLine = (startX:number, startY: number, endX:number, endY: number, options?: {
        width?: number,
        color?: string,
    }) => {
        const { width = 1, color = "black" } = options || {};
        // get points in pixels
        const start = this.getCoord(startX, startY);
        const end = this.getCoord(endX, endY);
        // draw the line
        this.ctx.beginPath();
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = width;
        this.ctx.moveTo(start.x, start.y);
        this.ctx.lineTo(end.x, end.y);
        this.ctx.stroke();
        this.ctx.closePath();
    }

    /* ---------------- draw a rectangle from a point to another ---------------- */
    drawRectangle = (
        coords: { top?: number, bottom?: number, left?: number, right?: number },
        color:string,
    ) => {
        // get points in pixels
        const topLeft = this.getCoord(coords.left || this.xChart.min, coords.top || this.yChart.max);
        const bottomRight = this.getCoord(coords.right || this.xChart.max, coords.bottom || this.yChart.min);
        // draw rectangle with custom color
        this.ctx.fillStyle = color;
        this.ctx.fillRect(topLeft.x, topLeft.y, bottomRight.x - topLeft.x, bottomRight.y - topLeft.y);
    }

    /* ------------------ draw text from custom point IN PIXEL ------------------ */
    // pixels by default because text can often be outside of chart range so it's way easier to get the exact point before
    // to get point coords options.pointCoordinates = true
    drawText = (x:number, y:number, text:string, options?: {
        pointCoordinates?: boolean
        font?: string;
        align?: CanvasTextAlign;
        baseline?: CanvasTextBaseline;
        color?: string;
        maxWidth?: number;
    }) => {
        // get coords optionnaly
        const coords = options?.pointCoordinates ? this.getCoord(x, y) : { x, y };
        // customize text
        const { font = "20px system-ui", align = "center", baseline = "middle", color = "black", maxWidth } = options || {};
        this.ctx.font = font;
        this.ctx.textBaseline = baseline;
        this.ctx.textAlign = align;
        this.ctx.fillStyle = color;
        // draw
        this.ctx.fillText(text, coords.x, coords.y, maxWidth);
    }

    /* ----- draw wind arrow with varying scale and color depeding on speed ----- */
    drawWindArrow = (pointX:number, pointY:number, size:number, wdir:number, wspd:number, options: {
        colorScale?:Scale<Color>,
        center?: boolean
    }) => {
        // arrow size and color
        // const thickness = size * Math.min(0.4,
        //     0.03 * Math.exp(0.2 * wspd) // this seems to look good after testing
        // );
        const thickness = size * Math.min(0.4, 0.016 * wspd + 0.05); // in the end linear may be better
        const length = size*0.9;
        const color = options.colorScale ? options.colorScale(wspd).hex() : "#00000";
        const lineThickness = thickness * 0.3;

        // get coords
        let { x, y } = this.getCoord(pointX, pointY);
        if (options.center) {
            x -= size/2;
            y -= size/2;
        }

        // save ctx
        this.ctx.save();
        this.ctx.beginPath();

        // translate and rotate
        // rotate from center
        this.ctx.translate(x + size * 0.5, y + size * 0.5);
        this.ctx.rotate((wdir * Math.PI) / 180);
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
        this.ctx.lineWidth = lineThickness;
        this.ctx.stroke();
        this.ctx.fill();

        // restore canvas to its original state
        this.ctx.closePath();
        this.ctx.restore();
    }
}

