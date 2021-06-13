const fs = require("fs").promises;


const intervalTime = 1000 * 5; /* alle 5 sekunden */

module.exports = {
    rcp: null,
    init,
    reload
}

async function init() {
    await this.reload();
    setInterval(async () => {
        fs.writeFile("./data/rcp.json", JSON.stringify(this.rcp, null, 4));
    }, intervalTime);
}

async function reload() {
    this.rcp = JSON.parse(await fs.readFile("./data/rcp.json"));
}