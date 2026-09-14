const puppeteer = require('puppeteer');
const axeCore = require('axe-core');
(async () => {
  const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
  const page = await browser.newPage();
  await page.goto('http://localhost:5000', {waitUntil: 'networkidle0'});
  await page.addScriptTag({content: axeCore.source});
  const results = await page.evaluate(async () => {
    return await axe.run({
      runOnly: {type: 'tag', values: ['wcag2aa']}
    });
  });
  console.log(JSON.stringify(results, null, 2));
  await browser.close();
})();
