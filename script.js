const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');

let bird, pipes, game, floor, spritesheet;

class Game {
    constructor(score) {
        this.score = score;
        this.isGame = true;
        this.numberTab = [      //cords from spritesheet [x,y,x width,y width]
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
        this.isStarted = false;
    }
    drawScore() {
        const num = this.score.toString();
        for (let i = 0; i < num.length; i++)    //draw each number individually
            ctx.drawImage(spritesheet, this.numberTab[num[i]][0], this.numberTab[num[i]][1], 23, 35, canvas.width * 0.48 + i * 25, 180, 23, 35);
    }
    drawGameOver() {                                                        // (spritesheet, x in spritesheet, y in spritesheet,width in spritesheet,
        ctx.drawImage(spritesheet, 785, 114, 202, 56, canvas.width / 4, canvas.height * 0.4, 202, 56);   //height in spritesheet, position x, positiony, width ,height)
    }
    addScore() {
        this.score++;
    }
}

class Background {
    constructor(width, height, background) {
        this.width = width;
        this.height = height;
        this.background = background;
    }
    drawBackground() {
        ctx.clearRect(0, 0, this.width, this.height) //clears board
        if (this.background === 'day')
            ctx.drawImage(spritesheet, 0, 0, 287, 511, 0, 0, canvas.width, canvas.height);   //day
        else
            ctx.drawImage(spritesheet, 292, 0, 287, 511, 0, 0, canvas.width, canvas.height);    //night
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
        this.position++;
        ctx.beginPath();
        switch (this.position % 9) {
            case 0:
            case 1:
            case 2:
                //  ctx.drawImage(spritesheet, 6, 982, 33, 23, this.x, this.y, this.width, this.height);
                this.drawBirdPosition(6, 982);
                break;
            case 3:
            case 4:
            case 5:
                this.drawBirdPosition(62, 982);
                // ctx.drawImage(spritesheet, 62, 982, 33, 23, this.x, this.y, this.width, this.height);
                break;
            case 6:
            case 7:
            case 8:
                this.drawBirdPosition(118, 982)
                //   ctx.drawImage(spritesheet, 118, 982, 33, 23, this.x, this.y, this.width, this.height);
                break;
        }
    }
    drawBirdPosition(x, y) {
        if (game.isGame) {
            switch (true) {
                case bird.vert < -20:
                    ctx.save();
                    ctx.translate(this.x, this.y);
                    ctx.rotate(Math.PI * 1 / 4);
                    ctx.drawImage(spritesheet, x, y, 33, 23, 0, 0, this.width, this.height);
                    ctx.restore();
                    break;
                case bird.vert > 0:
                    ctx.save();
                    ctx.translate(this.x, this.y);
                    ctx.rotate(Math.PI * 5/ 8);
                    ctx.drawImage(spritesheet, x, y, 33, 23, 0, 0, this.width, this.height);
                    ctx.restore();
                    break;
                case bird.vert >= -20 && bird.vert <= 0:
                    ctx.drawImage(spritesheet, x, y, 33, 23, this.x, this.y, this.width, this.height);
                    break;
                default:
                    break;
            }
        }
        else {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(Math.PI * 1 / 2);
            ctx.drawImage(spritesheet, x, y, 33, 23, 0, 0, this.width, this.height);
            ctx.restore();
        }
    }

