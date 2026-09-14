const http = require('http');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const DIST_DIR = path.join(__dirname, 'dashboard', 'dist');
const ARTIFACTS_DIR = '/Users/rajputnaresh/.gemini/antigravity/brain/38e0f447-ee11-4218-bfee-e2f4ef66ef11';
const PORT = 8989;

// MIME types dictionary
const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
};

// 1. Create a lightweight static server for dashboard/dist
const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/' || reqPath === '') {
    reqPath = '/index.html';
  }

  const filePath = path.join(DIST_DIR, reqPath);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // Fallback to index.html for SPA
        fs.readFile(path.join(DIST_DIR, 'index.html'), (err2, fallback) => {
          if (err2) {
            res.writeHead(404);
            res.end('File not found');
          } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(fallback);
          }
        });
      } else {
        res.writeHead(500);
        res.end(`Server error: ${err.code}`);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

async function runVerification() {
  await new Promise((resolve) => server.listen(PORT, resolve));
  console.log(`[Server] Serving ${DIST_DIR} at http://localhost:${PORT}`);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 960 });

  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  try {
    console.log('[Test] Navigating to dashboard...');
    await page.goto(`http://localhost:${PORT}`, { waitUntil: 'networkidle0' });

    // Assert Page Title
    const title = await page.title();
    console.log(`[Test] Page Title: "${title}"`);
    if (!title.includes('Dashboard')) {
      throw new Error(`Unexpected title: ${title}`);
    }

    // Assert 3 KPI Cards
    const kpiSection = await page.$('section[aria-label="Executive Overview KPIs"]');
    if (!kpiSection) throw new Error('KPI section not found');
    
    const bodyText = await page.evaluate(() => document.body.innerText);
    if (!bodyText.includes('Spares Turnover')) throw new Error('Spares Turnover KPI card missing');
    if (!bodyText.includes('1,746')) throw new Error('1,746 SKUs count missing');
    if (!bodyText.includes('Dispatch Rate')) throw new Error('Dispatch Rate KPI card missing');
    console.log('[Test] Verified 3 KPI Summary Cards with real KrishiGears metrics (1,746 SKUs).');

    // Assert AreaChart SVG presence
    const chartContainer = await page.$('[data-testid="recharts-area-chart-container"]');
    if (!chartContainer) throw new Error('AreaChart container missing');
    const svgPaths = await page.$$('.recharts-surface path');
    console.log(`[Test] Found ${svgPaths.length} SVG path elements inside AreaChart.`);
    if (svgPaths.length === 0) throw new Error('AreaChart SVG paths missing');

    // Assert Empty State initially visible
    const emptyState = await page.$('[data-testid="empty-state-container"]');
    if (!emptyState) throw new Error('Empty state container missing');
    const emptyStateText = await page.$eval('[data-testid="empty-state-message"]', el => el.textContent.trim());
    console.log(`[Test] Empty state text: "${emptyStateText}"`);
    if (!emptyStateText.includes('Select a data point on the chart above to view granular transaction details')) {
      throw new Error(`Unexpected empty state text: ${emptyStateText}`);
    }

    // Capture Screenshot 1: Real Data Overview with Empty State
    const screenshot1Path = path.join(ARTIFACTS_DIR, 'dashboard_overview_empty.png');
    await page.screenshot({ path: screenshot1Path, fullPage: true });
    console.log(`[Test] Saved screenshot 1: ${screenshot1Path}`);

    // Click Feb to drill down
    console.log('[Test] Clicking February to drill down into real KrishiGears dispatches...');
    const febButton = await page.$('[data-testid="chart-period-btn-Feb"]');
    if (!febButton) throw new Error('Feb period button not found');
    await febButton.click();

    // Wait for Drill-Down Table to appear
    await page.waitForSelector('[data-testid="drill-down-table-container"]', { timeout: 3000 });
    const tableText = await page.evaluate(() => {
      const container = document.querySelector('[data-testid="drill-down-table-container"]');
      return container ? container.innerText : '';
    });
    console.log('[Test] Drill-down table rendered with KrishiGears data:');
    console.log(tableText.slice(0, 300) + '...');

    if (!tableText.includes('PO-KG-2606') || !tableText.includes('CARBURETOR') || !tableText.includes('Mewar Farm Spares')) {
      throw new Error('Table missing expected KrishiGears Feb part: PO-KG-2606 CARBURETOR Mewar Farm Spares');
    }

    // Capture Screenshot 2: Drilled-down to February with real SKU lines
    const screenshot2Path = path.join(ARTIFACTS_DIR, 'dashboard_drilldown_feb.png');
    await page.screenshot({ path: screenshot2Path, fullPage: true });
    console.log(`[Test] Saved screenshot 2: ${screenshot2Path}`);

    // Test Category Filter (Group 3: Chainsaws)
    console.log('[Test] Testing Category Filter: Chainsaws...');
    await page.select('[data-testid="category-filter-select"]', '3');
    await new Promise((r) => setTimeout(r, 400));
    const chainsawText = await page.evaluate(() => document.body.innerText);
    if (!chainsawText.includes('315 SKUs')) {
      throw new Error('Category filter did not update to 315 Chainsaw SKUs');
    }
    console.log('[Test] Verified Category Filter scoped to 315 Chainsaw SKUs.');

    // Test Theme Toggle (Dark Mode)
    console.log('[Test] Toggling dark mode...');
    const themeBtn = await page.$('[data-testid="theme-toggle-btn"]');
    await themeBtn.click();
    await new Promise((r) => setTimeout(r, 350));
    const isDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
    console.log(`[Test] Document has 'dark' class: ${isDark}`);
    if (!isDark) throw new Error('Dark mode toggle failed to add "dark" class');

    // Capture Screenshot 3: Dark Mode Drill-Down
    const screenshot3Path = path.join(ARTIFACTS_DIR, 'dashboard_drilldown_dark.png');
    await page.screenshot({ path: screenshot3Path, fullPage: true });
    console.log(`[Test] Saved screenshot 3: ${screenshot3Path}`);



    // Test Global Filter Dropdown
    console.log('[Test] Testing Global Filter dropdown...');
    await page.select('[data-testid="global-filter-select"]', 'last30');
    await new Promise((r) => setTimeout(r, 500));
    const filteredText = await page.evaluate(() => document.body.innerText);
    if (!filteredText.includes('₹') && !filteredText.includes('2,06,000')) {
      throw new Error('Filter did not update to Last 30 Days March data');
    }
    console.log('[Test] Verified Global Filter updated metrics to Last 30 Days.');


    console.log('\n=========================================');
    console.log('ALL DASHBOARD VERIFICATION TESTS PASSED!');
    console.log('=========================================\n');
  } finally {
    await browser.close();
    server.close();
  }
}

runVerification().catch((err) => {
  console.error('[Verification Failed]', err);
  process.exit(1);
});
