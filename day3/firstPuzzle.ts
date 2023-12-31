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
  const lineIndex = parsedInput.indexOf(line);
  const isFirstLine = lineIndex === 0;
  const isLastLine = lineIndex === parsedInput.length - 1;

  while ((array = digitRegex.exec(line)) !== null) {
    const partNumber = array[0];
    const partNumberLength = partNumber.length;
    const numberPartSpecs: PartNumberSpecs = {
      firstIndex: array.index,
      lastIndex: array.index + partNumberLength - 1,
      lineIndex,
      isFirstLine,
      isLastLine,
    };

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
