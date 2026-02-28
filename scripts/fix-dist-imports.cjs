const fs = require('fs');
const path = require('path');

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) walk(full);
    else if (full.endsWith('.js')) fixFile(full);
  }
}

function fixFile(file) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/(from\s+['"])(\.\/[^'"\n]+?)(['"])/g, (m, p1, p2, p3) => {
    if (/\.[a-zA-Z0-9]+$/.test(p2)) return m;
    return p1 + p2 + '.js' + p3;
  });
  content = content.replace(/(import\(\s*['"])(\.\/[^'"\n]+?)(['"]\s*\))/g, (m, p1, p2, p3) => {
    if (/\.[a-zA-Z0-9]+$/.test(p2)) return m;
    return p1 + p2 + '.js' + p3;
  });
  fs.writeFileSync(file, content, 'utf8');
}

walk(path.join(__dirname, '..', 'dist'));
console.log('Fixed import paths in dist');
