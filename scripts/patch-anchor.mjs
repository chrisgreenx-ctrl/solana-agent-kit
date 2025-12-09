#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');
const anchorEsmPath = path.join(rootDir, 'node_modules/@coral-xyz/anchor/dist/esm/index.js');
const anchorPkgPath = path.join(rootDir, 'node_modules/@coral-xyz/anchor/package.json');

console.log('Patching @coral-xyz/anchor for ESM compatibility...');

try {
  let content = fs.readFileSync(anchorEsmPath, 'utf8');
  
  const originalExport = 'export { default as BN } from "bn.js";';
  const patchedExport = `import BN_default from "bn.js";
export const BN = BN_default;`;
  
  if (content.includes(originalExport)) {
    content = content.replace(originalExport, patchedExport);
    fs.writeFileSync(anchorEsmPath, content);
    console.log('Successfully patched @coral-xyz/anchor ESM BN export');
  } else if (content.includes('export const BN = BN_default')) {
    console.log('@coral-xyz/anchor ESM BN export already patched');
  }

  const pkgContent = JSON.parse(fs.readFileSync(anchorPkgPath, 'utf8'));
  
  if (!pkgContent.exports) {
    pkgContent.exports = {
      ".": {
        "import": "./dist/esm/index.js",
        "require": "./dist/cjs/index.js",
        "types": "./dist/cjs/index.d.ts"
      },
      "./*": {
        "import": "./dist/esm/*.js",
        "require": "./dist/cjs/*.js"
      }
    };
    
    fs.writeFileSync(anchorPkgPath, JSON.stringify(pkgContent, null, 2));
    console.log('Successfully added exports field to @coral-xyz/anchor package.json');
  } else {
    console.log('@coral-xyz/anchor package.json already has exports field');
  }

} catch (error) {
  console.error('Failed to patch @coral-xyz/anchor:', error.message);
  process.exit(1);
}
