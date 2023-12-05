const inputFile = Bun.file("day2/input.txt");
const input = await inputFile.text();

type ParsedInput = Map<number, ParsedInputValues[]>;

type ParsedInputValues = {
  blue: number;
  red: number;
  green: number;
};

const maxCubeNumberPerGame: ParsedInputValues = {
  blue: 14,
  red: 12,
  green: 13,
} as const;

const possibleGameIds: number[] = [];

const parsedInput = getParsedInput(input);

for (const [id, sessionValues] of parsedInput.entries()) {
  if (
    sessionValues.every(
      (values) =>
        values.blue <= maxCubeNumberPerGame.blue &&
        values.green <= maxCubeNumberPerGame.green &&
        values.red <= maxCubeNumberPerGame.red
    )
  ) {
    possibleGameIds.push(id);
  }
}

const answer = possibleGameIds.reduce((prev, curr) => prev + curr, 0);
console.log(possibleGameIds);
console.log(answer);

function getParsedInput(input: string): ParsedInput {
  const parsedInput: ParsedInput = new Map<number, ParsedInputValues[]>();
  const lines = input.split("\n");

  for (const line of lines) {
    const [idPart, sessionsPart] = line.split(": ");
    const id = Number(idPart.split(" ")[1]);
    const sessions = sessionsPart.split("; ");
    const sessionValues = sessions.map((session) => {
      const values = session.split(", ");
      return values.reduce(
        (prev: ParsedInputValues, curr: string) => {
          const [value, key] = curr.split(" ");
          return {
            ...prev,
            [key]: prev[key as keyof ParsedInputValues] + Number(value),
          };
        },
        {
          blue: 0,
          red: 0,
          green: 0,
        } satisfies ParsedInputValues
      );
    });

    parsedInput.set(id, sessionValues);
  }

  return parsedInput;
}
