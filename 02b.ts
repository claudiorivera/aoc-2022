const input = await Deno.readTextFile("./02-input.txt");

const RESULT = {
  WIN: "WIN",
  LOSE: "LOSE",
  DRAW: "DRAW",
};

const STRATEGY_MAP = {
  X: RESULT.LOSE,
  Y: RESULT.DRAW,
  Z: RESULT.WIN,
};

const SHAPE_VALUE = {
  A: 1,
  B: 2,
  C: 3,
};

const WIN_VALUE = {
  LOSE: 0,
  DRAW: 3,
  WIN: 6,
};

const RESULT_MATRIX = {
  A: { A: RESULT.DRAW, B: RESULT.WIN, C: RESULT.LOSE },
  B: { A: RESULT.LOSE, B: RESULT.DRAW, C: RESULT.WIN },
  C: { A: RESULT.WIN, B: RESULT.LOSE, C: RESULT.DRAW },
};

const WIN_MATRIX = {
  A: { A: WIN_VALUE.DRAW, B: WIN_VALUE.LOSE, C: WIN_VALUE.WIN },
  B: { A: WIN_VALUE.WIN, B: WIN_VALUE.DRAW, C: WIN_VALUE.LOSE },
  C: { A: WIN_VALUE.LOSE, B: WIN_VALUE.WIN, C: WIN_VALUE.DRAW },
};

const rounds = input
  .split("\n")
  .filter((round) => round)
  .map((round) => {
    const [them, us] = round.split(" ");
    return {
      them,
      us,
    };
  });

let myScore = 0;

for (const round of rounds) {
  const { them, us } = round;

  const ourStrategy = STRATEGY_MAP[us as keyof typeof STRATEGY_MAP];
  const theirShape = RESULT_MATRIX[them as keyof typeof RESULT_MATRIX];

  const ourShape = Object.keys(theirShape).find(
    (key) => theirShape[key] === ourStrategy
  );

  const shapeValue = SHAPE_VALUE[ourShape as keyof typeof SHAPE_VALUE];
  myScore += shapeValue;
  const resultValue = WIN_MATRIX[ourShape][them];
  myScore += resultValue;

  console.log({ shapeValue, myScore, resultValue });
}
