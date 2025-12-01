interface Instruction {
  direction: "L" | "R";
  distance: number;
}

function parseInput(input: string) {
  return input.split("\n").map(parseInstruction);
}

const INSTRUCTION_REGEX = /(L|R)(\d+)/;

function parseInstruction(instructionString: string): Instruction {
  const [isMatch, direction, distanceString] =
    instructionString.match(INSTRUCTION_REGEX) || [];

  if (!isMatch) {
    throw Error("Invalid instruction");
  }

  return {
    direction,
    distance: Number.parseInt(distanceString!),
  } as Instruction;
}

const DIAL_LENGTH = 100;

function getNewDialPosition(
  startingPosition: number,
  { direction, distance }: Instruction
) {
  const newPosition =
    direction === "R"
      ? startingPosition + distance
      : startingPosition + distance * -1;

  return newPosition % DIAL_LENGTH;
}

function getPassesOfZero(
  startingPosition: number,
  { direction, distance }: Instruction
) {
  if (direction === "R") {
    return Math.floor((startingPosition + distance) / DIAL_LENGTH);
  }

  const passes = Math.floor(
    (DIAL_LENGTH - startingPosition + distance) / DIAL_LENGTH
  );

  if (startingPosition === 0) {
    return Math.max(passes - 1, 0);
  }

  return passes;
}

function solvePartOne(input: string): number {
  let dialPosition = 50;
  let combination = 0;

  for (const instruction of parseInput(input)) {
    dialPosition = getNewDialPosition(dialPosition, instruction);

    if (dialPosition === 0) {
      combination++;
    }
  }

  return combination;
}

function solvePartTwo(input: string): number {
  let dialPosition = 50;
  let combination = 0;

  for (const instruction of parseInput(input)) {
    combination += getPassesOfZero(dialPosition, instruction);
    dialPosition = getNewDialPosition(dialPosition, instruction);
  }

  return combination;
}

const exampleInput = await Bun.file(`${__dirname}/example-input.txt`).text();
const actualInput = await Bun.file(`${__dirname}/input.txt`).text();

console.table({
  "Part 1": {
    Example: solvePartOne(exampleInput),
    Actual: solvePartOne(actualInput),
  },
  "Part 2": {
    Example: solvePartTwo(exampleInput),
    Actual: solvePartTwo(actualInput),
  },
});
