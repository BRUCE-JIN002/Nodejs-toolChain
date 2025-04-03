import { clearInterval } from "timers";
import { ProgressBar } from "./progress-bar.js";
const bar = new ProgressBar();
bar.start(200, 0);
let value = 0;
const timer = setInterval(() => {
    value += 1;
    bar.update(value);
    if (value >= bar.getTotalSize()) {
        clearInterval(timer);
        bar.stop();
    }
}, 20);
