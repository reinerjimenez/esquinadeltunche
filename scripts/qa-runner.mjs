import { spawn } from "child_process";
import fs from "fs";
import path from "path";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const ARTIFACTS_DIR = path.resolve("artifacts", "final-qa");

if (!fs.existsSync(ARTIFACTS_DIR)) {
  fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runQA() {
  console.log("Starting Chrome for QA automation...");
  const tempProfile = path.resolve("artifacts", "temp-chrome-profile");
  if (!fs.existsSync(tempProfile)) {
    fs.mkdirSync(tempProfile, { recursive: true });
  }

  const chromeProc = spawn(CHROME_PATH, [
    "--headless=new",
    "--remote-debugging-port=9222",
    `--user-data-dir=${tempProfile}`,
    "--no-first-run",
    "--no-default-browser-check",
    "http://localhost:3000",
  ]);

  await sleep(2500);

  try {
    const listRes = await fetch("http://127.0.0.1:9222/json");
    const targets = await listRes.json();
    const pageTarget = targets.find((t) => t.type === "page");
    if (!pageTarget || !pageTarget.webSocketDebuggerUrl) {
      throw new Error("Could not find Chrome page target with WebSocket URL");
    }

    console.log("Connecting to Chrome DevTools Protocol at:", pageTarget.webSocketDebuggerUrl);
    const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);

    let messageId = 1;
    const pendingPromises = new Map();

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.id && pendingPromises.has(data.id)) {
        const { resolve, reject } = pendingPromises.get(data.id);
        pendingPromises.delete(data.id);
        if (data.error) reject(data.error);
        else resolve(data.result);
      }
    };

    await new Promise((resolve) => {
      ws.onopen = resolve;
    });

    function sendCommand(method, params = {}) {
      return new Promise((resolve, reject) => {
        const id = messageId++;
        pendingPromises.set(id, { resolve, reject });
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    await sendCommand("Page.enable");
    await sendCommand("Runtime.enable");

    async function evaluate(expression) {
      const res = await sendCommand("Runtime.evaluate", {
        expression,
        returnByValue: true,
        awaitPromise: true,
      });
      return res.result?.value;
    }

    async function setViewport(width, height, mobile = true, scale = 2) {
      await sendCommand("Emulation.setDeviceMetricsOverride", {
        width,
        height,
        deviceScaleFactor: scale,
        mobile,
      });
    }

    async function takeScreenshot(fileName) {
      const res = await sendCommand("Page.captureScreenshot", { format: "png" });
      const buffer = Buffer.from(res.data, "base64");
      const filePath = path.join(ARTIFACTS_DIR, fileName);
      fs.writeFileSync(filePath, buffer);
      console.log(`Saved screenshot: ${fileName} (${buffer.length} bytes)`);
    }

    // 1. Mobile Menu (390 x 844)
    console.log("Testing Mobile Menu (390 x 844)...");
    await setViewport(390, 844, true);
    await sendCommand("Page.navigate", { url: "http://localhost:3000" });
    await sleep(2000);

    // Scroll to category-selector so header + chips are visible
    await evaluate(`
      const target = document.getElementById("category-selector");
      if (target) {
        const headerHeight = document.getElementById("site-header")?.offsetHeight ?? 62;
        const top = target.getBoundingClientRect().top + window.scrollY - headerHeight;
        window.scrollTo({ top, behavior: "instant" });
      }
    `);
    await sleep(600);
    await takeScreenshot("mobile-menu.png");

    // 2. Open Category Selector Bottom Sheet
    console.log("Opening Category Sheet...");
    const clickedOpen = await evaluate(`
      const btn = document.getElementById("category-panel-toggle-btn");
      if (btn) { btn.click(); true; } else false;
    `);
    console.log("Clicked open category sheet:", clickedOpen);
    await sleep(600);
    await takeScreenshot("mobile-categories-open.png");

    // Verify category sheet is open and select a category (e.g. Makis)
    console.log("Selecting a category from sheet...");
    await evaluate(`
      const items = Array.from(document.querySelectorAll(".category-sheet-item"));
      const makisItem = items.find(el => el.textContent.includes("Makis"));
      if (makisItem) { makisItem.click(); true; } else false;
    `);
    await sleep(700);

    // 3. Dish cards view
    console.log("Capturing dish cards...");
    await evaluate(`
      const panel = document.getElementById("catalog-panel");
      if (panel) {
        const top = panel.getBoundingClientRect().top + window.scrollY - 120;
        window.scrollTo({ top: Math.max(0, top), behavior: "instant" });
      }
    `);
    await sleep(600);
    await takeScreenshot("mobile-dish-card.png");

    // 4. Add dish to cart and open cart sheet
    console.log("Adding dish to cart and opening Cart Sheet...");
    await evaluate(`
      const addBtn = document.querySelector(".dish-add");
      if (addBtn) addBtn.click();
    `);
    await sleep(500);

    await evaluate(`
      const cartBtn = document.getElementById("floating-cart-btn");
      if (cartBtn) cartBtn.click();
    `);
    await sleep(600);

    // Apply coupon CLUBTUNCHE in cart
    await evaluate(`
      const promoInput = document.querySelector('input[placeholder*="Código" i], input[placeholder*="CÓDIGO" i], input[placeholder*="cupón" i]');
      if (promoInput) {
        promoInput.value = "CLUBTUNCHE";
        promoInput.dispatchEvent(new Event("input", { bubbles: true }));
        const applyBtn = promoInput.nextElementSibling;
        if (applyBtn && applyBtn.tagName === "BUTTON") applyBtn.click();
      }
    `);
    await sleep(500);
    await takeScreenshot("mobile-cart.png");

    // Close cart sheet
    await evaluate(`
      const closeCartBtn = document.querySelector("#cart-sheet button");
      if (closeCartBtn) closeCartBtn.click();
    `);
    await sleep(500);

    // 5. Club del Tunche section
    console.log("Testing Club del Tunche...");
    await evaluate(`
      const club = document.getElementById("club-tunche");
      if (club) {
        const top = club.getBoundingClientRect().top + window.scrollY - 70;
        window.scrollTo({ top, behavior: "instant" });
      }
    `);
    await sleep(600);

    // Stamp loyalty card (+1 visit)
    await evaluate(`
      const stampBtn = document.getElementById("loyalty-add-visit-btn");
      if (stampBtn) stampBtn.click();
    `);
    await sleep(500);
    await takeScreenshot("mobile-club.png");

    // 6. Footer, map & share
    console.log("Testing Map & Footer...");
    await evaluate(`
      const footer = document.querySelector(".site-footer");
      if (footer) {
        const top = footer.getBoundingClientRect().top + window.scrollY - 320;
        window.scrollTo({ top: Math.max(0, top), behavior: "instant" });
      }
    `);
    await sleep(600);
    await takeScreenshot("mobile-footer.png");

    // 7. Desktop view (1440 x 900)
    console.log("Testing Desktop Menu (1440 x 900)...");
    await setViewport(1440, 900, false, 1);
    await sendCommand("Page.navigate", { url: "http://localhost:3000" });
    await sleep(1500);
    await evaluate(`
      const target = document.getElementById("category-selector");
      if (target) {
        const headerHeight = document.getElementById("site-header")?.offsetHeight ?? 62;
        const top = target.getBoundingClientRect().top + window.scrollY - headerHeight;
        window.scrollTo({ top: Math.max(0, top), behavior: "instant" });
      }
    `);
    await sleep(600);
    await takeScreenshot("desktop-menu.png");

    console.log("All screenshots captured successfully!");

    // Run tests across other requested resolutions
    const extraResolutions = [
      { w: 320, h: 667, name: "320x667" },
      { w: 360, h: 740, name: "360x740" },
      { w: 375, h: 812, name: "375x812" },
      { w: 430, h: 932, name: "430x932" },
      { w: 768, h: 1024, name: "768x1024" },
    ];

    for (const res of extraResolutions) {
      await setViewport(res.w, res.h, res.w < 768, 2);
      await sleep(300);
      const overflow = await evaluate(`
        document.documentElement.scrollWidth > document.documentElement.clientWidth
      `);
      console.log(`Resolution ${res.name} - Horizontal overflow: ${overflow ? "FAIL" : "PASS"}`);
    }

    ws.close();
  } finally {
    chromeProc.kill();
    try {
      fs.rmSync(tempProfile, { recursive: true, force: true });
    } catch {}
  }
}

runQA()
  .then(() => {
    console.log("QA runner completed successfully.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("QA runner error:", err);
    process.exit(1);
  });
