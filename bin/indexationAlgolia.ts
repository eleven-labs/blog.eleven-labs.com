import { createServer as createViteServer } from 'vite';

const indexationAlglolia = async (): Promise<void> => {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom',
  });

  try {
    const { indexationAlglolia } = await vite.ssrLoadModule('/src/helpers/indexationAlgoliaHelper.ts');

    await indexationAlglolia({
      appId: process.env.ALGOLIA_APP_ID as string,
      apiIndexingKey: process.env.ALGOLIA_API_INDEXING_KEY as string,
      index: process.env.ALGOLIA_INDEX as string,
    });
  } catch (e) {
    console.log(e);
  } finally {
    vite.close();
  }
};

indexationAlglolia();
