const fs = require("fs");
const path = require("path");

let errors = [];

// Check required files exist
const requiredFiles = ["index.html", "styles.css", "script.js", "assets/favicon.svg"];
requiredFiles.forEach((file) => {
  const fullPath = path.join(__dirname, file);
  if (!fs.existsSync(fullPath)) {
    errors.push(`Missing required file: ${file}`);
  }
});

// Read index.html
const indexPath = path.join(__dirname, "index.html");
if (fs.existsSync(indexPath)) {
  const html = fs.readFileSync(indexPath, "utf8");

  // Extract local href/src references
  const refRegex = /(?:href|src)=["']([^"']+)["']/g;
  let match;
  while ((match = refRegex.exec(html)) !== null) {
    const ref = match[1];
    // Skip external URLs and anchors
    if (ref.startsWith("http") || ref.startsWith("#") || ref.startsWith("mailto:")) continue;
    const fullPath = path.join(__dirname, ref);
    if (!fs.existsSync(fullPath)) {
      errors.push(`Broken local reference: ${ref}`);
    }
  }

  // Basic HTML structure checks
  if (!html.includes("<!doctype html>")) errors.push("Missing doctype");
  if (!html.includes("</html>")) errors.push("Missing closing </html>");
  if (!html.includes("<title>")) errors.push("Missing <title> tag");
  if (!html.includes('lang="es-MX"')) errors.push("Missing lang attribute");

  // Check for unclosed section tags
  const sectionOpen = (html.match(/<section/g) || []).length;
  const sectionClose = (html.match(/<\/section>/g) || []).length;
  if (sectionOpen !== sectionClose) {
    errors.push(`Unbalanced <section> tags: ${sectionOpen} open, ${sectionClose} close`);
  }

  // Check for unclosed div tags
  const divOpen = (html.match(/<div/g) || []).length;
  const divClose = (html.match(/<\/div>/g) || []).length;
  if (divOpen !== divClose) {
    errors.push(`Unbalanced <div> tags: ${divOpen} open, ${divClose} close`);
  }
}

// Read styles.css
const cssPath = path.join(__dirname, "styles.css");
if (fs.existsSync(cssPath)) {
  const css = fs.readFileSync(cssPath, "utf8");
  const braceOpen = (css.match(/{/g) || []).length;
  const braceClose = (css.match(/}/g) || []).length;
  if (braceOpen !== braceClose) {
    errors.push(`Unbalanced CSS braces: ${braceOpen} open, ${braceClose} close`);
  }
}

// Read script.js
const jsPath = path.join(__dirname, "script.js");
if (fs.existsSync(jsPath)) {
  const js = fs.readFileSync(jsPath, "utf8");
  try {
    new Function(js);
  } catch (e) {
    errors.push(`JavaScript syntax error: ${e.message}`);
  }
}

// Report
if (errors.length > 0) {
  console.error("BUILD FAILED — issues found:\n");
  errors.forEach((err) => console.error("  ✗ " + err));
  process.exit(1);
} else {
  console.log("BUILD PASSED — all checks succeeded:\n");
  console.log("  ✓ All required files present");
  console.log("  ✓ No broken local references");
  console.log("  ✓ HTML structure valid");
  console.log("  ✓ CSS braces balanced");
  console.log("  ✓ JavaScript syntax valid");
  process.exit(0);
}
