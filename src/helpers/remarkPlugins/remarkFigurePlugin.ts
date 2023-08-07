import { Plugin } from 'unified';
import { Literal, Node, Parent } from 'unist';
import { visit } from 'unist-util-visit';

interface ImageNode extends Node {
  type: 'image';
  url: string;
  alt: string;
  title?: string;
}

interface FigcaptionNode extends Parent {
  type: 'figcaption';
}

interface FigureNode extends Parent<ImageNode | FigcaptionNode> {
  type: 'figure';
}

export const remarkFigurePlugin: Plugin<[]> = () => (tree) => {
  visit(tree, 'paragraph', (node: Parent) => {
    if (
      node.children?.[0]?.type === 'image' &&
      (node.children?.[1] as Literal<string>)?.value?.trim()?.match(/^Figure:/)
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
          },
        ],
      };

      node.children = [figureNode];
    }
  });
};
