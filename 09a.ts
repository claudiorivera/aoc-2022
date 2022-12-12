const file = await Deno.readTextFile("./09-sample-input.txt");

const moves = file.split("\n").filter(Boolean);

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

const ROPE_NODE_TYPE = {
  HEAD: "HEAD",
  TAIL: "TAIL",
};

type RopeNodeType = typeof ROPE_NODE_TYPE[keyof typeof ROPE_NODE_TYPE];

class RopeNode {
  currentPosition: Position = { x: 0, y: 0 };
  nextPosition?: Position;
  type: RopeNodeType;
  positionsVisited: Set<Position> = new Set();

  constructor(type: RopeNodeType) {
    this.type = type;
  }

  move() {
    return;
  }

  getNumberOfPositionsVisited() {
    return this.positionsVisited.size;
  }

  private visitPosition(position: Position) {
    this.positionsVisited.add(position);
  }
}

class Rope {
  head: RopeNode;
  tail: RopeNode;

  constructor() {
    this.head = new RopeNode(ROPE_NODE_TYPE.HEAD);
    this.tail = new RopeNode(ROPE_NODE_TYPE.TAIL);
  }

  executeMove(move: Move) {
    const { direction, distance } = move;

    // this.tail.nextPosition = this.head.currentPosition;
    // this.head.nextPosition = this.getNextPosition(
    //   this.head.currentPosition,
    //   direction,
    //   distance
    // );

    // this.head.move();
    // this.tail.move();
  }

  private getNextPosition(
    currentPosition: Position,
    direction: Direction,
    distance: number
  ) {
    let nextPosition: Position;

    switch (direction) {
      case DIRECTION.UP:
        nextPosition = {
          x: currentPosition.x,
          y: currentPosition.y + distance,
        };
        break;
      case DIRECTION.DOWN:
        nextPosition = {
          x: currentPosition.x,
          y: currentPosition.y - distance,
        };
        break;
      case DIRECTION.LEFT:
        nextPosition = {
          x: currentPosition.x - distance,
          y: currentPosition.y,
        };
        break;
      case DIRECTION.RIGHT:
        nextPosition = {
          x: currentPosition.x + distance,
          y: currentPosition.y,
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

  const parsedMoves = moves.map((move) => {
    const moveParser = new MoveParser();
    return moveParser.parse(move);
  });

  for (const move of parsedMoves) {
    rope.executeMove(move);
  }

  console.log(rope.tail.getNumberOfPositionsVisited());
}

main();
