const fs = require("fs");
const path = require("path");

const replacements = {
  "Ã„": "Ä",
  "Ã¤": "ä",
  "Ã–": "Ö",
  "Ã¶": "ö",
  "Ã…": "Å",
  "Ã¥": "å",
  "Ã©": "é"
};

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith(".tsx") || fullPath.endsWith(".ts")) {
      let content = fs.readFileSync(fullPath, "utf-8");
      let modified = false;
      for (const [bad, good] of Object.entries(replacements)) {
        if (content.includes(bad)) {
          content = content.split(bad).join(good);
          modified = true;
        }
      }
      if (modified) {
        fs.writeFileSync(fullPath, content, "utf-8");
      }
    }
  }
}

walkDir(path.join(__dirname, "src"));
console.log("Fixed double encoding");
