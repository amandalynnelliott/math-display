/*

To Do
- Draw x-axis
- Draw y-axis
- Var square unit size
--- draw vertical line from y-axis every unit
--- draw horizontal line from x-axis every unit
- number the x-axis
- number the y-axis
- window resize event
- zoom control connected to unit
- pan control
- input math functions -origin and unit
- dark theme

- camera
- zoom math function
--- zoom grid numbering change & affecting grid size
------ every 5th line darkens on unit = 20
------ every 10th line darkens on unir = 12

*/

window.onload = function () {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const ctx: CanvasRenderingContext2D = canvas.getContext("2d");
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    let unit = 50; // Changes when zoom

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

            // Draw vertical lines
            // -- right side
            for (let i = 0; i < 1000; i++) {
                const x = pixelOrigin.x + unit * i;

                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, height);
                ctx.lineWidth = 0.25;
                ctx.stroke();

                if (i !== 0 && i % 5 === 0) {
                    ctx.fillText(i.toString(), x, pixelOrigin.y);
                }
            }
            // -- left side
            for (let i = 0; i < 1000; i++) {
                const x = pixelOrigin.x - unit * i;

                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, height);
                ctx.lineWidth = 0.25;
                ctx.stroke();

                if (i !== 0 && i % 5 === 0) {
                    ctx.fillText((-i).toString(), x, pixelOrigin.y);
                }
            }
            // Draw horizontal lines
            // -- bottom
            for (let i = 0; i < 1000; i++) {
                const y = pixelOrigin.y + unit * i;

                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
                ctx.lineWidth = 0.25;
                ctx.stroke();

                if (i !== 0 && i % 5 === 0) {
                    ctx.fillText((-i).toString(), pixelOrigin.x, y);
                }
            }
            //-- top
            for (let i = 0; i < 1000; i++) {
                const y = pixelOrigin.y - unit * i;

                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
                ctx.lineWidth = 0.25;
                ctx.stroke();

                if (i !== 0 && i % 5 === 0) {
                    ctx.fillText(i.toString(), pixelOrigin.x, y);
                }
            }
        }

        function drawFunction(mathFunction, color) {
            let previousX: number = undefined;
            let previousY: number = undefined;

            for (let px = 0; px < width; px++) {
                const x = ((px + offsetX) / unit) - ((width / unit) / 2);
                const y = mathFunction(x);

                // console.log(x, y);

                // if ((origin.y - offsetY - unit * y) < 0 || (origin.y - offsetY - unit * y) > height) {
                //     continue;
                // }

                // ctx.beginPath();
                // ctx.fillStyle = color;
                // ctx.arc(origin.x - offsetX + unit * x, origin.y - offsetY - unit * y, 1, 0, 2 * Math.PI, true);
                // ctx.fill();

                const currentX = pixelOrigin.x + unit * x;
                const currentY = pixelOrigin.y - unit * y;

                if (previousX !== undefined && previousY !== undefined) {
                    // if (Math.abs(previousY - currentY) < 100) {
                        ctx.strokeStyle = color;
                        ctx.beginPath();
                        ctx.moveTo(previousX, previousY);
                        ctx.lineTo(currentX, currentY);
                        ctx.lineWidth = 2;
                        ctx.stroke();
                    // }
                }

                ctx.strokeStyle = "#000";
                ctx.fillStyle = "#000";

                previousX = currentX;
                previousY = currentY;
            }
        }

        drawHorizontalAxis();
        drawVerticalAxis();
        drawGrid();

        drawFunction(function (x) {
            return Math.tan(x);
        }, "#3197FF");

        // drawFunction(function(x) {
        //     return -Math.sin(x);
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
        unit -= event.deltaY / 50;
        if (unit < 8) {
            unit = 8;
        }
        if (unit > 130) {
            unit = 130;
        }
        //console.log(unit);
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

