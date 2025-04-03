const minimist = require("minimist");
const args = minimist(process.argv.slice(2), {
  string: ["x"],
  boolean: ["y"],
  unknown(arg) {
    return arg === "-u";
  },
  default: {
    x: "foo",
    y: true,
  },
  alias: { p: "port", t: "template" },
});

console.log(args);
