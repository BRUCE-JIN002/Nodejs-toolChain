import { BaseUi } from "./base-ui.js";
import ansiEscapes from "ansi-escapes";
import chalk from "chalk";
export class ScrollList extends BaseUi {
    constructor(list = []) {
        super();
        this.list = list;
        this.curSeletecIndex = 0;
        this.scrollTop = 0;
        this.KEYS = {
            up: () => this.cursorUp(),
            down: () => this.cursorDown()
        };
        this.render();
    }
    onKeyInput(name) {
        if (name !== "up" && name !== "down") {
            return;
        }
        const action = this.KEYS[name];
        action();
        this.render();
    }
    cursorUp() {
        this.moveCursor(-1);
    }
    cursorDown() {
        this.moveCursor(1);
    }
    moveCursor(index) {
        this.curSeletecIndex += index;
        if (this.curSeletecIndex < 0) {
            this.curSeletecIndex = 0;
        }
        if (this.curSeletecIndex >= this.list.length) {
            this.curSeletecIndex = this.list.length - 1;
        }
        this.fitScroll();
    }
    fitScroll() {
        const shouldScrollUp = this.curSeletecIndex < this.scrollTop;
        const shouldScrollDown = this.curSeletecIndex > this.scrollTop + this.terminalSize.rows - 1;
        if (shouldScrollUp) {
            this.scrollTop -= 1;
        }
        if (shouldScrollDown) {
            this.scrollTop += 1;
        }
        this.clear();
    }
    clear() {
        for (let row = 0; row < this.terminalSize.rows; row++) {
            this.clearLine(row);
        }
    }
    getStringWidth(str) {
        return [...str].reduce((width, char) => {
            // 检查是否是全角字符（包括中文、日文、韩文等）
            return (width +
                (char.match(/[\u4e00-\u9fa5]|[\uff00-\uffff]|[\u3000-\u303f]|[\u3040-\u309f]|[\u30a0-\u30ff]|[\u3130-\u318f]|[\uac00-\ud7af]/)
                    ? 2
                    : 1));
        }, 0);
    }
    bgRow(text) {
        return chalk.bgBlue(text + " ".repeat(this.terminalSize.columns - this.getStringWidth(text)));
    }
    render() {
        // 计算当前可见的列表项，根据滚动位置和终端行数进行切片
        const visibleList = this.list.slice(this.scrollTop, // 起始索引，当前滚动位置
        this.scrollTop + this.terminalSize.rows // 结束索引，当前滚动位置加上终端的行数
        );
        // 遍历可见的列表项
        visibleList.forEach((item, index) => {
            const row = index;
            this.clearLine(row);
            let content = item;
            if (this.curSeletecIndex === this.scrollTop + index) {
                content = this.bgRow(content);
            }
            this.printAt(content, {
                x: 0,
                y: row
            });
        });
        process.stdout.write(ansiEscapes.cursorHide);
    }
}
