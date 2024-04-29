import { readdir, readFile, writeFile, copyFile } from 'fs/promises';
import { existsSync } from 'fs';
import { cwebp } from 'webp-converter';

const destination = `../assets/items`;
const items = (await readdir('.', { withFileTypes: true })).filter(x => x.isDirectory()).map(x => x.name);

for (const item of items) {
  if (item === 'node_modules') {
    continue;
  }

  const itemFormat = {};
  const files = await readdir(item);
  const xml = files.filter(x => x.endsWith('.xml'));

  for (const file of xml) {
    const name = file.replace('.xml', '');
    itemFormat[name] = (await readFile(`${item}/${file}`)).toString('base64');
  }

  await writeFile(`${destination}/${item}.json`, JSON.stringify(itemFormat));

  try {
    if (existsSync(`${item}/icon.webp`)) {
      await copyFile(`${item}/icon.webp`, `${destination}/${item}.webp`);
    } else if (existsSync(`${item}/icon.png`)) {
      await cwebp(`${item}/icon.png`, `${destination}/${item}.webp`, '-q 100');
    }
  } catch (_) {}

  console.log(item, 'compiled');
}
