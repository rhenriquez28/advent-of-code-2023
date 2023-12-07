const inputFile = Bun.file("day3/input.txt");
const input = await inputFile.text();

type ParsedInput = string[];

interface ItemSpecs {
  lineIndex: number;
  isFirstLine: boolean;
  isLastLine: boolean;
}

interface GearSpecs extends ItemSpecs {
  index: number;
}

interface PartNumberSpecs extends ItemSpecs {
  firstIndex: number;
  lastIndex: number;
}
const parsedInput = getParsedInput(input);
const gearRegex = /\*/g;
let gearArray: RegExpExecArray | null = null;
let partNumberArray: RegExpExecArray | null = null;
const gearRatios: number[] = [];

for (const line of parsedInput) {
  const lineIndex = parsedInput.indexOf(line);
  const isFirstLine = lineIndex === 0;
  const isLastLine = lineIndex === parsedInput.length - 1;
  while ((gearArray = gearRegex.exec(line)) !== null) {
    const gearSpecs: GearSpecs = {
      index: gearArray.index,
      lineIndex,
      isFirstLine,
      isLastLine,
    };

    const [partNumber1, partNumber2] = findAdjacentPartNumbers(
      parsedInput,
      gearSpecs
    );
    console.log(partNumber1, partNumber2);
    if (partNumber1 !== undefined && partNumber2 !== undefined) {
      gearRatios.push(partNumber1 * partNumber2);
    }
  }
}

const answer = gearRatios.reduce((prev, curr) => prev + curr, 0);
console.log(gearRatios);
console.log(answer);

function findAdjacentPartNumbers(
  input: ParsedInput,
  gearSpecs: GearSpecs
): [number | undefined, number | undefined] {
  const { index, lineIndex, isFirstLine, isLastLine } = gearSpecs;
  const [leftSideNumber, rightSideNumber] = findPartNumberOnDirectSides(input, {
    gearIndex: index,
    lineIndex,
  });
  const topSideNumber = !isFirstLine
    ? findPartNumberOnParallelSide(input, {
        gearIndex: index,
        lineIndex,
        side: "top",
      })
    : null;
  const bottomSideNumber = !isLastLine
    ? findPartNumberOnParallelSide(input, {
        gearIndex: index,
        lineIndex,
        side: "bottom",
      })
    : null;

  const adjNumbers = [
    leftSideNumber,
    rightSideNumber,
    topSideNumber,
    bottomSideNumber,
  ];
  if (lineIndex === 136) {
    console.log(adjNumbers);
  }
  if (adjNumbers.every((n) => n === null)) {
    return [undefined, undefined];
  }

  return adjNumbers.filter((num) => num !== null) as [
    number | undefined,
    number | undefined
  ];
}

function findPartNumberOnParallelSide(
  parsedInput: ParsedInput,
  {
    gearIndex,
    lineIndex,
    side,
  }: { gearIndex: number; lineIndex: number; side: "top" | "bottom" }
): number | null {
  const digitRegex = /\d+/g;
  const parallelLineIndex = side === "top" ? lineIndex - 1 : lineIndex + 1;
  const parallelLine = parsedInput[parallelLineIndex];
  const leftSideIndex = gearIndex - 1;
  const rightSideIndex = gearIndex + 1;

  let partNumberArray: RegExpExecArray | null = null;
  while ((partNumberArray = digitRegex.exec(parallelLine)) !== null) {
    const partNumber = partNumberArray[0];
    const partNumberFirstIndex = partNumberArray.index;
    const partNumberLastIndex = partNumberFirstIndex + partNumber.length - 1;

    /*if (side === "bottom") {
      console.log("partNumberArray", partNumberArray);
      console.log("parallelLine", parallelLine);
      console.log("partNumber", partNumber);
      console.log("partNumberFirstIndex", partNumberFirstIndex);
      console.log("partNumberLastIndex", partNumberLastIndex);
      console.log("leftSideIndex", leftSideIndex);
      console.log("rightSideIndex", rightSideIndex);
    }*/

    if (
      (partNumberFirstIndex >= leftSideIndex &&
        partNumberFirstIndex <= rightSideIndex) ||
      (partNumberLastIndex >= leftSideIndex &&
        partNumberLastIndex <= rightSideIndex)
    ) {
      return Number(partNumber);
    }
  }

  return null;
}

function findPartNumberOnDirectSides(
  parsedInput: ParsedInput,
  { gearIndex, lineIndex }: { gearIndex: number; lineIndex: number }
): [number | null, number | null] {
  const digitRegex = /\d+/g;
  const gearLine = parsedInput[lineIndex];
  const leftSide = gearLine[gearIndex - 1];
  const rightSide = gearLine[lineIndex][gearIndex + 1];

  let leftResult: number | null = null;
  let rightResult: number | null = null;

  if (lineIndex === 136) {
    console.log([Number(leftSide), Number(rightSide)]);
  }

  if ([Number(leftSide), Number(rightSide)].every(Number.isNaN)) {
    if (lineIndex === 136) {
      console.log("I'm here");
    }
    return [null, null];
  }

  if (lineIndex === 136) {
    console.log("isNan", Number.isNaN(Number(leftSide)) === false);
  }

  if (Number.isNaN(Number(leftSide)) === false) {
    if (lineIndex === 136) {
      console.log("I'm here left");
    }
    let leftPartNumberArray: RegExpExecArray | null = null;
    while ((leftPartNumberArray = digitRegex.exec(gearLine)) !== null) {
      const partNumber = leftPartNumberArray[0];
      if (lineIndex === 136) {
        console.log("leftPartNumberArray", leftPartNumberArray);
      }
      const leftPartNumberLastIndex =
        leftPartNumberArray.index + partNumber.length - 1;
      if (leftPartNumberLastIndex === gearIndex - 1) {
        leftResult = Number(partNumber);
        break;
      }
    }
  }

  if (Number.isNaN(Number(rightSide)) === false) {
    let rightPartNumberArray: RegExpExecArray | null = null;
    while ((rightPartNumberArray = digitRegex.exec(gearLine)) !== null) {
      const partNumber = rightPartNumberArray[0];
      const rightPartNumberFirstIndex = rightPartNumberArray.index;
      if (rightPartNumberFirstIndex === gearIndex + 1) {
        rightResult = Number(partNumber);
        break;
      }
    }
  }

  return [leftResult, rightResult];
}

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
