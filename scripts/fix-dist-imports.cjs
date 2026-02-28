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
  // Handle any relative import starting with a dot (./ or ../...)
  content = content.replace(/(from\s+['"])(\.[^'"\n]+?)(['"])/g, (m, p1, p2, p3) => {
    if (/\.[a-zA-Z0-9]+$/.test(p2)) return m;
    return p1 + p2 + '.js' + p3;
  });
  content = content.replace(/(import\(\s*['"])(\.[^'"\n]+?)(['"]\s*\))/g, (m, p1, p2, p3) => {
    if (/\.[a-zA-Z0-9]+$/.test(p2)) return m;
    return p1 + p2 + '.js' + p3;
  });
  fs.writeFileSync(file, content, 'utf8');
}

walk(path.join(__dirname, '..', 'dist'));
console.log('Fixed import paths in dist');

// Ensure root-level server imports point to dist/src when present
try {
  const serverPath = path.join(__dirname, '..', 'dist', 'server.js');
  if (fs.existsSync(serverPath)) {
    let srv = fs.readFileSync(serverPath, 'utf8');
    srv = srv.replace("import app from \"./app.js\";", "import app from \"./src/app.js\";");
    srv = srv.replace("import { prisma } from \"./lib/prisma.js\";", "import { prisma } from \"./src/lib/prisma.js\";");
    fs.writeFileSync(serverPath, srv, 'utf8');
    console.log('Patched root server imports to dist/src');
  }
} catch (e) {
  // ignore
}

// Report any remaining imports without `.js` to help debugging
try {
  const bad = [];
  const glob = require('glob');
  const files = glob.sync(path.join(__dirname, '..', 'dist', '**', '*.js'));
  for (const f of files) {
    const c = fs.readFileSync(f, 'utf8');
    if (/from\s+['"][^'"\n]+?\.\.?\//.test(c)) {
      // skip
    }
    const m = c.match(/from\s+['"](\.[^'"\n]+?)['"]/g);
    if (m) {
      for (const mm of m) {
        if (!/\.js['"]$/.test(mm)) bad.push(`${f}: ${mm}`);
      }
    }
  }
  if (bad.length) {
    console.log('Remaining imports without .js:');
    bad.slice(0, 50).forEach(x => console.log(x));
  }
} catch (e) {}

  // Replace common localhost fallbacks with production URLs to avoid
  // accidental local defaults in compiled files.
  try {
    const files = require('glob').sync(path.join(__dirname, '..', 'dist', '**', '*.js'));
    for (const f of files) {
      let c = fs.readFileSync(f, 'utf8');
      const before = c;
      c = c.replace(/http:\/\/localhost:3000/g, 'https://bhojonbox-client.vercel.app');
      // Replace template fallback like `http://localhost:${process.env.PORT || 5000}`
      c = c.replace(/process\.env\.BASE_URL\s*\|\|\s*`http:\/\/localhost:\$\{process\.env\.PORT\s*\|\|\s*5000\}`/g, 'process.env.BASE_URL || "https://bhojonbox-server.onrender.com"');
      c = c.replace(/process\.env\.FRONTEND_URL\s*\|\|\s*"http:\/\/localhost:3000"/g, 'process.env.FRONTEND_URL || "https://bhojonbox-client.vercel.app"');
      c = c.replace(/http:\/\/localhost:\d+/g, 'https://bhojonbox-server.onrender.com');
      if (c !== before) fs.writeFileSync(f, c, 'utf8');
    }
    console.log('Replaced localhost fallbacks in dist');
  } catch (e) {
    // ignore
  }
