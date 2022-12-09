const input = await Deno.readTextFile("./06-input.txt");

const letters = input.trim();

function main() {
  for (let i = 0; i < letters.length; i++) {
    if (i < 14) continue;
    if (i === letters.length - 1) return console.log(i);

    const charsToCheck = letters.slice(i - 14, i);

    if (!hasRepeatedChars(charsToCheck)) {
      return console.log(i);
    }
  }
}

main();

function hasRepeatedChars(charsToCheck: string) {
  const chars = new Set(charsToCheck.split(""));

  return !(charsToCheck.length === chars.size);
}
