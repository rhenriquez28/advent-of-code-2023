const inputFile = Bun.file("day1/input.txt");
const input = await inputFile.text();

const lines = input.split("\n").map(String);
const calibrationValues: number[] = [];
const wordToDigit = {
  one: "o1e",
  two: "t2o",
  three: "thr3e",
  four: "f4ur",
  five: "f5ve",
  six: "s6x",
  seven: "s7ven",
  eight: "e8ght",
  nine: "n9ne",
} as const;

for (const line of lines) {
  let output: string = "";
  let parsedLine = line;

  Object.keys(wordToDigit).forEach((word) => {
    parsedLine = parsedLine.replaceAll(
      word,
      wordToDigit[word as keyof typeof wordToDigit]
    );
  });
  const numbers = parsedLine
    .split("")
    .filter((char) => !Number.isNaN(Number(char)));

  if (numbers.length === 0) {
    continue;
  }

  if (numbers.length === 1) {
    output = `${numbers[0]}${numbers[0]}`;
  } else {
    output = `${numbers[0]}${numbers[numbers.length - 1]}`;
  }
  calibrationValues.push(Number(output));
}

const sum = calibrationValues.reduce((a, b) => a + b, 0);
console.log(sum);
