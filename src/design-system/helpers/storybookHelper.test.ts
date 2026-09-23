import { createControls, createDescription } from '@/design-system/helpers/storybookHelper';

describe('Test storybook helpers', () => {
  test('return description for storybook', () => {
    expect(
      createDescription({
        cssProperties: ['text-transform'],
        cssValues: ['capitalize', 'uppercase', 'lowercase'],
      })
    ).toEqual(
      '**CSS Properties**:  [text-transform](https://developer.mozilla.org/en-US/docs/Web/CSS/text-transform) `(capitalize | uppercase | lowercase)`'
    );
  });

  test.each([
    {
      options: {
        category: 'Spacing',
        subCategory: 'Margin',
        props: {
          m: ['margin'],
          mx: ['margin-left', 'margin-right'],
        },
        options: ['0', '8'],
      } as Parameters<typeof createControls>[0],
      expected: {
        m: {
          description: '**CSS Properties**:  [margin](https://developer.mozilla.org/en-US/docs/Web/CSS/margin)',
          table: {
            category: 'Spacing',
            subcategory: 'Margin',
          },
          control: 'select',
          options: ['0', '8'],
        },
        mx: {
          description:
            '**CSS Properties**:  [margin-left](https://developer.mozilla.org/en-US/docs/Web/CSS/margin-left),  [margin-right](https://developer.mozilla.org/en-US/docs/Web/CSS/margin-right)',
          table: {
            category: 'Spacing',
            subcategory: 'Margin',
          },
          control: 'select',
          options: ['0', '8'],
        },
      },
    },
    {
      options: {
        category: 'Typography',
        props: {
          size: ['font-size'],
          italic: ['font-style'],
        },
        options: {
          size: ['xs', 's', 'm', 'l', 'xl'],
        },
        controlType: {
          italic: 'boolean',
        },
      } as Parameters<typeof createControls>[0],
      expected: {
        size: {
          description: '**CSS Properties**:  [font-size](https://developer.mozilla.org/en-US/docs/Web/CSS/font-size)',
          table: {
            category: 'Typography',
          },
          control: 'select',
          options: ['xs', 's', 'm', 'l', 'xl'],
        },
        italic: {
          description: '**CSS Properties**:  [font-style](https://developer.mozilla.org/en-US/docs/Web/CSS/font-style)',
          table: {
            category: 'Typography',
          },
          control: 'boolean',
        },
      },
    },
  ])('return controls for storybook $expected', ({ options, expected }) => {
    expect(createControls(options)).toEqual(expected);
  });
});
