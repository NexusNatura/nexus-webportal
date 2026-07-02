const fs = require("fs");
const path = require("path");
let file = path.join(__dirname, "src/pages/OperatorDashboard.tsx");
if(fs.existsSync(file)) {
  let c = fs.readFileSync(file, "utf8");
  c = c.replace(/VÃ„NTAR/g, "VÄNTAR");
  fs.writeFileSync(file, c, "utf8");
}
let file2 = path.join(__dirname, "src/data/courseData.ts");
if(fs.existsSync(file2)) {
  let c2 = fs.readFileSync(file2, "utf8");
  c2 = c2.replace(/NybÃ¶rjare/g, "Nybörjare");
  fs.writeFileSync(file2, c2, "utf8");
}
console.log("Done");
