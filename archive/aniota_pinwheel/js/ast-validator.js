const fs = require('fs');
const babelParser = require('@babel/parser');

const filename = process.argv[2];
if (!filename) {
  console.error('Usage: node ast-validator.js <file.js>');
  process.exit(1);
}

const code = fs.readFileSync(filename, 'utf8');

try {
  const ast = babelParser.parse(code, {
    sourceType: 'module',
    plugins: [
      'jsx',             // if you use React
      'classProperties', // if you use class properties
      // add more plugins here as needed
    ],
  });
  console.log(`✅ ${filename} parsed successfully. No syntax errors found.`);
} catch (e) {
  console.error(`❌ Syntax error in ${filename}:`);
  console.error(`${e.message}`);
  if (e.loc) {
    console.error(`At line ${e.loc.line}, column ${e.loc.column}`);
  }
  process.exit(1);
}
