const canvas = document.getElementById("c");
const ctx = canvas.getContext("2d");

let bird, pipes;

class Background {
    constructor(width, height, backgroundColor) {
        this.width = width;
        this.height = height;
        this.backgroundColor = backgroundColor;
    }
    drawBackground() {
        ctx.clearRect(0, 0, this.width, this.height) //clears board
        ctx.fillStyle = this.backgroundColor;
        ctx.fillRect(0, 0, this.width, this.height);
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
    }
    drawBird() {
        ctx.beginPath();
        ctx.fillStyle = 'yellow';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Pipe {
    constructor(x, y, width, heightBottom, heightTop, space, speed) {
        this.space = space;
        this.heightBottom = Math.floor(Math.random() * (canvas.height/2 - canvas.height/8 + 1)) + canvas.height/8;
        this.heightTop = canvas.height-this.heightBottom-this.space;
        this.x = x;
        
        this.y = 0;
        this.width = width;
        
        
        this.speed = speed;
    }
    drawPipe() {
        ctx.beginPath();
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y, this.width, this.heightBottom);
        ctx.fillRect(this.x, 0, this.width, this.heightTop);
    }
    changePosition() {
        this.x -= this.speed;
    }
    checkPosition(i) {
        this.x + this.width < 0 ? pipes[i] = new Pipe() : null;
    }

}

function gameLoop() {
    background.drawBackground();
    bird.drawBird();

    for (let i = 0; i < 2; i++) {
       // pipes[i].drawPipe();
       // pipes[i].changePosition();
       // pipes[i].checkPosition(i);
    }

    window.requestAnimationFrame(gameLoop);
}

function newGame() {
    background = new Background(canvas.width, canvas.height, 'lightgreen')
    bird = new Bird(200, 200, 40, 40, 800, 400, 400); //y,x, width, height, gravity,jumpSpeed,verticalSpeed
    pipes = [];

   // pipes[0] = new Pipe(); //x, y, width, heightTop, space, speed
   // pipes[1] = new Pipe(); //x, y, width,  space, speed

}

newGame();
window.requestAnimationFrame(gameLoop);

window.addEventListener('keydown', (event) => {
    switch (event.keyCode) {

        case 32:  //'left mouse button' key
        bird.jump();
            break;

        default:
            break;
    }

});