const blessed = require("blessed");
const contrib = require("blessed-contrib");

const screen = blessed.screen({
  fullUnicode: true
});

const map = contrib.map({
  label: "世界地图",
  width: "100%",
  height: "100%",
  border: "line",
  style: {
    border: {
      fg: "green"
    },
    text: {
      fg: "white"
    }
  }
});

screen.append(map);

map.addMarker({
  lon: "-79.0000",
  lat: "37.5000",
  color: "red",
  char: "❌"
});

map.addMarker({
  lon: "121.4737",
  lat: "31.2304",
  color: "red",
  char: "✅"
});

screen.key("C-c", function () {
  screen.destroy();
});

screen.render();
