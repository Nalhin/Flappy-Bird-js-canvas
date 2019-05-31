const canvas = document.getElementById("c");
const ctx = canvas.getContext("2d");

let bird, pipes, isGame;

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

        this.deltaTime < 0.6 ? this.deltaTime += (1 / 10) : null;
        this.y -= this.vert * this.deltaTime;
        this.vert -= this.gravity * this.deltaTime;
    }

    birdJump() {
        this.deltaTime = 0;
        this.vert = this.jump;
    }
    checkPosition() {
        this.y > floor.y - this.height ? isGame = false : null;
    }
    checkCollision(pipe) {
        (this.x > pipe.x && this.x < pipe.x + pipe.width) &&
                 !(this.y > pipe.y - pipe.space && this.y < pipe.y-this.height) ? isGame=false: null;
    }
}

class Pipe {
    constructor(x, y, width, heightBottom, heightTop, space, speed) {
        this.space = 140;
        this.heightBottom = 400;
        this.heightTop = 300;
        this.x = x;         //lower pipe position
        this.y = Math.floor(Math.random() * (canvas.height * 3 / 5 - canvas.height * 1 / 2 + 1)) + canvas.height * 1 / 2;
        this.width = 80;
        this.speed = 2;
        this.imageTop = new Image();
        this.imageTop.src = 'images/pipeTop.png';
        this.imageBottom = new Image();
        this.imageBottom.src = 'images/pipeBottom.png';
    }
    drawPipe() {
        ctx.beginPath();
        ctx.drawImage(this.imageTop, this.x, this.y - this.space - this.heightTop, this.width, this.heightTop);
        ctx.drawImage(this.imageBottom, this.x, this.y, this.width, this.heightBottom);
    }
    changePosition() {
        this.x -= this.speed;
    }
    checkPosition(i) {
        this.x + this.width < 0 ? pipes[i] = new Pipe(canvas.width) : null;
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
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);

    }
    changePosition() {
        this.x += this.dx;
        this.x < -canvas.width ? this.x = 0 : null;
    }


}


function gameLoop() {

    background.drawBackground();


    if (isGame) {

        bird.updatePosition();
        bird.checkPosition();
        
    }
    for (let i = 0; i < 2; i++) {
        pipes[i].drawPipe();
        pipes[i].changePosition();
        pipes[i].checkPosition(i);
        bird.checkCollision(pipes[i])
    }
    bird.drawBird();
    floor.changePosition();
    floor.drawFloor();
    window.requestAnimationFrame(gameLoop);
}

function newGame() {
    background = new Background(canvas.width, canvas.height, 'lightgreen')
    bird = new Bird(200, canvas.width / 2 - 50, 50, 40, 1, 12, 0); //(y, x, width, height, gravity, jumpSpeed, verticalSpeed)
    floor = new Floor(0, canvas.height - 100, canvas.width * 2, 120, -3) //(x, y, width, height, dx)
    isGame = true;
    pipes = [];

    pipes[0] = new Pipe(canvas.width * 2); //x, y, width, heightTop, space, speed
    pipes[1] = new Pipe(canvas.width * 2.6); //x, y, width,  space, speed

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