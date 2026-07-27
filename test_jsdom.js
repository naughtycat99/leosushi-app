const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const html = fs.readFileSync('admin.html', 'utf8');

const virtualConsole = new jsdom.VirtualConsole();
virtualConsole.on("error", (err) => {
  console.log("JSDOM Error:", err);
});
virtualConsole.on("jsdomError", (err) => {
  console.log("JSDOM jsdomError:", err);
});
virtualConsole.on("log", (log) => {
    // console.log("JSDOM log:", log);
});

const dom = new JSDOM(html, {
    runScripts: "dangerously",
    virtualConsole
});

setTimeout(() => {
    console.log("filterOrdersByStatus type:", typeof dom.window.filterOrdersByStatus);
}, 2000);
