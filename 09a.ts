const file = await Deno.readTextFile("./09-input.txt");

const inputLines = file.split("\n").filter(Boolean);

type Position = {
  x: number;
  y: number;
};

const DIRECTION = {
  UP: "U",
  DOWN: "D",
  LEFT: "L",
  RIGHT: "R",
} as const;

type Direction = typeof DIRECTION[keyof typeof DIRECTION];

class RopeNode {
  position: Position;
  positionsVisited: Set<string>;

  constructor() {
    const initialPosition = { x: 0, y: 0 };
    this.position = initialPosition;
    this.positionsVisited = new Set();
    this.positionsVisited.add(this.positionToString(initialPosition));
  }

  getNumberOfPositionsVisited() {
    return this.positionsVisited.size;
  }

  visitPosition(position: Position) {
    this.position = position;
    this.positionsVisited.add(this.positionToString(position));
  }

  private positionToString(position: Position) {
    return `${position.x},${position.y}`;
  }
}

class Rope {
  head = new RopeNode();
  tail = new RopeNode();

  executeMove(move: Move) {
    const { direction, distance } = move;

    for (let i = 0; i < distance; i++) {
      this.moveOrthogonaly(direction, this.head);

      if (!this.isTailAdjacentToHead()) {
        this.moveTail(direction);
      }
    }
  }

  private moveTail(direction: Direction) {
    if (this.isTailOrthoginalToHead()) {
      this.moveOrthogonaly(direction, this.tail);
    } else {
      this.moveDiagonally();
    }
  }

  private moveDiagonally() {
    const nextPosition = this.getNextDiagonalPosition();

    this.tail.visitPosition(nextPosition);
  }

  private getNextDiagonalPosition() {
    const nextPosition = {
      ...this.tail.position,
    };

    if (this.head.position.x > this.tail.position.x) {
      nextPosition.x += 1;
    } else if (this.head.position.x < this.tail.position.x) {
      nextPosition.x -= 1;
    }

    if (this.head.position.y > this.tail.position.y) {
      nextPosition.y += 1;
    } else if (this.head.position.y < this.tail.position.y) {
      nextPosition.y -= 1;
    }

    return nextPosition;
  }

  private isTailDiagonalToHead() {
    return (
      Math.abs(this.head.position.x - this.tail.position.x) === 1 &&
      Math.abs(this.head.position.y - this.tail.position.y) === 1
    );
  }

  private isTailOrthoginalToHead() {
    return (
      (this.head.position.x === this.tail.position.x &&
        Math.abs(this.head.position.y - this.tail.position.y) === 1) ||
      (this.head.position.y === this.tail.position.y &&
        Math.abs(this.head.position.x - this.tail.position.x) === 1)
    );
  }

  private isTailEqualToHead() {
    return (
      this.head.position.x === this.tail.position.x &&
      this.head.position.y === this.tail.position.y
    );
  }

  private isTailAdjacentToHead() {
    return (
      this.isTailDiagonalToHead() ||
      this.isTailOrthoginalToHead() ||
      this.isTailEqualToHead()
    );
  }

  private moveOrthogonaly(direction: Direction, node: RopeNode) {
    const nextPosition = this.getNextOrthoginalPosition(
      node.position,
      direction,
      1
    );

    node.visitPosition(nextPosition);
  }

  private getNextOrthoginalPosition(
    position: Position,
    direction: Direction,
    distance: number
  ) {
    let nextPosition: Position;

    switch (direction) {
      case DIRECTION.UP:
        nextPosition = {
          x: position.x,
          y: position.y + distance,
        };
        break;
      case DIRECTION.DOWN:
        nextPosition = {
          x: position.x,
          y: position.y - distance,
        };
        break;
      case DIRECTION.LEFT:
        nextPosition = {
          x: position.x - distance,
          y: position.y,
        };
        break;
      case DIRECTION.RIGHT:
        nextPosition = {
          x: position.x + distance,
          y: position.y,
        };
        break;
    }

    return nextPosition;
  }
}

class MoveParser {
  public parse(input: string) {
    const move = input.replace(/ /g, "");
    const direction = this.getDirection(move);
    const distance = this.getDistance(move);

    if (!(direction && distance)) throw new Error("Invalid move 😿");

    return new Move(direction, distance);
  }

  private getDirection(move: string) {
    switch (move[0]) {
      case "U":
        return DIRECTION.UP;
      case "D":
        return DIRECTION.DOWN;
      case "L":
        return DIRECTION.LEFT;
      case "R":
        return DIRECTION.RIGHT;
    }
  }

  private getDistance(move: string) {
    return parseInt(move.slice(1));
  }
}

class Move {
  direction: Direction;
  distance: number;

  constructor(direction: Direction, distance: number) {
    this.direction = direction;
    this.distance = distance;
  }
}

function main() {
  const rope = new Rope();
  const moveParser = new MoveParser();

  const moves = inputLines.map((line) => {
    return moveParser.parse(line);
  });

  for (const move of moves) {
    rope.executeMove(move);
  }

  console.log(rope.tail.getNumberOfPositionsVisited());
}

main();
