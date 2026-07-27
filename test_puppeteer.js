const puppeteer = require('puppeteer');
(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    page.on('pageerror', (err) => {
        console.log('Page error:', err);
    });
    page.on('console', msg => {
        if (msg.type() === 'error') {
            console.log('Console error:', msg.text());
        }
    });
    await page.goto(process.argv[2], {waitUntil: 'networkidle2'});
    await browser.close();
})();
