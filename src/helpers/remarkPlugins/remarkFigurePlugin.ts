import type { Plugin } from 'unified';
import type { Literal, Node, Parent } from 'unist';

import { visit } from 'unist-util-visit';

interface ImageNode extends Node {
  type: 'image';
  url: string;
  alt: string;
  title?: string;
}

interface FigureNode extends Parent {
  type: 'figure';
}

export const remarkFigurePlugin: Plugin<[]> = () => (tree) => {
  visit(tree, 'paragraph', (node: Parent) => {
    if (
      node.children?.[0]?.type === 'image' &&
      ((node.children?.[1] as Literal)?.value as string)?.trim()?.match(/^Figure:/)
    ) {
      const imageNode = node.children[0] as ImageNode;

      const figureNode: FigureNode = {
        type: 'figure',
        data: { hName: 'figure' },
        children: [
          imageNode,
          {
            type: 'figcaption',
            data: { hName: 'figcaption' },
            children: node.children.splice(2),
          } as Node,
        ],
      };

      node.children = [figureNode];
    }
  });
};
