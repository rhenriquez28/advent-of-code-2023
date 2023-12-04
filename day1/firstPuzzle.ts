const inputFile = Bun.file("day1/input.txt");
const input = await inputFile.text();

const lines = input.split("\n").map(String);
const calibrationValues: number[] = [];

for (const line of lines) {
  let output: string = "";
  const numbers = line.split("").filter((char) => !Number.isNaN(Number(char)));

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
