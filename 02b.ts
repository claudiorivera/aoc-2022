const input = await Deno.readTextFile("./02-input.txt");

const RESULT = {
  LOSE: "LOSE",
  WIN: "WIN",
  DRAW: "DRAW",
} as const;

const SHAPE = {
  ROCK: "ROCK",
  PAPER: "PAPER",
  SCISSORS: "SCISSORS",
} as const;

type Shape = typeof SHAPE[keyof typeof SHAPE];

const SHAPE_MAP = {
  A: SHAPE.ROCK,
  B: SHAPE.PAPER,
  C: SHAPE.SCISSORS,
} as const;

type ShapeInput = keyof typeof SHAPE_MAP;

const STRATEGY_MAP = {
  X: RESULT.LOSE,
  Y: RESULT.DRAW,
  Z: RESULT.WIN,
} as const;

type StrategyInput = keyof typeof STRATEGY_MAP;

const POINTS_BY_SHAPE = {
  [SHAPE.ROCK]: 1,
  [SHAPE.PAPER]: 2,
  [SHAPE.SCISSORS]: 3,
} as const;

const POINTS_BY_RESULT = {
  [RESULT.LOSE]: 0,
  [RESULT.DRAW]: 3,
  [RESULT.WIN]: 6,
} as const;

const SHAPE_BY_STRATEGY = {
  [RESULT.LOSE]: {
    [SHAPE.ROCK]: SHAPE.SCISSORS,
    [SHAPE.PAPER]: SHAPE.ROCK,
    [SHAPE.SCISSORS]: SHAPE.PAPER,
  },
  [RESULT.DRAW]: {
    [SHAPE.ROCK]: SHAPE.ROCK,
    [SHAPE.PAPER]: SHAPE.PAPER,
    [SHAPE.SCISSORS]: SHAPE.SCISSORS,
  },
  [RESULT.WIN]: {
    [SHAPE.ROCK]: SHAPE.PAPER,
    [SHAPE.PAPER]: SHAPE.SCISSORS,
    [SHAPE.SCISSORS]: SHAPE.ROCK,
  },
};

const rounds = input
  .split("\n")
  .filter((round) => round)
  .map((round) => {
    const [them, us] = round.split(" ");
    return {
      them: them as ShapeInput,
      us: us as StrategyInput,
    };
  });

let myScore = 0;

for (const round of rounds) {
  const { them, us } = round;

  const ourShape = SHAPE_BY_STRATEGY[STRATEGY_MAP[us]][
    SHAPE_MAP[them]
  ] as Shape;

  myScore += POINTS_BY_SHAPE[ourShape];
  myScore += POINTS_BY_RESULT[STRATEGY_MAP[us]];
}

console.log({ myScore });
