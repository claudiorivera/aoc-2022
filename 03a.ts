const input = await Deno.readTextFile("./03-input.txt");

const lowercaseAlphabet = [
  ...Array.from({ length: 26 }).map((_, i) => String.fromCharCode(i + 97)),
];

const uppercaseAlphabet = [
  ...Array.from({ length: 26 }).map((_, i) => String.fromCharCode(i + 65)),
];

const rucksacks = input.split("\n").filter((rucksack) => rucksack);

let totalPriority = 0;

for (const rucksack of rucksacks) {
  const [compartment1, compartment2] = splitRucksack(rucksack);
  const duplicateItem = findDuplicateItem(compartment1, compartment2);
  const priority = itemPriority(duplicateItem);
  totalPriority += priority;
}

console.log({ totalPriority });

function splitRucksack(rucksack: string) {
  const length = rucksack.length;
  const compartmentLength = Math.floor(length / 2);
  const compartment1 = rucksack.slice(0, compartmentLength);
  const compartment2 = rucksack.slice(compartmentLength, length);
  return [compartment1, compartment2];
}

function findDuplicateItem(compartment1: string, compartment2: string) {
  for (const item of compartment1) {
    if (compartment2.includes(item)) {
      return item;
    }
  }

  return "";
}

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
