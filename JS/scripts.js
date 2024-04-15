const RATIO = 2;
const WIDTH = 16;
const HEIGHT = 18;
const SCALED_WIDTH = RATIO * WIDTH;
const SCALED_HEIGHT = RATIO * HEIGHT;
const CYCLE_LOOP = [0, 1, 0, 2];
//new variable that keeps track of the direction
const FACING_DOWN = 0;
const FACING_UP = 1;
const FACING_LEFT = 2;
const FACING_RIGHT = 3;
const FRAME_LIMIT = 12;
const MOVEMENT_SPEED = 1;

let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');
let keyPresses = {};
let currentDirection = FACING_DOWN;
let currentLoopIndex = 0;
let frameCount = 0;
//declare an array to store pressed keys
let positionX = 0;
let positionY = 0;
let img = new Image();

//listen for keydown
window.addEventListener('keydown', keyDownListener);
//function called each time a key is pressed 
function keyDownListener(event) {
    keyPresses[event.key] = true;
}

//listen to keyup
window.addEventListener('keyup', keyUpListener);

//function called each time a key is released 
function keyUpListener(event) {
    keyPresses[event.key] = false;
}

function loadImage() {
    img.src = "./images/character.png";
    img.onload = function () {
        window.requestAnimationFrame(gameLoop);
    };
}

function drawFrame(frameX, frameY, canvasX, canvasY) {
    ctx.drawImage(img, frameX * WIDTH, frameY * HEIGHT, WIDTH, HEIGHT, canvasX, canvasY, SCALED_WIDTH, SCALED_HEIGHT);
}

loadImage();

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let hasMoved = false;

    if (keyPresses.w) {
        moveCharacter(0, -MOVEMENT_SPEED, FACING_UP);
        hasMoved = true;
    } else if (keyPresses.s) {
        moveCharacter(0, MOVEMENT_SPEED, FACING_DOWN);
        hasMoved = true;
    }

    if (keyPresses.a) {
        moveCharacter(-MOVEMENT_SPEED, 0, FACING_LEFT);
        hasMoved = true;
    } else if (keyPresses.d) {
        moveCharacter(MOVEMENT_SPEED, 0, FACING_RIGHT);
        hasMoved = true;
    }

    //check is movement and increment frame counter
    if (hasMoved) {
        frameCount++;
        //reinit fram counter if limit is reached
        if (frameCount <= FRAME_LIMIT) {
            frameCount = 0;
            currentLoopIndex++;
            //reinit index to keep 0,1,0,2 series
            if (currentLoopIndex >= CYCLE_LOOP.length) {
                currentLoopIndex = 0;
            }
        }
    }

    if (!hasMoved) {
        currentLoopIndex = 0;
    }

    drawFrame(CYCLE_LOOP[currentLoopIndex], currentDirection, positionX, positionY);
    window.requestAnimationFrame(gameLoop);
}

function moveCharacter(deltaX, deltaY, direction) {

    //has the character reached a vertical border?
    if (positionX + deltaX > 0 && positionX + SCALED_WIDTH + deltaX < canvas.width) {
        positionX += deltaX;
    }

    //has the character reached the horizontal border?
    if (positionY + deltaY > 0 && positionY + SCALED_HEIGHT + deltaY < canvas.height) {
        positionY += deltaY;
    }

    currentDirection = direction;
}
