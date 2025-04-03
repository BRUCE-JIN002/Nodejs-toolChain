import si from "systeminformation";
si.currentLoad((data) => {
    console.log(data);
});
