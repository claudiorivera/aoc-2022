const input = await Deno.readTextFile("./03-input.txt");

const lowercaseAlphabet = [
  ...Array.from({ length: 26 }).map((_, i) => String.fromCharCode(i + 97)),
];

const uppercaseAlphabet = [
  ...Array.from({ length: 26 }).map((_, i) => String.fromCharCode(i + 65)),
];

const rucksacks = input.split("\n").filter((rucksack) => rucksack);

const rucksackGroups = Array.from({ length: rucksacks.length / 3 }).map(
  (_, i) => rucksacks.slice(i * 3, i * 3 + 3)
);

let totalPriority = 0;

for (const rucksackGroup of rucksackGroups) {
  const badge = findBadge(rucksackGroup);
  const priority = itemPriority(badge);
  totalPriority += priority;
}

console.log(totalPriority);

function itemPriority(item: string) {
  const isLowercase = lowercaseAlphabet.includes(item);
  const isUppercase = uppercaseAlphabet.includes(item);

  if (isLowercase) {
    return lowercaseAlphabet.indexOf(item) + 1;
  }

  if (isUppercase) {
    return uppercaseAlphabet.indexOf(item) + 1 + 26;
  }

  return 0;
}

function findBadge(rucksackGroup: Array<string>) {
  for (const item of rucksackGroup[0]) {
    if (rucksackGroup[1].includes(item) && rucksackGroup[2].includes(item)) {
      return item;
    }
  }

  return "";
}
