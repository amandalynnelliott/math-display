/*
To Do
- asymptotes
- zoom math function
--- zoom grid numbering change & affecting grid size
------ every 5th line darkens on unit = 20
------ every 10th line darkens on unir = 12
*/

class Vector {
    i: number;
    j: number;

    constructor(i: number, j: number) {
        this.i = i;
        this.j = j;
    }

    copy(): Vector {
        return new Vector(this.i, this.j);
    }

    magnitude(): number {
        return Math.sqrt(Math.pow(this.i, 2) + Math.pow(this.j, 2));
    }

    normalized(): Vector {
        return this.divide(this.magnitude());
    }

    // angle(): number {
    //     return arctan(this.j / this.i);
    // }

    add(vector: Vector): Vector {
        const result = this.copy();
        result.i += vector.i;
        result.j += vector.j;
        return result;
    }

    subtract(vector: Vector): Vector {
        const result = this.copy();
        result.i -= vector.i;
        result.j -= vector.j;
        return result;
    }

    divide(scalar: number): Vector {
        const result = this.copy();
        result.i /= scalar;
        result.j /= scalar;
        return result;
    }

    multiply(scalar: number): Vector {
        const result = this.copy();
        result.i *= scalar;
        result.j *= scalar;
        return result;
    }

    perpendicular(): Vector {
        return new Vector(-this.j, this.i);
    }

    // transform(matrix: Matrix) {
    //     return ;
    // }

    toString(): string {
        return `(${this.i}, ${this.j})`;
    }
}

