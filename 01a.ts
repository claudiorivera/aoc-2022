const input = await Deno.readTextFile("./01-input.txt");

const elves = input.split("\n\n");

let maxElfCalories = 0;

for (const elf of elves) {
  const elfCalories = elf.split("\n").reduce((acc, cur) => {
    return acc + parseInt(cur);
  }, 0);

  if (elfCalories > maxElfCalories) {
    maxElfCalories = elfCalories;
  }
}

console.log(maxElfCalories);
