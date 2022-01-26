import React from "react";
import "./App.css";

type Vec2 = [number, number];

const GRID_SIZE: Vec2 = [10, 10]; // units
const TILE_SIZE: Vec2 = [50, 50]; // pixels
const TILE_VARIANT0_COLOR = "wheat";
const TILE_VARIANT1_COLOR = "white";
const SNAKE_BODY_COLOR = "lime";
const SNAKE_HEAD_COLOR = "green";
const FRUIT_COLOR = "red";

const TEST_SNAKE: Vec2[] = [
  [2, 2],
  [1, 2],
  [1, 1],
];

const TEST_FRUIT: Vec2 = [4, 4];

function App() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  function drawBoard(context: CanvasRenderingContext2D) {
    for (var x = 0; x <= GRID_SIZE[0]; x++) {
      for (var y = 0; y <= GRID_SIZE[0]; y++) {
        context.beginPath();
        context.rect(
          x * TILE_SIZE[0],
          y * TILE_SIZE[1],
          TILE_SIZE[0],
          TILE_SIZE[1]
        );

        const fillVariant = (x + y) % 2;
        context.fillStyle = fillVariant
          ? TILE_VARIANT0_COLOR
          : TILE_VARIANT1_COLOR;
        context.fill();
      }
    }
  }

  function drawSnake(context: CanvasRenderingContext2D, snake: Vec2[]) {
    // Draw snake
    for (const snakePart of snake) {
      context.beginPath();
      context.rect(
        snakePart[0] * TILE_SIZE[0],
        snakePart[1] * TILE_SIZE[1],
        TILE_SIZE[0],
        TILE_SIZE[1]
      );
      context.fillStyle = SNAKE_BODY_COLOR;
      context.fill();
    }

    // Draw head again
    const snakeHead = snake[0];
    context.beginPath();
    context.rect(
      snakeHead[0] * TILE_SIZE[0],
      snakeHead[1] * TILE_SIZE[1],
      TILE_SIZE[0],
      TILE_SIZE[1]
    );
    context.fillStyle = SNAKE_HEAD_COLOR;
    context.fill();
  }

  function drawFruit(context: CanvasRenderingContext2D, fruit: Vec2) {
    context.beginPath();
    context.rect(
      fruit[0] * TILE_SIZE[0],
      fruit[1] * TILE_SIZE[1],
      TILE_SIZE[0],
      TILE_SIZE[1]
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
        width={GRID_SIZE[0] * TILE_SIZE[0]}
        height={GRID_SIZE[1] * TILE_SIZE[1]}
        ref={canvasRef}
      />
    </div>
  );
}

export default App;
