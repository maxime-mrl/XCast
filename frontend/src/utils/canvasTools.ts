export default class Canvas {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D | null;
    size: {
        width: number,
        height: number
    }
    container: Element;

    constructor(parent:Element) {
        this.container = parent;
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

        // always update once the size
        this.size = { width: 0, height: 0 }
        this.resize();
    }

    resize = () => {
        this.size = {
            width: this.container.clientWidth,
            height: this.container.clientHeight,
        }
        this.canvas.setAttribute("width", this.size.width.toString());
        this.canvas.setAttribute("height", this.size.height.toString());

        // this.ctx?.fillStyle = "red"
        this.ctx?.fillRect(this.size.width - 100, 100, 100, 100)
        console.log(this.size);
    }
}