window.onload = function () {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const ctx: CanvasRenderingContext2D = canvas.getContext("2d");
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    let scale = 50; // Changes when zoom

    let offsetX = 0;
    let offsetY = 0;

    ctx.font = "14px Roboto";
    const bgColor = "#222";
    const fontColor = "#EBEBEB";
    const axisColor = "#90DCB5";
    const gridColor = "#6BBCAC";


    function drawScreen() {
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, width, height);

        const pixelOrigin = {
            x: width / 2 - offsetX,
            y: height / 2 - offsetY
        };

        // this is wrong
        // const cartesianOrigin = {
        //     x: (width / unit) / 2 - (offsetX / unit),
        //     y: (height / unit) / 2 - (offsetY / unit)
        // };

        function drawHorizontalAxis() {
            ctx.beginPath();
            ctx.moveTo(0, pixelOrigin.y);
            ctx.lineTo(width, pixelOrigin.y);
            ctx.strokeStyle = axisColor;
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        function drawVerticalAxis() {
            ctx.beginPath();
            ctx.moveTo(pixelOrigin.x, 0);
            ctx.lineTo(pixelOrigin.x, height);
            ctx.strokeStyle = axisColor;
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        function drawGrid() {
            ctx.strokeStyle = gridColor;
            ctx.fillStyle = fontColor;

            const leftEdge = Math.floor(-(width / 2 - offsetX) / scale);
            const rightEdge = Math.ceil((width / 2 + offsetX) / scale);
            for (let x = leftEdge; x <= rightEdge; x++) {
                const px = pixelOrigin.x + scale * x;

                ctx.beginPath();
                ctx.moveTo(px, 0);
                ctx.lineTo(px, height);
                ctx.lineWidth = 0.25;
                ctx.stroke();

                // TODO: scale based on unit
                if (x !== 0 && x % 5 === 0) {
                    ctx.fillText(x.toString(), px, pixelOrigin.y);
                }
            }

            const topEdge = Math.floor(-(height / 2 - offsetY) / scale);
            const bottomEdge = Math.ceil((height / 2 + offsetY) / scale);
            for (let y = topEdge; y <= bottomEdge; y++) {
                const py = pixelOrigin.y + scale * y;

                ctx.beginPath();
                ctx.moveTo(0, py);
                ctx.lineTo(width, py);
                ctx.lineWidth = 0.25;
                ctx.stroke();

                // TODO: scale based on unit
                if (y !== 0 && y % 5 === 0) {
                    ctx.fillText((-y).toString(), pixelOrigin.x, py);
                }
            }
        }

        function drawFunction(mathFunction, color) {
            let previousX: number = undefined;
            let previousY: number = undefined;

            // let lineExists = 0;
            // for (let px = 0; px < width; px++) {
            //     const x = ((px + offsetX) / scale) - ((width / scale) / 2);
            //     const y = mathFunction(x);
            //     const py = pixelOrigin.y + scale * y;

            //     if (py >= (-height) && py <= height * 2) {
            //         if (lineExists > 1) {
            //             ctx.beginPath();
            //         }
            //         if (previousY !== undefined && ((previousY > 0 && y < 0) || (previousY < 0 && y > 0))) {
            //             ctx.moveTo(px, py);
            //         } else {
            //             ctx.lineTo(px, py);
            //         }
            //         lineExists = 0;
            //         previousY = undefined;
            //     } else if (lineExists <= 1) {
            //         ctx.lineTo(px, py);
            //         previousY = y;
            //         ctx.strokeStyle = color;
            //         ctx.lineWidth = 2;
            //         ctx.stroke();
            //         ctx.strokeStyle = "#000";
            //         ctx.lineWidth = 1;
            //         lineExists++;
            //     }
            // }

            ctx.beginPath();
            for (let px = 0; px < width; px += (1 / scale)) {
                for (let subX = 0; subX < 1 / scale; subX += (1 / scale) / 10) {
                    const x = (((px + subX) + offsetX) / scale) - ((width / scale) / 2);
                    const y = -mathFunction(x);
                    const py = pixelOrigin.y + scale * y;

                    if (previousY !== undefined) {
                        if (py < 0 || py >= height) {
                            if (previousY >= 0 && previousY < height) {
                                ctx.lineTo(px + subX, py);
                            }
                        } else {
                            if (previousY < 0 || previousY >= height) {
                                ctx.moveTo(previousX, previousY);
                            }
                            if (subX === 0) {
                                if (py >= 0 && py < height) {
                                    if (Math.abs(previousY - py) > (height)) {
                                        ctx.moveTo(px, py);
                                    } else {
                                        ctx.lineTo(px, py);
                                    }
                                }
                            }
                        }
                    } else {
                        if (subX === 0) {
                            ctx.moveTo(px, py);
                        }
                    }
                    previousY = py;
                    previousX = px + subX;
                }
            }
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.strokeStyle = "#000";
            ctx.lineWidth = 1;
        }

        function drawVector(vector: Vector, color: string) {
            const px = pixelOrigin.x + scale * vector.i;
            const py = pixelOrigin.y + scale * -vector.j;

            const a = vector.normalized().divide(2);
            const c = vector.subtract(a);
            const b = vector.perpendicular().normalized().divide(4);
            const d = c.add(b);
            const e = c.subtract(b);

            ctx.strokeStyle = color;
            ctx.lineWidth = 2;

            ctx.beginPath();
            ctx.moveTo(pixelOrigin.x, pixelOrigin.y);
            ctx.lineTo(px, py);
            ctx.stroke();

            // v -> d
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(pixelOrigin.x + scale * d.i, pixelOrigin.y + scale * -d.j);
            ctx.stroke();

            // v -> e
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(pixelOrigin.x + scale * e.i, pixelOrigin.y + scale * -e.j);
            ctx.stroke();

            // d -> e
            ctx.beginPath();
            ctx.moveTo(pixelOrigin.x + scale * d.i, pixelOrigin.y + scale * -d.j);
            ctx.lineTo(pixelOrigin.x + scale * e.i, pixelOrigin.y + scale * -e.j);
            ctx.stroke();

            ctx.strokeStyle = "#000";
            ctx.lineWidth = 1;

        }

        drawHorizontalAxis();
        drawVerticalAxis();
        drawGrid();

        const V1 = new Vector(5, 5);
        drawVector(V1, '#ffffff');
        const V2 = new Vector(3, -1);
        drawVector(V2, '#EA5356');
        const V3 = V1.add(V2);
        drawVector(V3, '#DDCA6F');
        const V4 = V1.multiply(2).add(V3);
        drawVector(V4, '#3197FF');


        // drawFunction(x => 2 * x, '#ffffff');

        // TO DO: Work on asymptotes
        // drawFunction(function (x) {
        //     // return Math.tan(x);

        //     // return x ** 3;

        //     // if (x < 2) return x ** 2;
        //     // if (x === 2) return 6;
        //     // if (x > 2) return 10 - x;

        //     // return 1 / x;
        // }, "#3197FF");

        // drawFunction(function (x) {
        //     return Math.sin(x);
        // }, "#DDCA6F");

        // drawFunction(function (x) {
        //     return Math.cos(x);
        // }, "#EA5356");

    };

    window.onresize = function (event) {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        drawScreen();
    };

    canvas.onwheel = function (event) {
        const beforeOffsetX = offsetX;
        const beforeOffsetY = offsetY;
        const beforeOffsetXCart = offsetX / scale;
        const beforeOffsetYCart = offsetY / scale;
        scale -= event.deltaY * scale / 2500;
        offsetX = beforeOffsetXCart * scale;
        offsetY = beforeOffsetYCart * scale;

        if (scale < 8) {
            scale = 8;
            offsetX = beforeOffsetX;
            offsetY = beforeOffsetY;
        }
        drawScreen();
    };

    let drag = false;
    let mouseX = 0;
    let mouseY = 0;

    canvas.onmousedown = function (event) {
        drag = true;
        mouseX = event.clientX + offsetX;
        mouseY = event.clientY + offsetY;
    }

    canvas.onmousemove = function (event) {
        let currentMouseX = event.clientX;
        let currentMouseY = event.clientY;

        if (drag) {
            offsetX = mouseX - currentMouseX;
            offsetY = mouseY - currentMouseY;
            drawScreen();
        }
    }

    canvas.onmouseup = function (event) {
        drag = false;
    }

    drawScreen();
};

