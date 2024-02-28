import { extractHeaders } from './markdownContentManagerHelper';

describe('extractHeaders', () => {
  it('should extract headers from markdown content', () => {
    const markdownContent = `
# Heading 1
Some content here.

## Subheading 1.1
More content.

### Sub-subheading 1.1.1
Even more content.

# Heading 2
Content for heading 2.
    `;

    const expectedHeaders = [
      { id: 'heading-1', level: 1, text: 'Heading 1' },
      { id: 'subheading-11', level: 2, text: 'Subheading 1.1' },
      { id: 'sub-subheading-111', level: 3, text: 'Sub-subheading 1.1.1' },
      { id: 'heading-2', level: 1, text: 'Heading 2' },
    ];

    const result = extractHeaders(markdownContent);

    expect(result).toEqual(expectedHeaders);
  });

  it('should handle empty content', () => {
    const markdownContent = '';

    const result = extractHeaders(markdownContent);

    expect(result).toEqual([]);
  });

  it('should ignore headers within code blocks', () => {
    const markdownContent = `
# Heading 1
\`\`\`
# Ignored Heading
\`\`\`
## Subheading 1.1
    `;

    const expectedHeaders = [
      { id: 'heading-1', level: 1, text: 'Heading 1' },
      { id: 'subheading-11', level: 2, text: 'Subheading 1.1' },
    ];

    const result = extractHeaders(markdownContent);

    expect(result).toEqual(expectedHeaders);
  });
});
