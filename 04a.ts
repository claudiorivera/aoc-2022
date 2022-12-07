const input = await Deno.readTextFile("./04-input.txt");

const pairs = input
  .split("\n")
  .filter((el) => el)
  .map((pair) => pair.split(","));

let overlapCount = 0;

for (const pair of pairs) {
  if (hasOverlap(pair)) {
    overlapCount++;
  }
}

console.log(overlapCount);

function hasOverlap(pair: string[]) {
  const [range1, range2] = pair;

  const [start1, end1] = range1.split("-").map((el) => parseInt(el));
  const [start2, end2] = range2.split("-").map((el) => parseInt(el));

  const range1ContainsRange2 = start2 >= start1 && end2 <= end1;
  const range2ContainsRange1 = start1 >= start2 && end1 <= end2;

  if (range1ContainsRange2 || range2ContainsRange1) return true;

  return false;
}
