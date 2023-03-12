const replace = require('replace-in-file');
const pkg = require('./package.json');

setTimeout(() => {
  const aa = replace.sync({
    files: './dist/README.md',
    from: /\[version]/g,
    to: pkg.version,
  });

  console.log(aa);
}, 2000);
