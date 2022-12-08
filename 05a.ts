const input = await Deno.readTextFile("./05-input.txt");

const [crateInput, instructionsInput] = input.split("\n\n");

const NUMBER_OF_COLUMNS = 9;

const instructions = instructionsInput.split("\n").filter(Boolean);

const rows = crateInput.split("\n").filter(Boolean).slice(0, -1).reverse();

const columns = new Array(NUMBER_OF_COLUMNS).fill([]);

for (const i in rows) {
  const regex = /(.{4}|.{3})/g;
  const rowOfCrates = rows[i].match(regex);

  if (!rowOfCrates) throw new Error("Unable to parse crates");

  const crates = rowOfCrates.map((row) => row.replace(/\W/g, ""));
  console.log({ crates });

  for (const crate of crates) {
    const colIndex = crates.indexOf(crate);
    columns[colIndex][i] = crate;
    console.log({ crate, colIndex, crates, rows });
  }
}
console.log({ columns });
