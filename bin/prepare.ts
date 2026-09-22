import { cpSync } from 'node:fs';
import { resolve } from 'node:path';

((): void => {
  try {
    const destDir = resolve(process.cwd(), 'public');
    cpSync(resolve(process.cwd(), 'src/assets/imgs'), resolve(destDir, 'imgs'), { recursive: true });
  } catch (e) {
    console.error(e);
  }
})();
