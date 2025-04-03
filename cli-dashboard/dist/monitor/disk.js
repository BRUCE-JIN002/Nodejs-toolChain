import si from "systeminformation";
const colors = ["magenta", "cyan", "blue", "yellow", "green", "red"];
export class DiskMonitor {
    constructor(donut) {
        this.interval = null;
        this.donut = donut;
    }
    init() {
        const updater = () => {
            si.fsSize("", (data) => {
                this.updateData(data);
            });
        };
        updater();
        this.interval = setInterval(updater, 10000);
    }
    updateData(data) {
        const disk = data[0];
        const label = formatSize(disk.used) + " of " + formatSize(disk.size);
        this.donut.setData([
            {
                percent: disk.use / 100,
                label: label,
                color: "green"
            }
        ]);
        this.donut.render();
    }
}
function formatSize(bytes) {
    return (bytes / 1024 / 1024 / 1024).toFixed(2) + " GB";
}
