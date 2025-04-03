import ansiEscapes from "ansi-escapes";
import { EOL } from "os";
import chalk from "chalk";

const write = process.stdout.write.bind(process.stdout);

export class ProgressBar {
  total: number = 0;
  value: number = 0;

  constructor() {}

  start(total: number, initValue: number) {
    this.total = total;
    this.value = initValue;

    write(ansiEscapes.cursorHide);
    write(ansiEscapes.cursorSavePosition); // save cursor position

    this.render();
  }

  render() {
    let progress = this.value / this.total;
    if (progress < 0) {
      progress = 0;
    } else if (progress > 1) {
      progress = 1;
      this.value = this.total; // set value to total to avoid rounding errors
    }

    const barSize = 40;
    const completeSize = Math.floor(barSize * progress);
    const incompleteSize = barSize - completeSize;

    write(ansiEscapes.cursorRestorePosition);
    write(chalk.greenBright("█").repeat(completeSize));
    write("░".repeat(incompleteSize));
    write(` ${Math.floor(progress * 100)}%`);
  }

  update(value: number) {
    this.value = value;
    this.render();
  }

  getTotalSize() {
    return this.total;
  }

  stop() {
    write(ansiEscapes.cursorShow); // show cursor
    write(EOL); // move cursor to next line
  }
}
