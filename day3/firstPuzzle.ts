const inputFile = Bun.file("day3/input.txt");
const input = await inputFile.text();

type ParsedInput = string[];

type PartNumberSpecs = {
  firstIndex: number;
  lastIndex: number;
  lineIndex: number;
  isFirstLine: boolean;
  isLastLine: boolean;
};

const parsedInput = getParsedInput(input);
const digitRegex = /\d+/g;
let array: RegExpExecArray | null = null;
const partNumbers: number[] = [];

for (const line of parsedInput) {
  while ((array = digitRegex.exec(line)) !== null) {
    const partNumber = array[0];
    const partNumberLength = partNumber.length;
    const numberPartSpecs: PartNumberSpecs = {
      firstIndex: array.index,
      lastIndex: array.index + partNumberLength - 1,
      lineIndex: parsedInput.indexOf(line),
      isFirstLine: parsedInput.indexOf(line) === 0,
      isLastLine: parsedInput.indexOf(line) === parsedInput.length - 1,
    };

    if (partNumber === "315") {
      console.log(numberPartSpecs);
      console.log("on sides", hasSymbolOnSides(parsedInput, numberPartSpecs));
      console.log("up", hasSymbolUp(parsedInput, numberPartSpecs));
      console.log("down", hasSymbolDown(parsedInput, numberPartSpecs));
    }

    if (
      hasSymbolOnSides(parsedInput, numberPartSpecs) ||
      hasSymbolUp(parsedInput, numberPartSpecs) ||
      hasSymbolDown(parsedInput, numberPartSpecs)
    ) {
      partNumbers.push(Number(partNumber));
    }
  }
}

const answer = partNumbers.reduce((prev, curr) => prev + curr, 0);
console.log(partNumbers);
console.log(answer);

function hasSymbolOnSides(
  input: ParsedInput,
  numberPartSpecs: PartNumberSpecs
): boolean {
  const { firstIndex, lastIndex, lineIndex, isFirstLine, isLastLine } =
    numberPartSpecs;
  const leftBorderIndex = firstIndex - 1;
  const rightBorderIndex = lastIndex + 1;

  const hasSymbolOnDirectSides =
    isSymbol(input[lineIndex][leftBorderIndex]) ||
    isSymbol(input[lineIndex][rightBorderIndex]);
  const hasSymbolDiagonallyUp = !isFirstLine
    ? isSymbol(input[lineIndex - 1][leftBorderIndex]) ||
      isSymbol(input[lineIndex - 1][rightBorderIndex])
    : false;
  const hasSymbolDiagonallyDown = !isLastLine
    ? isSymbol(input[lineIndex + 1][leftBorderIndex]) ||
      isSymbol(input[lineIndex + 1][rightBorderIndex])
    : false;

  if (numberPartSpecs.firstIndex === 137 && numberPartSpecs.lineIndex === 16) {
    console.log(
      "hasSymbolOnDirectSides",
      isSymbol(input[lineIndex][leftBorderIndex]),
      input[lineIndex][rightBorderIndex]
    );
    console.log(
      "hasSymbolDiagonallyUp",
      isSymbol(input[lineIndex - 1][leftBorderIndex]),
      input[lineIndex - 1][rightBorderIndex]
    );
    console.log(
      "hasSymbolDiagonallyDown",
      isSymbol(input[lineIndex + 1][leftBorderIndex]),
      input[lineIndex + 1][rightBorderIndex]
    );
  }

  return (
    hasSymbolOnDirectSides || hasSymbolDiagonallyUp || hasSymbolDiagonallyDown
  );
}

function hasSymbolUp(
  input: ParsedInput,
  numberPartSpecs: PartNumberSpecs
): boolean {
  const { firstIndex, lastIndex, lineIndex, isFirstLine } = numberPartSpecs;
  if (isFirstLine) {
    return false;
  }

  for (let i = firstIndex; i <= lastIndex; i++) {
    if (isSymbol(input[lineIndex - 1][i])) {
      return true;
    }
  }

  return false;
}

function hasSymbolDown(
  input: ParsedInput,
  numberPartSpecs: PartNumberSpecs
): boolean {
  const { firstIndex, lastIndex, lineIndex, isLastLine } = numberPartSpecs;
  if (isLastLine) {
    return false;
  }

  for (let i = firstIndex; i <= lastIndex; i++) {
    if (isSymbol(input[lineIndex + 1][i])) {
      return true;
    }
  }

  return false;
}

function getParsedInput(input: string): ParsedInput {
  return input.split("\n");
}

function isDigit(char: string) {
  return /[0-9]/.test(char);
}

function isSymbol(char: string | undefined): boolean {
  return char !== undefined && char !== "." && !isDigit(char);
}
