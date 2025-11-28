const fs = require("fs");
const path = require("path");

const output = [];
const excludedDirs = ["node_modules", ".git", "dist", "build"]; // می‌تونی پوشه‌های بیشتری اضافه کنی

const walk = (dir) => {
  const files = fs.readdirSync(dir);
  for (let file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    // اگر یک دایرکتوری در لیست حذف‌ها بود، رد شو
    if (stat.isDirectory()) {
      if (excludedDirs.includes(file)) continue;
      walk(fullPath);
    } else if (
      file.endsWith(".js") ||
      file.endsWith(".jsx") ||
      file.endsWith(".ts") ||
      file.endsWith(".tsx") ||
      file.endsWith(".json")
    ) {
      const content = fs.readFileSync(fullPath, "utf8");
      output.push(`// ==== ${fullPath} ====\n${content}\n`);
    }
  }
};

walk(process.cwd()); // اجرای اسکریپت از پوشه جاری
fs.writeFileSync("project-export.txt", output.join("\n"), "utf8");
console.log("✅ Exported to project-export.txt (excluding node_modules)");
