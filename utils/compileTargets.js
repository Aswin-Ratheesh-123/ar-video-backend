const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const IMAGES_DIR = path.join(__dirname, "../uploads/images");
const OUTPUT = path.join(__dirname, "../public/targets.mind");

async function compileTargets() {
  console.log("🔄 Auto compiling targets...");

  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  await page.goto(
    "https://hiukim.github.io/mind-ar-js-doc/tools/compile/",
    { waitUntil: "networkidle2" }
  );

  const files = fs.readdirSync(IMAGES_DIR)
    .map(f => path.join(IMAGES_DIR, f));

  const input = await page.$('input[type="file"]');
  await input.uploadFile(...files);

  await page.click("button"); // compile button

  const downloadPath = path.join(__dirname, "../public");

  await page._client().send("Page.setDownloadBehavior", {
    behavior: "allow",
    downloadPath,
  });

  await new Promise(r => setTimeout(r, 5000));

  await browser.close();

  console.log("✅ targets.mind updated");
}

module.exports = compileTargets;
