import { tokenCell as cell, tokens } from './tokens';

type Prefix = 'breakpoint-' | 'font-' | 'radius-' | 'shadow-' | 'spacing-' | 'text-';

/** Classes qu'un token donne, pour lire l'échelle comme on l'écrit dans le JSX. */
function classes(prefix: Prefix, key: string): string {
  switch (prefix) {
    case 'spacing-':
      return /^(\d|px)/.test(key) ? `p-${key} · gap-${key} · size-${key}` : `h-${key} · size-${key}`;
    case 'radius-':
      return `rounded-${key}`;
    case 'breakpoint-':
      return `${key}:`;
    default:
      return `${prefix}${key}`;
  }
}

/** Valeur en rem suivie de son équivalent en pixels (base de 16 px). */
function readable(value: string): string {
  const rem = value.match(/^(-?[\d.]+)rem$/);
  return rem ? `${value} · ${Number(rem[1]) * 16} px` : value;
}

/**
 * Une échelle du fichier de tokens : seuls les pas listés existent, la famille de Tailwind étant remise à zéro
 * (`--spacing-*: initial`). Chaque ligne donne la classe, un aperçu, la valeur et l'usage.
 */
export function ScaleTokens({ prefix }: { prefix: Prefix }) {
  const list = tokens(prefix).filter((token) => !token.name.includes('*') && !token.name.includes('--'));
  const lineHeights = new Map(tokens(prefix).filter((token) => token.name.endsWith('--line-height')).map((token) => [token.name.replace('--line-height', ''), token.light]));
  return (
    <table className="w-full border-collapse text-left text-sm">
      <thead className="text-xs text-muted">
        <tr>
          <th className={cell}>Classe</th>
          <th className={cell}>Aperçu</th>
          <th className={cell}>Valeur</th>
          <th className={cell}>Usage</th>
        </tr>
      </thead>
      <tbody>
        {list.map((token) => {
          const key = token.name.slice(prefix.length).replace('\\.', '.');
          const variable = `var(--${token.name})`;
          return (
            <tr key={token.name}>
              <td className={`${cell} font-mono text-xs whitespace-nowrap`}>{classes(prefix, key)}</td>
              <td className={cell}>
                {prefix === 'spacing-' && <span className="block h-3 rounded-control bg-primary" style={{ width: variable }} />}
                {prefix === 'radius-' && <span className="block size-12 border border-line-strong bg-surface-alt" style={{ borderRadius: variable }} />}
                {prefix === 'shadow-' && <span className="block h-12 w-24 rounded-card border border-line bg-surface" style={{ boxShadow: variable }} />}
                {prefix === 'font-' && <span style={{ fontFamily: variable }}>Portez ce vieux whisky au juge blond qui fume</span>}
                {prefix === 'text-' && (
                  <span className="block truncate" style={{ fontSize: variable, lineHeight: lineHeights.get(token.name) }}>
                    Portez ce vieux whisky au juge blond
                  </span>
                )}
              </td>
              <td className={`${cell} font-mono text-xs whitespace-nowrap text-muted`}>
                {readable(token.light)}
                {lineHeights.has(token.name) && <span className="block">interligne {lineHeights.get(token.name)}</span>}
              </td>
              <td className={`${cell} text-muted`}>{token.note ?? ''}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
