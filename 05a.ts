const input = await Deno.readTextFile("./05-input.txt");

const [crateInput, instructionsInput] = input.split("\n\n");

const NUMBER_OF_COLUMNS = 9;

const instructions = instructionsInput.split("\n").filter(Boolean);

const rows = crateInput.split("\n").filter(Boolean).slice(0, -1).reverse();

const stacks = new Array(NUMBER_OF_COLUMNS).fill([]);

for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
  const regex = /(.{4}|.{3})/g;

  const rowOfCrates = rows[rowIndex].match(regex);

  if (!rowOfCrates) throw new Error("Unable to parse crates");

  const columns = rowOfCrates.map((row) => row.replace(/\W/g, ""));

  for (let colIndex = 0; colIndex < columns.length; colIndex++) {
    const crate = columns[colIndex];

    if (crate !== "") stacks[colIndex] = [...stacks[colIndex], crate];
  }
}

console.log({ stacks });
