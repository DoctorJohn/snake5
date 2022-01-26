import React from "react";
import "./App.css";

type Point = { x: number; y: number };
type Size = { w: number; h: number };

const GRID_SIZE: Size = { w: 10, h: 10 }; // units
const TILE_SIZE: Size = { w: 50, h: 50 }; // pixels
const TILE_VARIANT0_COLOR = "wheat";
const TILE_VARIANT1_COLOR = "white";
const SNAKE_BODY_COLOR = "lime";
const SNAKE_HEAD_COLOR = "green";
const FRUIT_COLOR = "red";

const TEST_SNAKE: Point[] = [
  { x: 2, y: 2 },
  { x: 1, y: 2 },
  { x: 1, y: 1 },
];

const TEST_FRUIT: Point = { x: 4, y: 4 };

function App() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  function drawBoard(context: CanvasRenderingContext2D) {
    for (var x = 0; x <= GRID_SIZE.w; x++) {
      for (var y = 0; y <= GRID_SIZE.h; y++) {
        context.beginPath();
        context.rect(
          x * TILE_SIZE.w,
          y * TILE_SIZE.h,
          TILE_SIZE.w,
          TILE_SIZE.h
        );

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
    for (const snakePart of snake) {
      context.beginPath();
      context.rect(
        snakePart.x * TILE_SIZE.w,
        snakePart.y * TILE_SIZE.h,
        TILE_SIZE.w,
        TILE_SIZE.h
      );
      context.fillStyle = SNAKE_BODY_COLOR;
      context.fill();
    }

    // Draw head again
    const snakeHead = snake[0];
    context.beginPath();
    context.rect(
      snakeHead.x * TILE_SIZE.w,
      snakeHead.y * TILE_SIZE.h,
      TILE_SIZE.w,
      TILE_SIZE.h
    );
    context.fillStyle = SNAKE_HEAD_COLOR;
    context.fill();
  }

  function drawFruit(context: CanvasRenderingContext2D, fruit: Point) {
    context.beginPath();
    context.rect(
      fruit.x * TILE_SIZE.w,
      fruit.y * TILE_SIZE.h,
      TILE_SIZE.w,
      TILE_SIZE.h
    );
    context.fillStyle = FRUIT_COLOR;
    context.fill();
  }

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
    drawSnake(context, TEST_SNAKE);
    drawFruit(context, TEST_FRUIT);
  }, []);

  return (
    <div>
      <canvas
        className="canvas"
        width={GRID_SIZE.w * TILE_SIZE.w}
        height={GRID_SIZE.h * TILE_SIZE.h}
        ref={canvasRef}
      />
    </div>
  );
}

export default App;
