import readline from "node:readline";

const repeatCount = process.stdout.rows - 2;

const blank = repeatCount > 0 ? "\n".repeat(repeatCount) : "";

console.log(blank);

readline.cursorTo(process.stdout, 0, 0);
readline.clearScreenDown(process.stdout);
