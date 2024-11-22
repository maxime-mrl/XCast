export default class Canvas {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D | null;
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
        this.ctx = this.canvas.getContext("2d");

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
        this.ctx?.clearRect(0, 0, this.size.width * 2, this.size.height * 2);
        this.drawfns.forEach(f => f[0](this, f[1]));
    }
}