    updatePosition() {
        
        this.position === 9 ? this.position = 0 : null;     // implemented in order for the bird to change animation
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
        this.y > floor.y - this.height ? game.isGame = false : null;    //if bird hits the floor
    }
    checkCollision(pipe) {
        (this.x > pipe.x && this.x < pipe.x + pipe.width) &&    //if bird hits one of the pipes
            !(this.y > pipe.y - pipe.space - 6 && this.y < pipe.y - this.height + 6) ? game.isGame = false : null;
    }
    birdFall() {    //make sure bird falls to the ground after hitting pipe
        this.y < floor.y - this.height ? this.y += this.gravity * 10 : null;
    }
}

class Pipe {
    constructor(x) {
        this.space = 140;
        this.heightBottom = 400;
        this.heightTop = 300;
        this.x = x;         //lower pipe position
        this.y = Math.floor(Math.random() * (canvas.height * 3 / 4 - canvas.height * 1 / 4 + 1)) + canvas.height * 1 / 4;
        this.width = 80;
        this.speed = 2;
    }
    drawPipe() {
        ctx.drawImage(spritesheet, 112, 646, 51, 318, this.x, this.y - this.space - this.heightTop, this.width, this.heightTop) //top pipe
        ctx.drawImage(spritesheet, 168, 646, 51, 318, this.x, this.y, this.width, this.heightBottom);  //bottom pipe
    }
    changePosition() {
        this.x -= this.speed;
    }
    checkPosition(i) {
        this.x + this.width < 0 ? pipes[i] = new Pipe(canvas.width) : null; //spawn new pipe after the old one leaves canvas area
        game.isGame ? this.x === bird.x ? game.addScore() : null : null;    //increase score if bird moves through pipe
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
        ctx.drawImage(spritesheet, 584, 0, 335, 111, this.x, this.y, this.width, this.height);
    }
    changePosition() {
        this.x -= this.dx;
        this.x < -canvas.width ? this.x = 0 : null;
    }
}

function gameLoop() {
    background.drawBackground();
    if(!game.isStarted)
    {
     
        floor.changePosition();
        floor.drawFloor();
        bird.drawBird();
        game.drawScore();
        window.requestAnimationFrame(gameLoop);
    
    }
    else if (game.isStarted&&game.isGame) {
        bird.updatePosition();
        bird.checkPosition();
        for (let i = 0; i < 2; i++) {
            pipes[i].drawPipe();
            pipes[i].changePosition();
            pipes[i].checkPosition(i);
            bird.checkCollision(pipes[i])
        }
        bird.drawBird();
        floor.changePosition();
        floor.drawFloor();
        game.drawScore();
        window.requestAnimationFrame(gameLoop);
    }
    else {
        bird.birdFall();
        for (let i = 0; i < 2; i++) {
            pipes[i].drawPipe();
            pipes[i].checkPosition(i);
            bird.checkCollision(pipes[i])
        }
        bird.drawBird();
        game.drawGameOver();
        floor.drawFloor();
        game.drawScore();
        window.requestAnimationFrame(gameLoop);
    }
}

function newGame() {
    background = new Background(canvas.width, canvas.height, 'day')
    bird = new Bird(200, canvas.width * 0.25, 50, 40, 1, 12, 0); //(y, x, width, height, gravity, jumpSpeed, verticalSpeed)
    floor = new Floor(0, canvas.height * 0.85, canvas.width * 2, 120, 2) //(x, y, width, height, dx)
    game = new Game(0);
    pipes = [];
    pipes[0] = new Pipe(canvas.width * 2); //x
    pipes[1] = new Pipe(canvas.width * 2.6); //x
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

if (navigator.userAgent.match(/Android/i)   //mobile detection
    || navigator.userAgent.match(/webOS/i)
    || navigator.userAgent.match(/iPhone/i)
    || navigator.userAgent.match(/iPad/i)
    || navigator.userAgent.match(/iPod/i)
    || navigator.userAgent.match(/BlackBerry/i)
    || navigator.userAgent.match(/Windows Phone/i)) {

    window.addEventListener('touchstart', (event) => {
        bird.birdJump();
        game.isStarted === false ? game.isStarted = true : null;
        if (game.isGame === false)
            newGame();
    });
}
else {
    window.addEventListener('keydown', (event) => {
        switch (event.keyCode) {
            case 32:  //'space' key
                bird.birdJump();
                game.isStarted === false ? game.isStarted = true : null;
                break;
            case 82:  //'r' key
                if (game.isGame === false)
                    newGame();
                break;
            default:
                break;
        }
    });
}

