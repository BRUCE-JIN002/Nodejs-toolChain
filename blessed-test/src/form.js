const blessed = require("blessed");

const screen = blessed.screen({
  fullUnicode: true
});

const prompt = blessed.prompt({
  parent: screen,
  border: "line",
  height: "shrink",
  width: "half",
  top: "center",
  left: "center",
  label: " {blue-fg}登录{/blue-fg} ",
  tags: true
});

const msg = blessed.message({
  parent: screen,
  border: "line",
  width: "half",
  height: "shrink",
  top: "center",
  left: "center",
  label: " {blue-fg}提示{/blue-fg} ",
  tags: true,
  hidden: true
});

prompt.input("你的名字?", "请输入你的名字", (err, username) => {
  prompt.input("你的密码?", "请输入你的密码", (err, password) => {
    if (username === "jin" && password === "123456") {
      msg.display("登录成功", 3, 0, () => {
        screen.destroy();
      });
    } else {
      msg.display("登录失败", 3, 0, () => {
        screen.destroy();
      });
    }

    setTimeout(() => {
      console.log(username, password);
    }, 2000);
  });
});

screen.key(["escape", "q", "C-c"], function (ch, key) {
  return process.exit(0);
});

screen.render();
