"use strict";
const canvas = document.querySelector('canvas');
const ctx = canvas?.getContext('2d');
if (canvas && ctx) {
    // Consts
    const score = document.querySelector('.score--value');
    const finalScore = document.querySelector('.final-score > span');
    const menu = document.querySelector('.menu-screen');
    const buttonPlay = document.querySelector('.btn-play');
    // End Game
    let endGame = false;
    // Mobile
    const btnUp = document.getElementById('btnUp');
    const btnLeft = document.getElementById('btnLeft');
    const btnDown = document.getElementById('btnDown');
    const btnRight = document.getElementById('btnRight');
    // Audio
    const audio = new Audio('./audio.mp3');
    // CANVAS SIZE
    const CANVAS_WIDTH = canvas.width;
    const CANVAS_HEIGHT = canvas.height;
    // Snake size
    const size = 30;
    const initialPosition = { x: 240, y: 240 };
    let snake = [initialPosition];
    const incrementScore = () => {
        if (score) {
            score.innerText = `${+score.innerText + 10}`;
        }
    };
    const randomNumber = (min, max) => {
        return Math.round(Math.random() * (max - min) + min);
    };
    const randomPosition = () => {
        const number = randomNumber(0, CANVAS_WIDTH - size);
        return Math.round(number / 30) * 30;
    };
    const randomColor = () => {
        const red = randomNumber(0, 255);
        const green = randomNumber(0, 255);
        const blue = randomNumber(0, 255);
        return `rgb(${red}, ${green}, ${blue})`;
    };
    const food = {
        x: randomPosition(),
        y: randomPosition(),
        color: randomColor(),
    };
    let direction, loopId;
    const drawFood = () => {
        const { x, y, color } = food;
        ctx.shadowColor = color;
        ctx.shadowBlur = 6;
        ctx.fillStyle = color;
        ctx.fillRect(x, y, size, size);
        ctx.shadowBlur = 0;
    };
    const drawSnake = () => {
        ctx.fillStyle = '#ddd';
        snake.forEach((position, i) => {
            if (i == snake.length - 1) {
                ctx.fillStyle = 'white';
            }
            ctx.fillRect(position.x, position.y, size, size);
        });
    };
    const moveSnake = () => {
        if (!direction)
            return;
        const head = snake[snake.length - 1];
        switch (direction) {
            case 'right':
                snake.push({ x: head.x + size, y: head.y });
                break;
            case 'left':
                snake.push({ x: head.x - size, y: head.y });
                break;
            case 'down':
                snake.push({ x: head.x, y: head.y + size });
                break;
            case 'up':
                snake.push({ x: head.x, y: head.y - size });
                break;
            default:
                break;
        }
        // Remove the last "head" as the snake move
        snake.shift();
    };
    const drawGrid = () => {
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#191919';
        for (let i = size; i < CANVAS_WIDTH; i += size) {
            ctx.beginPath();
            ctx.lineTo(i, 0);
            ctx.lineTo(i, CANVAS_HEIGHT);
            ctx.stroke();
            ctx.beginPath();
            ctx.lineTo(0, i);
            ctx.lineTo(CANVAS_WIDTH, i);
            ctx.stroke();
        }
    };
    const checkEat = () => {
        const head = snake[snake.length - 1];
        if (head.x == food.x && head.y == food.y) {
            incrementScore();
            snake.push(head);
            audio.play();
            let x = randomPosition();
            let y = randomPosition();
            while (snake.find((position) => position.x == x && position.y == y)) {
                x = randomPosition();
                y = randomPosition();
            }
            food.x = x;
            food.y = y;
            food.color = randomColor();
        }
    };
    // Mobile Function
    const handleClick = (e) => {
        const target = e.target;
        switch (target.id) {
            case 'btnRight':
                if (direction != 'left') {
                    direction = 'right';
                }
                break;
            case 'btnLeft':
                if (direction != 'right') {
                    direction = 'left';
                }
                break;
            case 'btnDown':
                if (direction != 'up') {
                    direction = 'down';
                }
                break;
            case 'btnUp':
                if (direction != 'down') {
                    direction = 'up';
                }
                break;
            default:
                break;
        }
    };
    const mobileArrows = () => {
        if (btnUp && btnLeft && btnDown && btnRight && !endGame) {
            [btnUp, btnLeft, btnDown, btnRight].forEach((el) => {
                el.addEventListener('click', handleClick);
            });
        }
    };
    mobileArrows();
    const gameOver = () => {
        direction = undefined;
        endGame = true;
        [btnUp, btnLeft, btnDown, btnRight].forEach((el) => {
            el?.removeEventListener('click', handleClick);
        });
        if (menu && finalScore && score) {
            menu.style.display = 'flex';
            finalScore.innerText = score.innerText;
        }
        canvas.style.filter = 'blur(2px)';
    };
    const checkCollision = () => {
        const head = snake[snake.length - 1];
        const canvasLimit = canvas.width - size;
        const neckIndex = snake.length - 2;
        const wallCollision = head.x < 0 || head.x > canvasLimit || head.y < 0 || head.y > canvasLimit;
        const selfCollision = snake.find((position, i) => {
            return i < neckIndex && position.x == head.x && position.y == head.y;
        });
        if (wallCollision || selfCollision) {
            gameOver();
        }
    };
    let frames = 100;
    const gameLoop = () => {
        clearTimeout(loopId);
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        drawGrid();
        drawFood();
        moveSnake();
        drawSnake();
        checkEat();
        checkCollision();
        loopId = setTimeout(() => {
            gameLoop();
        }, frames);
    };
    gameLoop();
    document.addEventListener('keydown', ({ key }) => {
        switch (key) {
            case 'ArrowRight':
                if (direction != 'left') {
                    direction = 'right';
                }
                break;
            case 'ArrowLeft':
                if (direction != 'right') {
                    direction = 'left';
                }
                break;
            case 'ArrowDown':
                if (direction != 'up') {
                    direction = 'down';
                }
                break;
            case 'ArrowUp':
                if (direction != 'down') {
                    direction = 'up';
                }
                break;
            default:
                break;
        }
    });
    buttonPlay?.addEventListener('click', () => {
        if (score && menu) {
            score.innerText = '00';
            menu.style.display = 'none';
        }
        canvas.style.filter = 'none';
        endGame = false;
        mobileArrows();
        snake = [initialPosition];
    });
}
