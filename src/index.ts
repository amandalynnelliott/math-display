/*
To Do
- asymptotes
- zoom math function
--- zoom grid numbering change & affecting grid size
------ every 5th line darkens on unit = 20
------ every 10th line darkens on unir = 12
*/

import { Matrix } from './Matrix';
import { Vector } from './Vector';

window.onload = function () {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const ctx: CanvasRenderingContext2D = canvas.getContext("2d");
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    /**
     * Represents points between axes in the cartesian plane. It increases with zooming in; decreases when zooming out.
     */
    let scale = 50;

    /**
     * Pixel space. Values represent the distance panned by the user and updates based on user input.
     */
    const pixelOffset = {
        x: 0,
        y: 0
    };

    const darkGray = "#222";
    const offwhite = "#EBEBEB";
    const lightGreen = "#90DCB5";
    const darkGreen = "#6BBCAC";

    // Styles 
    ctx.font = "14px Roboto";
    const bgColor = darkGray;
    const fontColor = offwhite;
    const axisColor = lightGreen;
    const gridColor = darkGreen;


    function drawScreen() {
        /**
         * Clearing screen, resetting colors.
         */
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = bgColor;
        ctx.strokeStyle = bgColor;
        ctx.fillRect(0, 0, width, height);

        /**
         * Pixel space. Location of cartesian origin in pixels. Moves as user pans.
         */
        const pixelOrigin = {
            x: width / 2 - pixelOffset.x,
            y: height / 2 - pixelOffset.y
        };

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

            /**
             * Drawing x-axis lines and labels.
             */
            const leftEdge = Math.floor(-(width / 2 - pixelOffset.x) / scale);
            const rightEdge = Math.ceil((width / 2 + pixelOffset.x) / scale);
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

            /**
             * Drawing y-axis lines and labels.
             */
            const topEdge = Math.floor(-(height / 2 - pixelOffset.y) / scale);
            const bottomEdge = Math.ceil((height / 2 + pixelOffset.y) / scale);
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

        /**
         * For drawing mathmatical functions. For each input (cartesian x) there can only be one output (cartesian y).
         * 
         * @param mathFunction Function that calculates y-values. 
         * @param color Color of function stroke.
         * @param doSubPixel Does the function have asymptotes? If yes, set it to true, Otherwise, leave it as false.
         * 
         */

        function drawFunction(mathFunction: (x: number) => number, color: string, doSubPixel = false) {
            let previousX: number = undefined;
            let previousY: number = undefined;

            ctx.beginPath();
            if (doSubPixel) {
                for (let px = 0; px < width; px += (1 / scale)) {
                    for (let subX = 0; subX < 1 / scale; subX += (1 / scale) / 10) {
                        const x = (((px + subX) + pixelOffset.x) / scale) - ((width / scale) / 2);
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
            } else {
                // Loop through every x-pixel value on the screen.
                for (let px = 0; px < width; px++) {
                    // Convert each x-pixel value into cartesian.
                    const x = (((px) + pixelOffset.x) / scale) - ((width / scale) / 2);
                    // Get the y value in cartesian.
                    const y = -mathFunction(x);
                    // Convert y-cartesian to y-pixel value.
                    const py = pixelOrigin.y + scale * y;

                    // If this is NOT the first point being drawn. Need to connect previous point to current point.
                    if (previousY !== undefined) {
                        // If current pixel-y is OFF the screen
                        if (py < 0 || py >= height) {
                            // If previous pixel-y is ON the screen, then draw a line from inside to outside.
                            if (previousY >= 0 && previousY < height) {
                                ctx.lineTo(px, py);
                            }
                        } else {
                            // If previous pixel-y is OFF the screen.
                            if (previousY < 0 || previousY >= height) {
                                ctx.moveTo(previousX, previousY);
                            }
                            // If current pixel-y is ON the screen.
                            if (py >= 0 && py < height) {
                                // If distance between previous pixel-y and current pixel-y is greater than screen height, just move to current point but don't draw. Otherwise, draw.
                                if (Math.abs(previousY - py) > (height)) {
                                    ctx.moveTo(px, py);
                                } else {
                                    ctx.lineTo(px, py);
                                }
                            }
                        }
                    } else {
                        // If this IS the first point being drawn. No need to connect to previous point.
                        ctx.moveTo(px, py);
                    }
                    // Redefine previous pixel points.
                    previousY = py;
                    previousX = px;
                }
            }
            // Add stroke to mapped function.
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.stroke();
            // Reset stroke
            ctx.strokeStyle = "#000";
            ctx.lineWidth = 1;
        }

        /**
         * For plotting mathematical equations that aren't functions. There are multiple outputs for a single input. ie: a circle.
         * 
         * @param Xfunct Math function with t as parameter, calculated using a range of t-values in cartesian values.
         * @param Yfunct Math function with t as parameter, calculated using a range of t-values in cartesian values.
         * @param ti initial-t value in range; cartesian
         * @param tf final t-value in range; cartesian
         * @param color color of line or shape drawn
         * @param fill True: fills in shape. False: will remain an unfilled stroke.
         */
        function drawParametric(Xfunct: (t: number) => number, Yfunct: (t: number) => number, ti: number, tf: number, color: string, fill = false) {
            let previousX: number = undefined;
            let previousY: number = undefined;

            ctx.beginPath();
            // Loops through range of t-values. 1 divided by scale increases resolution.
            for (let t = ti; t <= tf; t += (1 / scale)) {
                const x = Xfunct(t);
                const y = -Yfunct(t); // Negative because browser y-origin is at top of screen.

                const px = pixelOrigin.x + scale * x;
                const py = pixelOrigin.y + scale * y;

                if (previousY !== undefined) {
                    if (py < 0 || py >= height) {
                        if (previousY >= 0 && previousY < height) {
                            ctx.lineTo(px, py);
                        }
                    } else {
                        if (previousY < 0 || previousY >= height) {
                            ctx.moveTo(previousX, previousY);
                        }
                        if (py >= 0 && py < height) {
                            if (Math.abs(previousY - py) > (height)) {
                                ctx.moveTo(px, py);
                            } else {
                                ctx.lineTo(px, py);
                            }
                        }
                    }
                } else {
                    ctx.moveTo(px, py);
                }
                previousY = py;
                previousX = px;
            }
            ctx.strokeStyle = color;
            ctx.fillStyle = color;
            ctx.lineWidth = 2;
            if (fill) {
                ctx.fill();
            } else {
                ctx.stroke();
            }
            ctx.strokeStyle = "#000";
            ctx.fillStyle = "#000";
            ctx.lineWidth = 1;
        }

        /**
         * For plotting vectors.
         * @param vector 
         * @param color color of drawn vector
         * @param originX cartesian; if you want vector to start at an origin other than default 0,0.
         * @param originY cartesian; if you want vector to start at an origin other than default 0,0.
         * @param arrow True: vector will have arrowhead; False: vector will just be a line.
         */
        function drawVector(vector: Vector, color: string, originX: number = 0, originY: number = 0, arrow: boolean = true) {
            // Converts cartesian to pixel coordinates
            const pixelVector = new Vector(scale * vector.i, scale * -vector.j);
            // Variables for vector arrowhead (triangle)
            const a = pixelVector.normalized().multiply(20);
            const c = pixelVector.subtract(a);
            const b = pixelVector.perpendicular().normalized().multiply(10);
            const d = c.add(b);
            const e = c.subtract(b);
            // end arrowhead variables

            ctx.strokeStyle = color;
            ctx.fillStyle = color;
            ctx.lineWidth = 2;

            // line
            ctx.beginPath();
            ctx.moveTo(
                (originX * scale) + pixelOrigin.x,
                (-originY * scale) + pixelOrigin.y);
            // If arrowhead: True, have to make the vector line shorter.
            if (arrow) {
                ctx.lineTo(
                    (originX * scale) + pixelOrigin.x + c.i,
                    (-originY * scale) + pixelOrigin.y + c.j);

            } else {
                ctx.lineTo(
                    (originX * scale) + pixelOrigin.x + pixelVector.i,
                    (-originY * scale) + pixelOrigin.y + pixelVector.j);
            }
            ctx.stroke();

            // Drawing a triangle for the arrowhead.
            if (arrow) {
                ctx.beginPath();
                ctx.moveTo(
                    (originX * scale) + pixelOrigin.x + pixelVector.i,
                    (-originY * scale) + pixelOrigin.y + pixelVector.j);
                ctx.lineTo(
                    (originX * scale) + pixelOrigin.x + d.i,
                    (-originY * scale) + pixelOrigin.y + d.j);
                ctx.lineTo(
                    (originX * scale) + pixelOrigin.x + e.i,
                    (-originY * scale) + pixelOrigin.y + e.j);
                ctx.fill();
            }

            ctx.strokeStyle = "#000";
            ctx.fillStyle = "#000";
            ctx.lineWidth = 1;
        }

        drawHorizontalAxis();
        drawVerticalAxis();
        drawGrid();

        // Examples and testing
        {

            // Colors for Plotting
            const white = "#ffffff";
            const yellow = "#DDCA6F";
            const blue = "#3197FF";
            const red = "#EA5356";
            const orange = "#FFA500";

            // Animation coefficient based on current time.
            const a = Math.sin(Date.now() / 10000) * 10;

            const V1 = new Vector(5, 5);
            drawVector(V1, red, 0, 0, true);
            const V2 = new Vector(3, -1);
            drawVector(V2, yellow, V1.i, V1.j, true);
            const V3 = V1.add(V2);
            drawVector(V3, blue, 0, 0, true);

            // const theta = (Math.PI / 2) + a;
            // const matrix = new Matrix(
            //     Math.cos(theta), -Math.sin(theta),
            //     Math.sin(theta), Math.cos(theta)
            // );
            // const V1Transform = V1.transform(matrix);
            // const V2Transform = V2.transform(matrix);
            // const V3Transform = V3.transform(matrix);
            // drawVector(V1Transform, red, 0, 0, true);
            // drawVector(V2Transform, yellow, V1Transform.i, V1Transform.j, true);
            // drawVector(V3Transform, blue, 0, 0, true);

            // const V4 = V1.multiply(0.5).add(V3);
            // drawVector(V4, blue);

            // drawFunction(x => 2 * x, '#ffffff');

            // TO DO: Work on asymptotes
            // drawFunction(function (x) {
            //     return Math.tan(x);

            //     // return x ** 3;

            //     // if (x < 2) return x ** 2;
            //     // if (x === 2) return 6;
            //     // if (x > 2) return 10 - x;

            //     // return 1 / x;
            // }, "#3197FF", true);

            // drawFunction(function (x) {
            //     return Math.sin(x + a);
            // }, yellow);

            // drawFunction(function (x) {
            //     return Math.cos(x) * a;
            // }, red);

            // // line
            // drawParametric(
            //     function (t) {
            //         return (a * t) - Math.sin(a * t);
            //     },
            //     function (t) {
            //         return 1 - Math.cos(a * t);
            //     },
            //     0, 1, white
            // );
            // // circle
            // drawParametric(
            //     function (t) {
            //         return Math.cos(t) + a;
            //     },
            //     function (t) {
            //         return Math.sin(t) + 1;
            //     },
            //     0, Math.PI * 2,
            //     blue
            // );
            // // point
            // drawParametric(
            //     function (t) {
            //         return Math.cos(t) / 20 + (a - Math.sin(a));
            //     },
            //     function (t) {
            //         return Math.sin(t) / 20 + (1 - Math.cos(a));
            //     },
            //     0, Math.PI * 2,
            //     orange,
            //     true
            // );
        }

        // Redraw the screen every frame.
        requestAnimationFrame(drawScreen);
    };

    window.onresize = function () {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    };

    // Zooming
    canvas.onwheel = function (event) {
        const beforeOffsetX = pixelOffset.x;
        const beforeOffsetY = pixelOffset.y;
        const beforeOffsetXCart = pixelOffset.x / scale;
        const beforeOffsetYCart = pixelOffset.y / scale;
        // Change scale based on mousewheel input.
        scale -= event.deltaY * scale / 2500;
        // When zooming, keeps the center of the screen consistent.
        pixelOffset.x = beforeOffsetXCart * scale;
        pixelOffset.y = beforeOffsetYCart * scale;

        // Prevents user from zooming out too far.
        if (scale < 8) {
            scale = 8;
            pixelOffset.x = beforeOffsetX;
            pixelOffset.y = beforeOffsetY;
        }
    };

    // Panning
    {
        let drag = false;
        let mouseX = 0;
        let mouseY = 0;

        canvas.onmousedown = function (event) {
            drag = true;
            mouseX = event.clientX + pixelOffset.x;
            mouseY = event.clientY + pixelOffset.y;
        }

        canvas.onmousemove = function (event) {
            let currentMouseX = event.clientX;
            let currentMouseY = event.clientY;

            if (drag) {
                pixelOffset.x = mouseX - currentMouseX;
                pixelOffset.y = mouseY - currentMouseY;
            }
        }

        canvas.onmouseup = function (event) {
            drag = false;
        }
    }
    drawScreen();
};

