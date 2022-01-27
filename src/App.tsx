import React from "react";
import useControls from "./useControls";
import "./App.css";

type Point = { x: number; y: number };
type Size = { w: number; h: number };

const GRID_SIZE: Size = { w: 10, h: 10 }; // units
const TILE_SCALE: number = 50; // pixels
const TILE_VARIANT0_COLOR = "wheat";
const TILE_VARIANT1_COLOR = "white";
const SNAKE_HEAD_COLOR = "green";
const FRUIT_COLOR = "red";
const FPS = 2;

function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

function drawBoard(context: CanvasRenderingContext2D) {
  for (var x = 0; x <= GRID_SIZE.w; x++) {
    for (var y = 0; y <= GRID_SIZE.h; y++) {
      context.beginPath();
      context.rect(x * TILE_SCALE, y * TILE_SCALE, TILE_SCALE, TILE_SCALE);

      const fillVariant = (x + y) % 2;
      context.fillStyle = fillVariant
        ? TILE_VARIANT0_COLOR
        : TILE_VARIANT1_COLOR;
      context.fill();
    }
  }
}

function drawSnake(context: CanvasRenderingContext2D, snake: Point[]) {
  // Draw snake
  for (let index = 1; index < snake.length; index++) {
    const snakePart = snake[index];
    const hue = mod(index * 10 + 100, 360);
    context.beginPath();
    context.rect(
      snakePart.x * TILE_SCALE,
      snakePart.y * TILE_SCALE,
      TILE_SCALE,
      TILE_SCALE
    );
    context.fillStyle = `hsl(${hue}, 100%, 30%)`;
    context.fill();
  }

  // Draw head
  const snakeHead = snake[0];
  context.beginPath();
  context.rect(
    snakeHead.x * TILE_SCALE,
    snakeHead.y * TILE_SCALE,
    TILE_SCALE,
    TILE_SCALE
  );
  context.fillStyle = SNAKE_HEAD_COLOR;
  context.fill();

  // Draw left eye
  context.beginPath();
  context.rect(
    snakeHead.x * TILE_SCALE + 0.2 * TILE_SCALE,
    snakeHead.y * TILE_SCALE + 0.2 * TILE_SCALE,
    TILE_SCALE / 10,
    TILE_SCALE / 10
  );
  context.fillStyle = "black";
  context.fill();

  // Draw right eye
  context.beginPath();
  context.rect(
    snakeHead.x * TILE_SCALE + 0.7 * TILE_SCALE,
    snakeHead.y * TILE_SCALE + 0.2 * TILE_SCALE,
    TILE_SCALE / 10,
    TILE_SCALE / 10
  );
  context.fillStyle = "black";
  context.fill();
}

function drawFruit(context: CanvasRenderingContext2D, fruit: Point) {
  context.beginPath();
  context.arc(
    fruit.x * TILE_SCALE + TILE_SCALE / 2,
    fruit.y * TILE_SCALE + TILE_SCALE / 2,
    TILE_SCALE / 2,
    0,
    2 * Math.PI
  );
  context.fillStyle = FRUIT_COLOR;
  context.fill();
}

function isEating(snake: Point[], fruit: Point) {
  return snake.some((e) => e.x === fruit.x && e.y === fruit.y);
}

function isDead(snake: Point[]) {
  return snake.length === 0;
}

function calcNextSnake(oldSnake: Point[], fruit: Point, delta: Point) {
  const currentHead: Point = oldSnake[0];
  const headless: Point[] = oldSnake.slice(1);

  if (isEating(headless, currentHead)) {
    console.log("DEATH");
    return [];
  }

  const newHead: Point = {
    x: mod(currentHead.x + delta.x, GRID_SIZE.w),
    y: mod(currentHead.y + delta.y, GRID_SIZE.h),
  };

  const newSnake = [newHead, ...oldSnake];

  if (newSnake.length > 1 && !isEating(newSnake, fruit)) {
    // Remove old tail
    newSnake.pop();
  }

  return newSnake;
}

function randomPosition() {
  return {
    x: Math.round(Math.random() * (GRID_SIZE.w - 1)),
    y: Math.round(Math.random() * (GRID_SIZE.h - 1)),
  } as Point;
}

function App() {
  const [snake, setSnake] = React.useState([randomPosition()]);
  const [fruit, setFruit] = React.useState(randomPosition());
  const { delta } = useControls();
  const gameOver = isDead(snake);

  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    if (gameOver) {
      console.log("GAME OVER");
      return;
    }

    const render = () => {
      const nextSnake = calcNextSnake(snake, fruit, delta);
      setSnake(nextSnake);

      if (isDead(nextSnake)) {
        return;
      }

      drawBoard(context);
      drawFruit(context, fruit);
      drawSnake(context, nextSnake);

      if (isEating(nextSnake, fruit)) {
        const nextFruit = randomPosition();
        setFruit(nextFruit);
      }
    };

    const renderInterval = setInterval(render, 1000 / FPS);
    return () => clearInterval(renderInterval);
  }, [delta, snake, fruit, gameOver]);

  return (
    <div className="app">
      <canvas
        className="canvas"
        width={GRID_SIZE.w * TILE_SCALE}
        height={GRID_SIZE.h * TILE_SCALE}
        ref={canvasRef}
      />
    </div>
  );
}

export default App;
