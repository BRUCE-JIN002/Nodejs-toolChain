import readLine from "readline";
readLine.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true); // 禁用掉内置的一些键盘事件处理
process.stdin.on("keypress", (str, key) => {
    if (key.ctrl && key.name === "c") {
        process.exit();
    }
    else {
        console.log(`You pressed the "${str}" key`, key);
    }
});
