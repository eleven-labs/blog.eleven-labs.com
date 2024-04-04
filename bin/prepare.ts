import { cpSync } from 'node:fs';
import { resolve } from 'node:path';

(async (): Promise<void> => {
  try {
    const designSystemRootDir = resolve(process.cwd(), 'node_modules/@eleven-labs/design-system/dist');
    const destDir = resolve(process.cwd(), 'public');
    cpSync(resolve(process.cwd(), 'src/assets/imgs'), resolve(destDir, 'imgs'), { recursive: true });
    cpSync(resolve(designSystemRootDir, 'imgs'), resolve(destDir, 'imgs'), { recursive: true });
  } catch (e) {
    console.error(e);
  }
})();
