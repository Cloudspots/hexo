// hexo.on('ready', async function () {
//   const renderer = hexo.extend.renderer.get('md');

//   if (!renderer) {
//     console.error('找不到 md renderer');
//     return;
//   }

//   const fs = require('fs');
//   const path = require('path');

//   const postsDir = path.join(hexo.source_dir, '_posts');

//   const files = fs.readdirSync(postsDir)
//     .filter(file => file.endsWith('.md'))
//     .sort();

//   console.log(`Testing ${files.length} posts with Hexo md renderer`);

//   for (let i = 0; i < files.length; i++) {
//     const file = files[i];

//     const filename = path.join(postsDir, file);
//     const text = fs.readFileSync(filename, 'utf8');

//     const before = process.memoryUsage();

//     console.log(
//       `[${i + 1}/${files.length}] ${file}` +
//       ` heap=${Math.round(before.heapUsed / 1024 / 1024)}MB`
//     );

//     try {
//       await renderer({
//         text,
//         path: filename
//       });

//       const after = process.memoryUsage();

//       console.log(
//         `    -> heap=${Math.round(after.heapUsed / 1024 / 1024)}MB`
//       );
//     } catch (e) {
//       console.error(`FAILED: ${file}`);
//       console.error(e);
//       process.exit(1);
//     }
//   }
// });
// Used