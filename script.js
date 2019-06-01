const canvas = document.getElementById("c");
const ctx = canvas.getContext("2d");

let bird, pipes, game, floor, spritesheet;

class Game {
    constructor(score) {
        this.score = 125;
        this.isGame = true;
        this.numberTab = [
            [992, 120, 23, 35], //0
            [268, 910, 15, 35],    //1
            [584, 320, 23, 35],    //2   
            [612, 320, 23, 35],    //3   
            [640, 320, 23, 35],    //4   
            [668, 320, 23, 35],    //5   
            [584, 368, 23, 35],    //6  
            [612, 368, 23, 35],    //7  
            [640, 368, 23, 35],    //8  
            [668, 368, 23, 35]    //9
        ];
    }
    drawScore() {


        const num = this.score.toString();
        for (let i = 0; i < num.length; i++)
            ctx.drawImage(spritesheet, this.numberTab[num[i]][0], this.numberTab[num[i]][1], 23, 35, 150 + i * 25, 200, 23, 35);



        // }
        // ctx.font = '60px Press';
        //ctx.fillStyle = 'red';
        //ctx.fillText(this.score, canvas.width / 2 - 35, 200);
    }
    drawGameOver() {
        ctx.drawImage(spritesheet, 785, 114, 202, 56, 100, 300, 202, 56);
    }

}

class Background {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        // this.background = new Image();
        // this.background.src = 'images/background.png';
    }
    drawBackground() {
        ctx.clearRect(0, 0, this.width, this.height) //clears board
        ctx.fillStyle = this.backgroundColor;

        ctx.drawImage(spritesheet, 0, 0, 287, 511, 0, 0, canvas.width, canvas.height);   //day
        // ctx.drawImage(spritesheet, 292, 0, 287, 511, 0, 0, canvas.width, canvas.height);    //night
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
        this.position = 1;
    }
    drawBird() {
        ctx.beginPath();
        switch (this.position % 9) {
            case 0:
            case 1:
            case 2:
                ctx.drawImage(spritesheet, 6, 982, 33, 23, this.x, this.y, this.width, this.height);
                break;
            case 3:
            case 4:
            case 5:
                ctx.drawImage(spritesheet, 62, 982, 33, 23, this.x, this.y, this.width, this.height);
                break;
            case 6:
            case 7:
            case 8:
                ctx.drawImage(spritesheet, 118, 982, 33, 23, this.x, this.y, this.width, this.height);
                break;

        }


    }
    updatePosition() {
        this.position++;
        this.position === 9 ? this.position = 0 : null;
        this.deltaTime < 0.6 ? this.deltaTime += (1 / 10) : null;
        this.y -= this.vert * this.deltaTime;
        this.vert -= this.gravity * this.deltaTime;
    }
    birdJump() {
        if (game.isGame) {
            this.deltaTime = 0;
            this.vert = this.jump;
        }
    }
    checkPosition() {
        this.y > floor.y - this.height ? game.isGame = false : null;
    }
    checkCollision(pipe) {
        (this.x > pipe.x && this.x < pipe.x + pipe.width) &&
            !(this.y > pipe.y - pipe.space - 6 && this.y < pipe.y - this.height + 6) ? game.isGame = false : null;
    }
    birdFall() {
        this.y < floor.y - this.height ? this.y += this.gravity * 10 : null;
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

    }
    drawPipe() {
        ctx.beginPath();
        ctx.drawImage(spritesheet, 112, 646, 51, 318, this.x, this.y - this.space - this.heightTop, this.width, this.heightTop)
        // ctx.drawImage(this.imageTop, this.x, this.y - this.space - this.heightTop, this.width, this.heightTop); //top pipe
        ctx.drawImage(spritesheet, 168, 646, 51, 318, this.x, this.y, this.width, this.heightBottom);  //bottom pipe
    }
    changePosition() {
        this.x -= this.speed;
    }
    checkPosition(i) {
        this.x + this.width < 0 ? pipes[i] = new Pipe(canvas.width) : null;

        game.isGame ? this.x === bird.x ? game.score++ : null : null;
    }

}

class Floor {
    constructor(x, y, width, height, dx) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.width = width;
        this.height = height;
    }
    drawFloor() {
        ctx.beginPath();
        ctx.drawImage(spritesheet, 584, 0, 335, 111, this.x, this.y, this.width, this.height);

    }
    changePosition() {
        this.x += this.dx;
        this.x < -canvas.width ? this.x = 0 : null;
    }


}


function gameLoop() {

    background.drawBackground();
    if (game.isGame) {
        bird.updatePosition();
        bird.checkPosition();
    }
    else {
        bird.birdFall();
        game.drawGameOver();
    }
    for (let i = 0; i < 2; i++) {
        pipes[i].drawPipe();
        if (game.isGame)
            pipes[i].changePosition();
        pipes[i].checkPosition(i);
        bird.checkCollision(pipes[i])
    }
    bird.drawBird();
    if (game.isGame)
        floor.changePosition();
    floor.drawFloor();
    game.drawScore();
    window.requestAnimationFrame(gameLoop);
}

function newGame() {
    background = new Background(canvas.width, canvas.height, 'lightgreen')
    bird = new Bird(200, canvas.width / 2 - 50, 50, 40, 1, 12, 0); //(y, x, width, height, gravity, jumpSpeed, verticalSpeed)
    floor = new Floor(0, canvas.height - 100, canvas.width * 2, 120, -3) //(x, y, width, height, dx)
    game = new Game(0);
    pipes = [];

    pipes[0] = new Pipe(canvas.width * 2); //x, y, width, heightTop, space, speed
    pipes[1] = new Pipe(canvas.width * 2.6); //x, y, width,  space, speed


}


function asyncImageLoader(url) {
    return new Promise((resolve, reject) => {
        spritesheet = new Image();
        spritesheet.src = url
        spritesheet.onload = () => resolve(true)
        spritesheet.onerror = () => reject(new Error('could not load image'))
    })
}

spritesheetCheck = asyncImageLoader('images/fb.png');

spritesheetCheck.then(res => {
    if (res) {
        newGame();
        window.requestAnimationFrame(gameLoop);
    }
    else
        console.log(res)
})



window.addEventListener('keydown', (event) => {
    switch (event.keyCode) {

        case 32:  //'left mouse button' key
            bird.birdJump();
            break;

        default:
            break;
    }

});