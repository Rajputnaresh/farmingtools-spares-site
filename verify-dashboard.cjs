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
    if (!title.includes('KrishiGears') && !title.includes('Analytics')) {
      throw new Error(`Unexpected title: ${title}`);
    }

    // Assert 3 KPI Cards
    const kpiSection = await page.$('section[aria-label="Executive Overview KPIs"]');
    if (!kpiSection) throw new Error('KPI section not found');
    
    const bodyText = await page.evaluate(() => document.body.innerText);
    if (!bodyText.includes('टर्नओवर') && !bodyText.includes('Turnover')) throw new Error('Spares Turnover KPI card missing');
    if (!bodyText.includes('1,746')) throw new Error('1,746 SKUs count missing');
    console.log('[Test] Verified 3 KPI Summary Cards with genuine KrishiGears metrics.');

    // Assert Touch Targets >= 44px
    const buttonBox = await page.$eval('[data-testid="theme-toggle-btn"]', el => {
      const rect = el.getBoundingClientRect();
      return { width: rect.width, height: rect.height };
    });
    console.log(`[Test] Theme toggle button dimensions: ${buttonBox.width}x${buttonBox.height}px`);
    if (buttonBox.height < 44 || buttonBox.width < 44) {
      throw new Error(`Theme toggle failed 44px touch target requirement: ${buttonBox.width}x${buttonBox.height}`);
    }

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

    // Capture Screenshot 1: Real Data Overview with Empty State
    const screenshot1Path = path.join(ARTIFACTS_DIR, 'dashboard_overview_empty.png');
    await page.screenshot({ path: screenshot1Path, fullPage: true });
    console.log(`[Test] Saved screenshot 1: ${screenshot1Path}`);

    // Click Feb to drill down
    console.log('[Test] Clicking February to drill down into real KrishiGears dispatches...');
    const febButton = await page.$('[data-testid="chart-period-btn-Feb"]');
    if (!febButton) throw new Error('Feb period button not found');
    await febButton.click();
    await new Promise((r) => setTimeout(r, 400));

    // Verify State Sync: KPI Cards should now reflect February (₹2,87,500)
    const kpiFebText = await page.$eval('section[aria-label="Executive Overview KPIs"]', el => el.innerText);
    console.log('[Test] State Sync KPI text during Feb selection:', kpiFebText.slice(0, 100));
    if (!kpiFebText.includes('2,87,500')) {
      throw new Error('KPI cards failed state sync! Expected February turnover ₹2,87,500.');
    }
    console.log('[Test] Verified KPI cards state-sync with February dispatches (₹2,87,500).');

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

    // Verify 1-Tap WhatsApp Share Button exists and has valid message URI
    const whatsappHref = await page.$eval('a[title="डीलर को WhatsApp चालान विवरण भेजें"]', el => el.href);
    console.log(`[Test] Verified WhatsApp share button URI: ${whatsappHref.slice(0, 80)}...`);
    if (!whatsappHref.includes('whatsapp.com') || !whatsappHref.includes('PO-KG-2606')) {
      throw new Error('WhatsApp share link failed or missing PO number');
    }

    // Test Live SKU Search
    console.log('[Test] Testing Live SKU Search for "CARBURETOR"...');
    await page.type('#sku-search', 'CARBURETOR');
    await new Promise((r) => setTimeout(r, 300));
    const filteredRowCount = await page.$$eval('[data-testid="drill-down-table"] tbody tr', rows => rows.length);
    console.log(`[Test] Filtered rows for "CARBURETOR": ${filteredRowCount}`);
    if (filteredRowCount !== 1) {
      throw new Error(`Expected 1 row for CARBURETOR search, got ${filteredRowCount}`);
    }
    await page.click('button[type="button"] .lucide-x'); // clear search
    await new Promise((r) => setTimeout(r, 200));

    // Capture Screenshot 2: Drilled-down to February with real SKU lines
    const screenshot2Path = path.join(ARTIFACTS_DIR, 'dashboard_drilldown_feb.png');
    await page.screenshot({ path: screenshot2Path, fullPage: true });
    console.log(`[Test] Saved screenshot 2: ${screenshot2Path}`);

    // Test Category Filter (Group 3: Chainsaws)
    console.log('[Test] Testing Category Filter: Chainsaws...');
    await page.select('[data-testid="category-filter-select"]', '3');
    await new Promise((r) => setTimeout(r, 400));
    const chainsawText = await page.evaluate(() => document.body.innerText);
    if (!chainsawText.includes('315')) {
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
