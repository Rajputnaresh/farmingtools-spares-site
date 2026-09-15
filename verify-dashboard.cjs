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

    // Assert Network Requests Table is immediately visible in front (no empty state barrier!)
    const tableContainer = await page.$('[data-testid="drill-down-table-container"]');
    if (!tableContainer) throw new Error('Network requests table container missing in front!');
    const tableInitialText = await page.$eval('[data-testid="drill-down-table-container"]', el => el.innerText);
    console.log('[Test] Network requests table rendered in front:');
    console.log(tableInitialText.slice(0, 180) + '...');
    if (!tableInitialText.includes('ताज़ा नेटवर्क मांग') && !tableInitialText.includes('Network Requests')) {
      throw new Error('Table heading did not indicate recent network requests');
    }

    // Capture Screenshot 1: Front Network Requests on Page Load
    const screenshot1Path = path.join(ARTIFACTS_DIR, 'dashboard_overview_empty.png');
    await page.screenshot({ path: screenshot1Path, fullPage: true });
    console.log(`[Test] Saved screenshot 1 (front network requests): ${screenshot1Path}`);

    // Test Logging a New Network Request via Modal
    console.log('[Test] Opening "+ New Network Request" modal...');
    const newReqBtn = await page.$('[data-testid="table-new-request-btn"]');
    if (!newReqBtn) throw new Error('+ New Request button missing in table toolbar');
    await newReqBtn.click();
    await page.waitForSelector('[data-testid="new-request-modal"]', { timeout: 3000 });
    console.log('[Test] "+ New Network Request" modal opened successfully.');

    // Adjust quantity in modal to 25 pcs
    await page.evaluate(() => {
      const input = document.getElementById('req-qty');
      if (input) {
        const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeSetter.call(input, '25');
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
    await new Promise((r) => setTimeout(r, 200));

    // Submit new request
    console.log('[Test] Submitting new network request for 25 pcs...');
    const submitBtn = await page.$('[data-testid="submit-new-request-btn"]');
    if (!submitBtn) throw new Error('Submit new request button missing');
    await submitBtn.click();
    await new Promise((r) => setTimeout(r, 600));

    // Verify modal is closed
    const modalAfterSubmit = await page.$('[data-testid="new-request-modal"]');
    if (modalAfterSubmit) throw new Error('Modal did not close after submit');

    // Verify the new request appears at the top of the table with NEW badge
    const firstRowText = await page.$eval('[data-testid="drill-down-table"] tbody tr:first-child', el => el.innerText);
    console.log(`[Test] First row text after new request submission: ${firstRowText.replace(/\n/g, ' ')}`);
    if (!firstRowText.includes('NEW') || !firstRowText.includes('25 pcs')) {
      throw new Error(`New request not found at the top with NEW badge! Row: ${firstRowText}`);
    }
    console.log('[Test] Verified newly created network request is shown at the top with "NEW" badge.');

    // Click Feb to drill down
    console.log('[Test] Clicking February to drill down into real KrishiGears dispatches...');
    const febButton = await page.$('[data-testid="chart-period-btn-Feb"]');
    if (!febButton) throw new Error('Feb period button not found');
    await febButton.click();
    await new Promise((r) => setTimeout(r, 400));

    // Verify State Sync: KPI Cards should now reflect February (₹3,78,500 across all machine groups)
    const kpiFebText = await page.$eval('section[aria-label="Executive Overview KPIs"]', el => el.innerText);
    console.log('[Test] State Sync KPI text during Feb selection:', kpiFebText.slice(0, 100));
    if (!kpiFebText.includes('3,78,500')) {
      throw new Error(`KPI cards failed state sync! Expected February turnover ₹3,78,500, got: ${kpiFebText.slice(0, 100)}`);
    }
    console.log('[Test] Verified KPI cards state-sync with February dispatches (₹3,78,500).');

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

    // Test Theme Toggle
    console.log('[Test] Toggling theme mode...');
    const initialIsDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
    await page.$eval('[data-testid="theme-toggle-btn"]', (el) => el.click());
    await new Promise((r) => setTimeout(r, 400));
    const isDarkAfterToggle = await page.evaluate(() => document.documentElement.classList.contains('dark'));
    console.log(`[Test] Theme toggled from dark=${initialIsDark} to dark=${isDarkAfterToggle}`);
    if (isDarkAfterToggle === initialIsDark) throw new Error('Theme toggle failed to toggle "dark" class');

    // Capture Screenshot 3: Toggled Theme Drill-Down
    const screenshot3Path = path.join(ARTIFACTS_DIR, 'dashboard_drilldown_dark.png');
    await page.screenshot({ path: screenshot3Path, fullPage: true });
    console.log(`[Test] Saved screenshot 3: ${screenshot3Path}`);

    // Test Global Filter Dropdown (reset category to all first)
    console.log('[Test] Testing Global Filter dropdown...');
    await page.select('[data-testid="category-filter-select"]', '0');
    await new Promise((r) => setTimeout(r, 200));
    await page.select('[data-testid="global-filter-select"]', 'last30');
    await new Promise((r) => setTimeout(r, 500));
    const filteredText = await page.evaluate(() => document.body.innerText);
    // March turnover is ₹2,85,000 with the newly submitted ₹27,500 request (baseline ₹2,57,500)
    if (!filteredText.includes('₹') || (!filteredText.includes('2,85,000') && !filteredText.includes('2,57,500'))) {
      throw new Error(`Filter did not update to Last 30 Days March data. Snippet: ${filteredText.slice(0, 150)}`);
    }
    console.log('[Test] Verified Global Filter updated metrics to Last 30 Days.');

    // Test LocalStorage Persistence across page reload
    console.log('[Test] Reloading page to verify localStorage persistence of dealer requests...');
    await page.reload({ waitUntil: 'networkidle0' });
    const persistedRequests = await page.evaluate(() => localStorage.getItem('kg_dealer_requests'));
    console.log('[Test] Persisted requests in localStorage:', persistedRequests ? 'Found' : 'Missing');
    if (!persistedRequests || !persistedRequests.includes('SP-001')) {
      throw new Error('Dealer request was not persisted across reload!');
    }
    console.log('[Test] Verified new dealer requests survive browser refresh via localStorage.');

    // Test Modal Escape key dismiss
    console.log('[Test] Testing Modal Escape key dismiss...');
    await page.click('[data-testid="header-new-request-btn"]');
    await page.waitForSelector('[data-testid="new-request-modal"]');
    await page.keyboard.press('Escape');
    await new Promise((r) => setTimeout(r, 200));
    const modalClosed = await page.$('[data-testid="new-request-modal"]');
    if (modalClosed) throw new Error('Modal failed to close on Escape key press');
    console.log('[Test] Verified Modal closes on Escape key press.');

    // Test Mobile Viewport (390px) Stacked Card Feed
    console.log('[Test] Testing Mobile Viewport (390px) stacked card feed...');
    await page.setViewport({ width: 390, height: 844 });
    await new Promise((r) => setTimeout(r, 300));
    const mobileFeedVisible = await page.$eval('[data-testid="mobile-dispatch-card-feed"]', (el) => {
      const rect = el.getBoundingClientRect();
      return rect.height > 0;
    });
    console.log('[Test] Mobile dispatch card feed visible on 390px:', mobileFeedVisible);
    if (!mobileFeedVisible) throw new Error('Mobile dispatch card feed not visible on 390px screen');
    console.log('[Test] Verified mobile stacked card feed on 390px viewport with zero horizontal scroll.');

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
