import { downloadTranslations } from '../src/helpers/downloadTranslationsHelper';

(async (): Promise<void> => {
  try {
    await downloadTranslations();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
