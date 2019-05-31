const canvas = document.getElementById("c");
const ctx = canvas.getContext("2d");

let bird, pipes;

class Background {
    constructor(width, height, backgroundColor) {
        this.width = width;
        this.height = height;
        this.background = new Image();
        this.background.src = 'images/background.png';
    }
    drawBackground() {
        ctx.clearRect(0, 0, this.width, this.height) //clears board
        ctx.fillStyle = this.backgroundColor;
        ctx.drawImage(this.background, 0, 0, canvas.width, canvas.height);
    }
}

class Bird {
    constructor(y, x, width, height, gravity, jumpSpeed, verticalSpeed) {
        this.y = y;
        this.x = x;
        this.width = width;
        this.height = height;
        this.gravity = gravity;
        this.jump = jumpSpeed;
        this.vert = verticalSpeed;
        this.deltaTime = 1;
        this.image = new Image();
        this.image.src = 'images/bird.png';
    }
    drawBird() {
        ctx.beginPath();
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
    updatePosition() {

        this.deltaTime < 0.5 ? this.deltaTime += (1 / 30) : null;
        this.y -= this.vert * this.deltaTime;
        this.vert -= this.gravity * this.deltaTime;
    }

    birdJump() {
        this.deltaTime = 0;
        this.vert = this.jump;
    }
}

class Pipe {
    constructor(x, y, width, heightBottom, heightTop, space, speed) {
        this.space = space;
        this.heightBottom = Math.floor(Math.random() * (canvas.height / 2 - canvas.height / 8 + 1)) + canvas.height / 8;
        this.heightTop = canvas.height - this.heightBottom - this.space;
        this.x = x;
        this.y = 0;
        this.width = width;
        this.speed = speed;
        this.imageTop = new Image();
        this.imageTop.src = 'images/pipeTop.png';
        this.imageBottom = new Image();
        this.imageBottom.src = 'images/pipeBottom.png';
    }
    drawPipe() {
        ctx.beginPath();
        ctx.drawImage(this.imageTop, this.x, this.y);
        ctx.drawImage(this.imageBottom, this.x, this.y);
    }
    changePosition() {
        this.x -= this.speed;
    }
    checkPosition(i) {
        this.x + this.width < 0 ? pipes[i] = new Pipe() : null;
    }

}

class Floor {
    constructor(x, y, width, height, dx) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.width = width;
        this.height = height;
        this.image = new Image();
        this.image.src = 'images/bottom.png';
    }
    drawFloor() {
        ctx.beginPath();
        ctx.drawImage(this.image, this.x, this.y,this.height,this.width);

    }
    changePosition() {
        this.x +=this.dx;
        this.x <-canvas.width ? this.x=0:null;
    }


}


function gameLoop() {
    background.drawBackground();
    floor.drawFloor()
    floor.changePosition();
    bird.drawBird();
    bird.updatePosition();
    for (let i = 0; i < 2; i++) {
        // pipes[i].drawPipe();
        // pipes[i].changePosition();
        // pipes[i].checkPosition(i);
    }
    window.requestAnimationFrame(gameLoop);
}

function newGame() {
    background = new Background(canvas.width, canvas.height, 'lightgreen')
    bird = new Bird(200, canvas.width/2-50, 50, 40, 1, 20, 0); //(y, x, width, height, gravity, jumpSpeed, verticalSpeed)
    floor = new Floor(0,canvas.height-100,120,canvas.width*2,-3) //(x, y, width, height, dx)
    // pipes = [];

    // pipes[0] = new Pipe(0,200,60,); //x, y, width, heightTop, space, speed
    //  pipes[1] = new Pipe(); //x, y, width,  space, speed

}

newGame();
window.requestAnimationFrame(gameLoop);

window.addEventListener('keydown', (event) => {
    switch (event.keyCode) {

        case 32:  //'left mouse button' key
            bird.birdJump();
            break;

        default:
            break;
    }

});