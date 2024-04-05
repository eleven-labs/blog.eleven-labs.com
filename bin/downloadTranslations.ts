import { downloadTranslations } from '../src/helpers/downloadTranslationsHelper';

(async (): Promise<void> => {
  try {
    downloadTranslations();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
