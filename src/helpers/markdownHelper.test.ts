import { vi } from 'vitest';
import { z } from 'zod';

import { frontmatter, getDataInMarkdownFile } from './markdownHelper';

vi.mock('node:fs', () => ({
  readFileSync: vi.fn().mockImplementation((path: string) => {
    switch (path) {
      case '/path/to/dir/valid-file.md':
        return `---
title: Example Title
slug: example-title
---

This is the content`;
      case '/path/to/dir/invalid-file-with-markdown-contains-disallowed-syntax.md':
        return `---
title: Example Title
date: 2023-06-13
---

This is the content with a disallowed syntax {:{key}}`;
      case '/path/to/dir/invalid-file-with-validation-schema.md':
        return `---
title: Example Title
date: invalid-date
---

This is the content`;
      case '/path/to/dir/invalid-file-syntax.md':
        return `---
title: Example Title
slug: example-title
description: -> 
'lorem ipsum'
---

This is the content`;
    }
  }),
}));

describe('frontmatter', () => {
  it('should extract frontmatter data and remove it from the content', () => {
    const content = `---
title: Example Title
slug: example-title
---

This is the content`;

    const expectedResult = {
      data: {
        title: 'Example Title',
        slug: 'example-title',
      },
      content: 'This is the content',
    };

    const result = frontmatter(content);

    expect(result).toEqual(expectedResult);
  });
});

describe('getDataInMarkdownFile', () => {
  const ValidationSchema = z.object({
    title: z.string(),
    slug: z.string(),
  });

  it('should parse markdown file and validate frontmatter data', () => {
    const result = getDataInMarkdownFile({
      ValidationSchema,
      markdownFilePath: '/path/to/dir/valid-file.md',
    });

    // Assert the expected result
    expect(result).toEqual({
      title: 'Example Title',
      slug: 'example-title',
      content: 'This is the content',
    });
  });

  it('should throw an error if markdown contains disallowed syntax', () => {
    const markdownFilePath = '/path/to/dir/invalid-file-with-markdown-contains-disallowed-syntax.md';
    expect(() => {
      getDataInMarkdownFile({
        ValidationSchema,
        markdownFilePath,
      });
    }).toThrow(
      `The markdown of the file "${markdownFilePath}" is not compliant, it contains a syntax that is not allowed !`
    );
  });

  it('should throw an error if frontmatter data is invalid', () => {
    const markdownFilePath = '/path/to/dir/invalid-file-with-validation-schema.md';
    expect(() => {
      getDataInMarkdownFile({
        ValidationSchema: z.object({
          title: z.string(),
          date: z.coerce.date(),
        }),
        markdownFilePath,
      });
    }).toThrow(
      `The markdown of the file "/path/to/dir/invalid-file-with-validation-schema.md" is invalid ! Error: The markdown of the file "/path/to/dir/invalid-file-with-validation-schema.md" is invalid ! Validation error: Invalid date at "date"`
    );
  });

  it('should throw an error if an error occurs during parsing or validation', () => {
    const markdownFilePath = '/path/to/dir/invalid-file-syntax.md';
    expect(() => {
      getDataInMarkdownFile({
        ValidationSchema,
        markdownFilePath,
      });
    }).toThrow(
      `The markdown of the file "${markdownFilePath}" is invalid ! 1:1-6:4: Implicit map keys need to be followed by map values`
    );
  });
});
