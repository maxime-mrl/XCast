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
    container: Element;
    drawfns: [((canvas:this, params?: any) => void), any][];
    xChart: chart;
    yChart: chart;

    constructor(parent:Element, xChart:chart, yChart:chart) {
        this.container = parent;
        this.drawfns = [];
        this.xChart = xChart;
        this.yChart = yChart;

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

    clear = () => {
        this.drawfns = [];
        this.canvas.remove();
        this.container.removeEventListener("resize", this.resize);
        window.removeEventListener("resize", this.resize);
        window.removeEventListener("orientationchange", this.resize);
    }

    // handle resizing of canvas
    resize = () => {
        this.size = {
            width: this.container.clientWidth,
            height: this.container.clientHeight
        };
        this.canvas.setAttribute("width", this.size.width.toString());
        this.canvas.setAttribute("height", this.size.height.toString());

        this.render();
    }

    // not sure that's a good idea we'll see if i keep it
    addRenderer = (f: (canvas:this, params?: any) => void, param?: any) => {
        f(this, param);
        this.drawfns.push([f, param]);
    }

    // clear what's existing and draw with new dimensions
    render = () => {
        this.ctx.clearRect(0, 0, this.size.width * 2, this.size.height * 2);
        this.drawfns.forEach(f => f[0](this, f[1]));
    }

    /* ----------------------------- utility method ----------------------------- */
    getCoord = (x: number, y: number, xChart:chart, yChart:chart) => {
        const { chartMargin: xMargin, min: xMin, max: xMax } = xChart;
        const { chartMargin: yMargin, min: yMin, max: yMax } = yChart;

        const xIncrement = (this.size.width - xMargin) / (xMax - xMin);
        const yIncrement = (this.size.height - yMargin) / (yMax - yMin);

        return {
            x: (x - xChart.min) * xIncrement + xChart.chartMargin,
            y: this.size.height - (y - yChart.min) * yIncrement - yChart.chartMargin, // invert to start from bottom
            xIncrement,
            yIncrement
        }
    }

    drawText = (x:number, y:number, text:string, options?: {
      font?: string;
      align?: CanvasTextAlign;
      baseline?: CanvasTextBaseline;
      color?: string;
      maxWidth?: number;
    }) => {
        const { font = "20px system-ui", align = "center", baseline = "middle", color = "black", maxWidth } = options || {};
        this.ctx.font = font;
        this.ctx.textBaseline = baseline;
        this.ctx.textAlign = align;
        this.ctx.fillStyle = color;
        this.ctx.fillText(text, x, y, maxWidth)

    }

    drawLine = (startX:number, startY: number, endX:number, endY: number) => {
        this.ctx.beginPath();
        this.ctx.moveTo(startX, startY);
        this.ctx.lineTo(endX, endY);
        this.ctx.stroke();
        this.ctx.closePath();
    }

    drawWindArrow = (x:number, y:number, size:number, wdir:number, wspd:number, colorScale?:Scale<Color>) => {
        // arrow size
        const thickness = size * Math.min(0.3,
            0.02 * Math.exp(0.075 * ((wspd) - 10)) + 0.1 // this seems to look good after testing
        );
        const length = size*0.9;
        const color = colorScale ? colorScale(wspd).hex() : "#00000";
        const lineThickness = thickness * 0.3;

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
    
    drawRectangle = (
        coords: { top?: number, bottom?: number, left?: number, right?: number },
        color:string,
        xChart:chart,
        yChart:chart
    ) => {
        const topLeft = this.getCoord(coords.left || xChart.min, coords.top || yChart.max, xChart, yChart);
        const bottomRight = this.getCoord(coords.right || xChart.max, coords.bottom || 0, xChart, yChart);
      
        this.ctx.fillStyle = color;
        this.ctx.fillRect(topLeft.x, topLeft.y, bottomRight.x - topLeft.x, bottomRight.y - topLeft.y);
    }
}

