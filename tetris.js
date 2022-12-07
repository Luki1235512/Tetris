class Tetris {
    constructor(imageX, imageY, template) {

        this.imageX = imageX;
        this.imageY = imageY;
        this.template = template;
        this.x = squareCountX / 2;
        this.y = 0;
    }

    checkBottom() {
        for (let i = 0; i < this.template.length; i++) {
            for (let j = 0; j < this.template.length; j++) {
                if (this.template[i][j] === 0) {
                    continue;
                }
                const realX = i + this.getTruncatedPosition().x
                const realY = j + this.getTruncatedPosition().y
                if (realY + 1 >= squareCountY) {
                    return false;
                }
                if (gameMap[realY + 1][realX].imageX !== -1) {
                    return false;
                }
            }
        }
        return true;
    }

    getTruncatedPosition() {
        return {x: Math.trunc(this.x), y: Math.trunc(this.y)};
    }

    checkLeft() {

    }

    checkRight() {

    }

    moveRight() {

    }

    moveLeft() {

    }

    moveBottom() {

    }

    changeRotation() {

    }
}

const imageSquareSize = 24;
const size = 40;

const framePerSecond = 24;
const gameSpeed = 5;

const canvas = document.getElementById("canvas");
const image = document.getElementById("image");

const ctx = canvas.getContext("2d");

const squareCountX = canvas.width / size;
const squareCountY = canvas.height / size;

const shapes = [
    new Tetris(0, 120, [
        [0, 1, 0],
        [0, 1, 0],
        [1, 1, 0],
    ]),
    new Tetris(0, 96, [
        [0, 0, 0],
        [1, 1, 1],
        [0, 1, 0],
    ]),
    new Tetris(0, 72, [
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 1],
    ]),
    new Tetris(0, 48, [
        [0, 0, 0],
        [0, 1, 1],
        [1, 1, 0],
    ]),
    new Tetris(0, 24, [
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
    ]),
    new Tetris(0, 0, [
        [1, 1],
        [1, 1],
        [1, 1],
    ]),
    new Tetris(0, 48, [
        [0, 0, 0],
        [1, 1, 0],
        [0, 1, 1],
    ]),
];

let gameMap;
let gameOver;
let currentShape;
let nextShape;
let score;
let initialTwoDArr;

const whiteLineThickness = 4;

const gameLoop = () => {
    setInterval(update, 1000 / gameSpeed);
    setInterval(draw, 1000 / framePerSecond);
};

const update = () => {
    if (gameOver) {
        return;
    }
    if (currentShape.checkBottom()) {
        currentShape.y += 1;
    }
    else {
        for (let i = 0; i < currentShape.template.length; i++) {
            for (let j = 0; j < currentShape.template.length; j++) {
                if (currentShape.template[i][j] === 0) {
                    continue;
                }
                gameMap[currentShape.getTruncatedPosition().y + j][currentShape.getTruncatedPosition().x + i]
                    = {imageX: currentShape.imageX, imageY: currentShape.imageY};
            }
        }
        currentShape = nextShape;
        nextShape = getRandomShape();
    }
};

const drawRect = (x, y, width, height, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
};

const drawBackground = () => {
    drawRect(0, 0, canvas.width, canvas.height, "#bca0dc");
    for (let i = 0; i < squareCountX + 1; i++) {
        drawRect(size * i - whiteLineThickness, 0, whiteLineThickness, canvas.height, "white");
    }

    for (let i = 0; i < squareCountY + 1; i++) {
        drawRect(0, size * i - whiteLineThickness, canvas.width, whiteLineThickness, "white");
    }
};

const drawCurrentTetris = () => {
    for (let i = 0; i < currentShape.template.length; i++) {
        for (let j = 0; j < currentShape.template.length; j++) {
            if (currentShape.template[i][j] === 0) {
                continue;
            }
            ctx.drawImage(
                image,
                currentShape.imageX,
                currentShape.imageY,
                imageSquareSize,
                imageSquareSize,
                Math.trunc(currentShape.x) * size + size * i,
                Math.trunc(currentShape.y) * size + size * j,
                size,
                size
            );
        }
    }
};

const drawSquares = () => {
    for (let i = 0; i < gameMap.length; i++) {
        const t = gameMap[i];
        for (let j = 0; j < t.length; j++) {
            if (t[j].imageX === -1) {
                continue;
            }
            ctx.drawImage(image, t[j].imageX, t[j].imageY, imageSquareSize, imageSquareSize, j * size, i * size, size, size);
        }
    }
}

const drawNextShape = () => {

}

const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    drawSquares();
    drawCurrentTetris();
    drawNextShape();
    if (gameOver) {
        drawGameOver();
    }
};

const getRandomShape = () => {
    return Object.create(shapes[Math.floor(Math.random() * shapes.length)]);
};

const resetVars = () => {
    initialTwoDArr = [];
    for (let i = 0; i < squareCountY; i++) {
        let temp = [];
        for (let j = 0; j < squareCountX; j++) {
            temp.push({imageX: -1, imageY: -1});
        }
        initialTwoDArr.push(temp);
    }
    score = 0;
    gameOver = false;
    currentShape = getRandomShape();
    nextShape = getRandomShape();
    gameMap = initialTwoDArr;
};

resetVars();
gameLoop();

