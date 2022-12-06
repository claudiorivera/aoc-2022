const input = await Deno.readTextFile("./02-input.txt");

const OPPONENT_SHAPE_MAP = {
  X: "A",
  Y: "B",
  Z: "C",
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
      us: OPPONENT_SHAPE_MAP[us as keyof typeof OPPONENT_SHAPE_MAP],
    };
  });

let myScore = 0;

for (const round of rounds) {
  myScore += SHAPE_VALUE[round.us as keyof typeof SHAPE_VALUE];
  myScore +=
    WIN_MATRIX[round.us as keyof typeof WIN_MATRIX][
      round.them as keyof typeof WIN_MATRIX
    ];
}

console.log({ myScore });
