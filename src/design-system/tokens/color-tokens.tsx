import { tokenCell as cell, tokens } from './tokens';

/** Nuancier : la pastille suit le thème choisi dans la barre d'outils (clair ou sombre). */
export function ColorTokens() {
  const list = tokens('color-');
  // Colonne Sombre seulement quand le thème a un bloc .dark
  const hasDark = list.some((token) => token.dark);
  return (
    <table className="w-full border-collapse text-left text-sm">
      <thead className="text-xs text-muted">
        <tr>
          <th className={cell}>Token</th>
          <th className={cell}>Aperçu</th>
          <th className={cell}>Clair</th>
          {hasDark && <th className={cell}>Sombre</th>}
          <th className={cell}>Usage</th>
        </tr>
      </thead>
      <tbody>
        {list.map((token) => (
          <tr key={token.name}>
            <td className={`${cell} font-mono text-xs`}>{token.name.replace('color-', '')}</td>
            <td className={cell}>
              <span
                className="block size-8 rounded-control border border-line"
                style={{ background: `var(--${token.name})` }}
              />
            </td>
            <td className={`${cell} font-mono text-xs`}>{token.light}</td>
            {hasDark && <td className={`${cell} font-mono text-xs text-muted`}>{token.dark ?? '—'}</td>}
            <td className={`${cell} text-muted`}>{token.note ?? ''}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
