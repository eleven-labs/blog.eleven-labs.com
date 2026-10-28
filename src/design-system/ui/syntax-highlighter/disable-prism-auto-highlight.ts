import refractor from 'refractor/core';

/**
 * refractor assigns `globalThis.Prism = { manual: true }` right before requiring prism-core, but a
 * bundler hoists that require above the assignment, so prism-core arms its automatic browser
 * highlighting. It would then rewrite every `code[class*="language-"]` of the page on
 * `DOMContentLoaded` with `element.innerHTML = Prism.highlight(…)`, and refractor replaces
 * `Token.stringify` to return hast nodes rather than a string: server rendered snippets end up
 * stringified as `[object Object],[object Object],…`.
 *
 * prism-core reads `manual` again when its callback fires, so disarming it here is enough. The flag
 * lives on the prism object itself, which refractor exposes as the prototype of its own export.
 */
(Object.getPrototypeOf(refractor) as { manual: boolean }).manual = true;
