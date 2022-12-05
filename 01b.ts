const input = await Deno.readTextFile("./01-input.txt");

const elves = input.split("\n\n");

const leaderboard = [];

for (const elf of elves) {
  const elfCalories = elf.split("\n").reduce((acc, cur) => {
    return acc + parseInt(cur);
  }, 0);

  leaderboard.push(elfCalories);
}

const sortedLeaderboard = leaderboard.sort((a, b) => b - a);

const top3 = sortedLeaderboard.slice(0, 3);

const total = top3.reduce((acc, cur) => {
  return acc + cur;
}, 0);

console.log(total);
