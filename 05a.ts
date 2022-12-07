const input = await Deno.readTextFile("./05-input.txt");

const [stacksInput, instructionsInput] = input.split("\n\n");

const instructions = instructionsInput.split("\n").filter(Boolean);

const stackLines = stacksInput.split("\n").filter(Boolean).slice(0, -1);

const reversedStackLines = stackLines.reverse();

for (const line of reversedStackLines) {
  const regex = /(.{4}|.{3})/g;
  const cratesInLine = line.match(regex);
  console.log(cratesInLine);
}
