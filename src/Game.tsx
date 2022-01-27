import React from "react";
import useControls from "./useControls";
import "./Game.css";
import { storeScore } from "./scores";

type Point = { x: number; y: number };
type Size = { w: number; h: number };

const GRID_SIZE: Size = { w: 10, h: 10 }; // units
const TILE_SCALE: number = 50; // pixels
const TILE_VARIANT0_COLOR = "#fbf0dd";
const TILE_VARIANT1_COLOR = "#fff9ee";
const SNAKE_HEAD_COLOR = "green";
const FRUIT_COLOR = "deeppink";
const FPS = 2;

const nom2 = new Audio("/audio/nom2.mp3");
const ohoh = new Audio("/audio/ohoh.mp3");

nom2.load();
ohoh.load();

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
    (TILE_SCALE / 2) * 0.85,
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

function Game() {
  const [snake, setSnake] = React.useState([randomPosition()]);
  const [fruit, setFruit] = React.useState(randomPosition());
  const [alive, setAlive] = React.useState(false);
  const { delta } = useControls();

  const score = snake.length - 1;
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const reset = () => {
    setSnake([randomPosition()]);
    setFruit(randomPosition());
    setAlive(true);
  };

  React.useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }
    drawBoard(context);
  }, []);

  React.useEffect(() => {
    if (!alive && score > 0) {
      console.log("GAME OVER");
      navigator.vibrate(500);
      ohoh.play();
      storeScore(score);
    }
  }, [alive, score]);

  React.useEffect(() => {
    if (!alive) {
      return;
    }

    const render = () => {
      if (!canvasRef.current) {
        return;
      }

      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      if (!context) {
        return;
      }

      const nextSnake = calcNextSnake(snake, fruit, delta);

      if (isDead(nextSnake)) {
        console.log("DEATH");
        setAlive(false);
        return;
      }

      setSnake(nextSnake);

      drawBoard(context);
      drawFruit(context, fruit);
      drawSnake(context, nextSnake);

      if (isEating(nextSnake, fruit)) {
        nom2.play();
        const nextFruit = randomPosition();
        setFruit(nextFruit);
      }
    };

    const renderInterval = setInterval(render, 1000 / FPS);
    return () => clearInterval(renderInterval);
  }, [delta, snake, fruit, alive]);

  return (
    <div className="flex-fill d-flex flex-column justify-content-center align-items-center">
      <div className="position-relative mw-100 mh-100 d-flex justify-content-center align-items-center">
        <canvas
          className="canvas mw-100 mh-100"
          width={GRID_SIZE.w * TILE_SCALE}
          height={GRID_SIZE.h * TILE_SCALE}
          ref={canvasRef}
        />
        {!alive && (
          <button
            type="button"
            className="btn btn-lg btn-primary shadow-lg position-absolute"
            onClick={reset}
          >
            Play Snake
          </button>
        )}
      </div>
      <div className="m-3 fs-4 fw-bold">Score: {score}</div>
    </div>
  );
}

export default Game;
