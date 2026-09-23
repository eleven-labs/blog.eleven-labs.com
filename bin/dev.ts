import { createServer as createViteServer } from 'vite';

const dev = async (): Promise<void> => {
  const vite = await createViteServer({
    base: process.env.BASE_URL || '/',
    appType: 'custom',
    // Ce serveur ne sert qu'à charger `src/server.ts`, qui crée le sien. En mode middleware, Vite
    // initialise ses plugins tout de suite, sans quoi les feuilles de style du design system ne
    // peuvent pas être compilées. `ws: false` lui interdit d'ouvrir un serveur WebSocket : il
    // occuperait le port 24678 avec son propre jeton, et le client HMR servi par `src/server.ts`
    // verrait sa connexion refusée puis rechargerait la page en boucle.
    server: {
      middlewareMode: true,
      ws: false,
    },
  });

  await vite.ssrLoadModule('/src/server.ts');
};

void dev();
