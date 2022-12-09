const input = await Deno.readTextFile("./05-input.txt");
const [crateInput, instructionsInput] = input.split("\n\n");

const NUMBER_OF_COLUMNS = 9;
const instructions = instructionsInput.split("\n").filter(Boolean);
const crates = crateInput.split("\n").filter(Boolean).slice(0, -1).reverse();
const stacks = new Array(NUMBER_OF_COLUMNS).fill([]) as Array<Array<string>>;

main();

function main() {
  buildInitialStacks();
  followInstructions();

  console.log(stacks.map((stack) => stack.pop()).join(""));
}

function followInstructions() {
  for (const instruction of instructions) {
    const [qty, from, to] = parseInstruction(instruction);

    moveCrates(qty, from, to);
  }
}

function buildInitialStacks() {
  for (const row in crates) {
    const rowIndex = Number(row);

    const columns = crates[rowIndex]
      .match(/(.{4}|.{3})/g)
      ?.map((column) => column.trim());

    const parsedColumns = columns?.map((column) => column.replace(/\W/g, ""));

    for (const column in parsedColumns) {
      const colIndex = Number(column);

      const crate = parsedColumns[colIndex];

      if (crate !== "") stacks[colIndex] = [...stacks[colIndex], crate];
    }
  }
}

function moveCrates(qty: number, from: number, to: number) {
  const cratesToMove: Array<string> = [];

  for (let i = 0; i < qty; i++) {
    const crateToPop = stacks[from - 1].pop();

    if (!crateToPop) throw new Error("No crate to pop");

    cratesToMove.push(crateToPop);
  }

  stacks[to - 1] = [...stacks[to - 1], ...cratesToMove.reverse()];
}

function parseInstruction(instruction: string) {
  const result = instruction.split(" ");

  const quantity = Number(result[1]);
  const from = Number(result[3]);
  const to = Number(result[5]);

  return [quantity, from, to];
}
