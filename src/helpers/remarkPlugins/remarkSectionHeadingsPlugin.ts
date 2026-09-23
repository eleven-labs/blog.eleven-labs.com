import type GithubSlugger from 'github-slugger';
import type { Plugin } from 'unified';
import type { Node, Parent } from 'unist';

import { toString } from 'mdast-util-to-string';
import { visit } from 'unist-util-visit';

export interface RemarkSectionHeadingsOptions {
  /** Title of the section, rendered as its `h2` outside of the markdown. */
  title: string;
  /** Shared by every section of the page, so that no heading gets an id already used by another one. */
  slugger: GithubSlugger;
}

// @types/mdast is not a direct dependency, and only these few fields are needed
interface HeadingNode extends Parent {
  type: 'heading';
  depth: number;
  data?: Parent['data'] & { hProperties?: Record<string, unknown> };
}

const isHeading = (node?: Node): node is HeadingNode => node?.type === 'heading';

const normalizeHeadingText = (text: string): string =>
  text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[\s:?!.]+$/, '')
    .trim()
    .toLowerCase();

/**
 * Turns the markdown of a step into the content of a section of the tutorial page: the section already
 * carries the title of the step in a `h2`, so the headings of the step move one level down, and a first
 * heading repeating that title is dropped.
 */
export const remarkSectionHeadingsPlugin: Plugin<[RemarkSectionHeadingsOptions]> =
  ({ title, slugger }) =>
  (tree) => {
    const root = tree as Parent;
    const firstNode = root.children[0];
    if (
      isHeading(firstNode) &&
      normalizeHeadingText(toString(firstNode, { includeImageAlt: false })) === normalizeHeadingText(title)
    ) {
      root.children.shift();
    }

    visit(tree, 'heading', (node: HeadingNode) => {
      node.depth = Math.min(6, Math.max(3, node.depth + 1));
      // rehype-slug leaves alone the headings that already have an id
      node.data = {
        ...node.data,
        hProperties: {
          ...node.data?.hProperties,
          id: slugger.slug(toString(node, { includeImageAlt: false })),
        },
      };
    });
  };
