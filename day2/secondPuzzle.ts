const inputFile = Bun.file("day2/input.txt");
const input = await inputFile.text();

type ParsedInput = Map<number, ParsedInputValues[]>;

type ParsedInputValues = {
  blue: number;
  red: number;
  green: number;
};

const gamePowers: number[] = [];

const parsedInput = getParsedInput(input);

for (const [_, sessionValues] of parsedInput.entries()) {
  const blues = sessionValues.map((session) => session.blue);
  const reds = sessionValues.map((session) => session.red);
  const greens = sessionValues.map((session) => session.green);

  const maxBlue = Math.max(...blues);
  const maxRed = Math.max(...reds);
  const maxGreen = Math.max(...greens);
  gamePowers.push(maxBlue * maxRed * maxGreen);
}

const answer = gamePowers.reduce((prev, curr) => prev + curr, 0);
console.log(gamePowers);
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
