// document.querySelector("#canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var ctx = canvas.getContext("2d");

var squareSize = 10;

function drawGrid() {
    // ctx.fillStyle = "white";
    ctx.shadowBlur = 0;
    ctx.beginPath();
    for (i = 0; i <= canvas.height; i += squareSize) {
        ctx.moveTo(0,i);
        ctx.lineTo(canvas.width, i);
    }
    for (i = 0; i <= canvas.width; i += squareSize) {
        ctx.moveTo(i,0);
        ctx.lineTo(i, canvas.height);
    }
    ctx.stroke();
    ctx.closePath();
}

function drawSquare(x,y) {
    ctx.fillStyle = "white";
    ctx.shadowBlur = 10;
    ctx.shadowColor = "white";
    ctx.fillRect(x*squareSize, y*squareSize, squareSize, squareSize);
}

var liveSquares = new Set();

liveSquares.add(stringify(5,6));
liveSquares.add(stringify(6,6));
liveSquares.add(stringify(7,6));
liveSquares.add(stringify(6,5));


function stringify(x,y) {
    return x.toString() + "," + y.toString();
}

function arrayify(string) {
    return new Array(parseInt(string.split(",")[0]), parseInt(string.split(",")[1]));
}

function getNumLiveNeighbours(x,y) {
    var liveNeighbours = 0;
    for (var i = -1; i < 2; i++) {
        for (var j = -1; j < 2; j++) {
            if (!(i == 0 && j == 0)) {
                if (liveSquares.has(stringify(x+i,y+j))) {
                    liveNeighbours++;
                }
            }
        }
    }
    return liveNeighbours;
}

function checks() {
    var squaresToDie = new Set();
    var squaresToBeBorn = new Set();

    var checkedSquares = new Set();

    for (let square of liveSquares) {

        var x1 = arrayify(square)[0];
        var y1 = arrayify(square)[1];
        
        for (var i = -1; i < 2; i++) {
            for (var j = -1; j < 2; j++) {

                var x2 = x1+i;
                var y2 = y1+j;

                if (!(checkedSquares.has(stringify(x2,y2)))) {
                    var liveNeighbours = getNumLiveNeighbours(x2, y2);

                    // If this square is live
                    if (liveSquares.has(stringify(x2,y2))) {
                        if (liveNeighbours < 2) {
                            squaresToDie.add(stringify(x2,y2));
                            // console.log(x + "," + y + " has " + liveNeighbours + " live neighbours so dies")
                        } else if (liveNeighbours > 3) {
                            squaresToDie.add(stringify(x2,y2));
                            // console.log(x + "," + y + " has " + liveNeighbours + " live neighbours so dies")
                        }
                    } else {
                        if (liveNeighbours == 3) {
                            squaresToBeBorn.add(stringify(x2,y2));
                            // console.log(x + "," + y + " has " + liveNeighbours + " live neighbours so is born")
                        }
                    }

                    checkedSquares.add(stringify(x2,y2));
                }
            }
        }
    }

    for (let item of squaresToDie) liveSquares.delete(item);
    for (let item of squaresToBeBorn) liveSquares.add(item);
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    for (let item of liveSquares) drawSquare(arrayify(item)[0], arrayify(item)[1]);
}

drawGrid();
for (let item of liveSquares) drawSquare(arrayify(item)[0], arrayify(item)[1]);


canvas.onmousedown = function(event) {

    // console.log(event.clientX + " " + event.clientY);
    var titleBar = document.querySelector("#title-bar");
    liveSquares.add(stringify(Math.floor(event.clientX/squareSize), Math.floor((event.clientY) /squareSize)));
    // console.log(stringify(Math.floor(event.clientX/squareSize), Math.floor(event.clientY/squareSize)));

    update();
};

var started = false;
var interval;

document.querySelector("#start-button").onclick = function() {
    if (!started) {
        interval = setInterval(function() {
            checks();
            update();
        }, 100);
        started = true;
    }
};

document.querySelector("#stop-button").onclick = function() {
    clearInterval(interval);
    started = false;
};