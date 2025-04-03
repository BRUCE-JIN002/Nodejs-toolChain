import EventEmitter from "events";
import readline from "node:readline";
let onKeypress;
export class Prompt extends EventEmitter {
    constructor() {
        super();
        this.value = "";
        readline.emitKeypressEvents(process.stdin);
        this.rl = readline.createInterface({ input: process.stdin });
        process.stdin.setRawMode(true);
        onKeypress = this.onKeypress.bind(this);
        process.stdin.on("keypress", onKeypress);
    }
    onKeypress(str, key) {
        if (key.sequence === "\u0003") {
            process.exit();
        }
        if (key.name === "return") {
            this.close();
            return;
        }
        this === null || this === void 0 ? void 0 : this.onKeyInput(str, key);
    }
    close() {
        process.stdout.write("\n");
        process.stdin.removeListener("keypress", onKeypress);
        process.stdin.setRawMode(false);
        this.rl.close();
        this.emit("submit", this.value);
    }
}
