import * as glob from 'glob';
import * as fs from 'node:fs';
import { vi } from 'vitest';
import { z } from 'zod';

import {
  getDataInMarkdownFile,
  validateAuthor,
  validateExistingAssets,
  validateHeaders,
  validateMarkdown,
  validateMarkdownContent,
  validatePost,
  validateTags,
} from './markdownHelper';

vi.mock('node:fs');
vi.mock('glob');

const markdownContentValidAuthor = `---
contentType: author
username: jdoe
name: John Doe
github: account-github
twitter: account-twitter
linkedin: account-linkedin
---
This is some valid content`;

const markdownContentValidArticle = `---
contentType: article
lang: en
date: 2022-01-01
slug: valid-post
title: Valid Post
excerpt: This is a valid post excerpt
authors:
  - jdoe
categories:
  - javascript
cover: valid-post-cover.jpg
---
This is some valid content`;

vi.mock('@/app-paths', () => ({
  ARTICLES_DIR: '_articles',
  TUTORIALS_DIR: '_tutorials',
  AUTHORS_DIR: '_authors',
  ASSETS_DIR: '_assets',
}));

describe('getDataInMarkdownFile', () => {
  const validationSchema = z.object({
    title: z.string(),
    slug: z.string(),
  });

  it('should parse markdown file and validate frontmatter data', () => {
    const readFileSyncSpy = vi.spyOn(fs, 'readFileSync');
    readFileSyncSpy.mockReturnValueOnce(`---
title: Example Title
slug: example-title
---
This is the content`);

    const markdownFilePath = '/path/to/dir/valid-file.md';
    expect(
      getDataInMarkdownFile({
        markdownFilePath,
        validationSchema,
      })
    ).toMatchObject({
      title: 'Example Title',
      slug: 'example-title',
      content: 'This is the content',
    });
    expect(readFileSyncSpy).toHaveBeenCalledWith(markdownFilePath, { encoding: 'utf-8' });
  });

  test.each([
    {
      content: `---
title: Example Title
date: 2023-06-13
---

This is the content with a disallowed syntax {:{key}}`,
      syntaxInvalid: '{:{key}}',
    },
    {
      content: `---
title: Example Title
date: 2023-06-13
---

[Eleven Labs Link](https://eleven-labs.com/){:rel="nofollow noreferrer"}`,
      syntaxInvalid: '{:rel="nofollow noreferrer"}',
    },
    {
      content: `---
title: Example Title
date: 2023-06-13
---

{% raw %}
\`\`\`js
const world = 'hello';
\`\`\`
{% endraw %}`,
      syntaxInvalid: '{% raw %}',
    },
  ])('should throw an error if markdown contains disallowed syntax', ({ content, syntaxInvalid }) => {
    const readFileSyncSpy = vi.spyOn(fs, 'readFileSync');
    readFileSyncSpy.mockReturnValueOnce(content);

    const markdownFilePath = '/path/to/dir/invalid-file-with-markdown-contains-disallowed-syntax.md';
    expect(() =>
      getDataInMarkdownFile({
        markdownFilePath,
        validationSchema,
      })
    ).toThrow(
      `The markdown of the file "${markdownFilePath}" is invalid! The syntax isn't allowed, please use valid markdown syntax! ${syntaxInvalid}`
    );
    expect(readFileSyncSpy).toHaveBeenCalledWith(markdownFilePath, { encoding: 'utf-8' });
  });

  it('should not throw an error if markdown contains disallowed syntax in code', () => {
    const readFileSyncSpy = vi.spyOn(fs, 'readFileSync');
    readFileSyncSpy.mockReturnValueOnce(`---
title: Example Title
date: 2023-06-13
---

\`\`\`js
const world = 'hello';
{% raw %}test{% endraw %}
\`\`\`
contient | \`{% raw %}{{{% endraw %}\` \`{% raw %}}}{% endraw %}\` | \`{% raw %}param{{value}}{% endraw %}\` | X | X |  | X |`);

    const markdownFilePath = '/path/to/dir/valid-file-with-markdown.md';
    expect(() =>
      getDataInMarkdownFile({
        markdownFilePath,
        validationSchema,
      })
    ).not.toThrow(
      `The markdown of the file "${markdownFilePath}" is invalid! The syntax isn't allowed, please use valid markdown syntax! {% raw %}`
    );
    expect(readFileSyncSpy).toHaveBeenCalledWith(markdownFilePath, { encoding: 'utf-8' });
  });

  it('should throw an error if frontmatter data is invalid', () => {
    const readFileSyncSpy = vi.spyOn(fs, 'readFileSync');
    readFileSyncSpy.mockReturnValueOnce(`---
title: Example Title
date: invalid-date
---

This is the content`);

    const markdownFilePath = '/path/to/dir/invalid-file-with-validation-schema.md';
    expect(() => {
      getDataInMarkdownFile({
        markdownFilePath,
        validationSchema: z.object({
          title: z.string(),
          date: z.coerce.date(),
        }),
      });
    }).toThrow(`The markdown of the file "${markdownFilePath}" is invalid! Invalid date at "date"`);
    expect(readFileSyncSpy).toHaveBeenCalledWith(markdownFilePath, { encoding: 'utf-8' });
  });

  it('should throw an error if an error occurs during parsing or validation', () => {
    const readFileSyncSpy = vi.spyOn(fs, 'readFileSync');
    readFileSyncSpy.mockReturnValueOnce(`---
title: Example Title
slug: example-title
description: ->
'lorem ipsum'
---

This is the content`);

    const markdownFilePath = '/path/to/dir/invalid-file-syntax.md';
    expect(() => {
      getDataInMarkdownFile({
        markdownFilePath,
        validationSchema,
      });
    }).toThrow(
      `The markdown of the file "${markdownFilePath}" is invalid! Can not read an implicit mapping pair; a colon is missed at line 5, column 14`
    );
    expect(readFileSyncSpy).toHaveBeenCalledWith(markdownFilePath, { encoding: 'utf-8' });
  });
});

describe('validateAuthor', () => {
  it('should throw an error if markdown is invalid', () => {
    const readFileSyncSpy = vi.spyOn(fs, 'readFileSync');
    readFileSyncSpy.mockReturnValueOnce(`---
contentType: author
username: jdoe
github: account-github
twitter: account-twitter
linkedin: account-Linkedin
---
This is some valid content`);

    const markdownFilePath = '/path/to/dir/invalid-author.md';
    expect(() => validateAuthor({ markdownFilePath })).toThrow(
      `The markdown of the file "${markdownFilePath}" is invalid! Required at "name"`
    );
    expect(readFileSyncSpy).toHaveBeenCalledWith(markdownFilePath, { encoding: 'utf-8' });
  });

  it('should throw an error if markdown is invalid because of social networking', () => {
    const readFileSyncSpy = vi.spyOn(fs, 'readFileSync');
    readFileSyncSpy.mockReturnValueOnce(`---
contentType: author
username: jdoe
name: John Doe
github: https://github.com/account-github
twitter: '@account-twitter'
linkedin: https://www.linkedin.com/in/account-Linkedin/
---
This is some valid content`);

    const markdownFilePath = '/path/to/dir/invalid-author-social-networks.md';
    expect(() => validateAuthor({ markdownFilePath })).toThrow(
      `The markdown of the file "${markdownFilePath}" is invalid! No need to set the "@" for twitter, just the username. at "twitter"; No need to define the complete url of github, just give the user name at "github"; No need to define the complete url of linkedin, just give the user name at "linkedin"`
    );
    expect(readFileSyncSpy).toHaveBeenCalledWith(markdownFilePath, { encoding: 'utf-8' });
  });

  it('should return valid data and content if markdown is valid', () => {
    const readFileSyncSpy = vi.spyOn(fs, 'readFileSync');
    readFileSyncSpy.mockReturnValueOnce(markdownContentValidAuthor);

    const markdownFilePath = '/path/to/dir/valid-author.md';
    expect(validateAuthor({ markdownFilePath })).toEqual({
      contentType: 'author',
      username: 'jdoe',
      name: 'John Doe',
      github: 'account-github',
      twitter: 'account-twitter',
      linkedin: 'account-linkedin',
      content: 'This is some valid content',
    });
    expect(readFileSyncSpy).toHaveBeenCalledWith(markdownFilePath, { encoding: 'utf-8' });
  });
});

describe('validatePost', () => {
  it('should throw an error if markdown is invalid', () => {
    const readFileSyncSpy = vi.spyOn(fs, 'readFileSync');
    readFileSyncSpy.mockReturnValueOnce(`---
contentType: article
lang: en
date: 2022-01-01
slug: valid-post
excerpt: This is a valid post excerpt
authors:
  - jdoe
categories:
  - javascript
---
This is some valid content`);

    const markdownFilePath = '/path/to/dir/invalid-post.md';
    expect(() =>
      validatePost({
        authors: ['jdoe', 'jdupont'],
        markdownFilePath,
      })
    ).toThrow(`The markdown of the file "${markdownFilePath}" is invalid! Required at "title"`);
    expect(readFileSyncSpy).toHaveBeenCalledWith(markdownFilePath, { encoding: 'utf-8' });
  });

  it('should throw an error if an article has a keyword included in the categories', () => {
    const readFileSyncSpy = vi.spyOn(fs, 'readFileSync');
    readFileSyncSpy.mockReturnValueOnce(`---
contentType: article
lang: en
date: 2022-01-01
slug: valid-post
title: Valid Post
excerpt: This is a valid post excerpt
authors:
  - jdoe
categories:
  - javascript
keywords:
  - javascript
cover: valid-post-cover.jpg
---
This is some valid content`);

    const markdownFilePath = '/path/to/dir/invalid-post-keyword-includes-in-categories.md';
    expect(() =>
      validatePost({
        authors: ['jdoe', 'jdupont'],
        markdownFilePath,
      })
    ).toThrow(`The markdown of the file "${markdownFilePath}" is invalid! Must not include a category. at "keywords"`);
    expect(readFileSyncSpy).toHaveBeenCalledWith(markdownFilePath, { encoding: 'utf-8' });
  });

  it('should throw an error if an article has more than 5 keywords', () => {
    const readFileSyncSpy = vi.spyOn(fs, 'readFileSync');
    readFileSyncSpy.mockReturnValueOnce(`---
contentType: article
lang: en
date: 2022-04-01
slug: my-post
title: My Post
excerpt: Some excerpt
authors:
  - jdoe
categories:
  - javascript
keywords:
  - keyword1
  - keyword2
  - keyword3
  - keyword4
  - keyword5
  - keyword6
  - keyword7
  - keyword8
  - keyword9
  - keyword10
  - keyword11
---
Some content`);

    const markdownFilePath = '/path/to/dir/invalid-post-too-many-keywords.md';
    expect(() =>
      validatePost({
        authors: ['jdoe', 'jdupont'],
        markdownFilePath,
      })
    ).toThrow(`The markdown of the file "${markdownFilePath}" is invalid! Too many items 😡. at "keywords"`);
    expect(readFileSyncSpy).toHaveBeenCalledWith(markdownFilePath, { encoding: 'utf-8' });
  });

  it('should throw an error if an article has a duplicate keyword', () => {
    const readFileSyncSpy = vi.spyOn(fs, 'readFileSync');
    readFileSyncSpy.mockReturnValueOnce(`---
contentType: article
lang: en
date: 2022-04-01
slug: my-post
title: My Post
excerpt: Some excerpt
authors:
  - jdoe
categories:
  - javascript
keywords:
  - keyword1
  - keyword1
---
Some content`);

    const markdownFilePath = '/path/to/dir/invalid-post-duplicates-keywords.md';
    expect(() =>
      validatePost({
        authors: ['jdoe', 'jdupont'],
        markdownFilePath,
      })
    ).toThrow(`The markdown of the file "${markdownFilePath}" is invalid! No duplicates allowed. at "keywords"`);
    expect(readFileSyncSpy).toHaveBeenCalledWith(markdownFilePath, { encoding: 'utf-8' });
  });

  it('should return valid data and content if markdown is valid', () => {
    const readFileSyncSpy = vi.spyOn(fs, 'readFileSync');
    readFileSyncSpy.mockReturnValueOnce(markdownContentValidArticle);

    const markdownFilePath = '/path/to/dir/valid-post.md';
    expect(
      validatePost({
        authors: ['jdoe', 'jdupont'],
        markdownFilePath,
      })
    ).toEqual({
      contentType: 'article',
      lang: 'en',
      date: '2022-01-01',
      slug: 'valid-post',
      title: 'Valid Post',
      excerpt: 'This is a valid post excerpt',
      cover: 'valid-post-cover.jpg',
      authors: ['jdoe'],
      categories: ['javascript'],
      content: 'This is some valid content',
    });
    expect(readFileSyncSpy).toHaveBeenCalledWith(markdownFilePath, { encoding: 'utf-8' });
  });
});

describe('validateMarkdown', () => {
  it('should throw an error if an author already exists with the same username', () => {
    const readFileSyncSpy = vi.spyOn(fs, 'readFileSync');
    const globSyncSpy = vi.spyOn(glob, 'globSync');

    globSyncSpy.mockReturnValueOnce(['/path/to/dir/valid-author.md', '/path/to/dir/valid-author.md']);
    readFileSyncSpy.mockReturnValueOnce(markdownContentValidAuthor).mockReturnValueOnce(markdownContentValidAuthor);

    expect(() => validateMarkdown()).toThrow('This author already exists with the same username!');
    expect(readFileSyncSpy).toHaveBeenCalledWith('/path/to/dir/valid-author.md', { encoding: 'utf-8' });
    expect(readFileSyncSpy).toHaveBeenCalledWith('/path/to/dir/valid-author.md', { encoding: 'utf-8' });
  });

  it('should throw an error if an article already exists with the same slug and language', () => {
    const readFileSyncSpy = vi.spyOn(fs, 'readFileSync');
    const globSyncSpy = vi.spyOn(glob, 'globSync');

    globSyncSpy
      .mockReturnValueOnce(['/path/to/dir/valid-author.md'])
      .mockReturnValueOnce(['/path/to/dir/valid-post.md', '/path/to/dir/valid-post.md']);

    readFileSyncSpy
      .mockReturnValueOnce(markdownContentValidAuthor)
      .mockReturnValueOnce(markdownContentValidArticle)
      .mockReturnValueOnce(markdownContentValidArticle);

    expect(() => validateMarkdown()).toThrow('This article already exists with the same slug and the same language!');
    expect(readFileSyncSpy).toHaveBeenCalledWith('/path/to/dir/valid-author.md', { encoding: 'utf-8' });
    expect(readFileSyncSpy).toHaveBeenCalledWith('/path/to/dir/valid-post.md', { encoding: 'utf-8' });
    expect(readFileSyncSpy).toHaveBeenCalledWith('/path/to/dir/valid-post.md', { encoding: 'utf-8' });
  });
});

describe('validateTags', () => {
  it('should generate an error when an img tag is used', () => {
    const contentInvalid = `<img src="/imgs/articles/test.png" width="300px" alt="title image" />`;

    expect(() => validateTags(contentInvalid)).toThrow(
      `The img tag are no longer allowed, please use markdown syntax! ${contentInvalid}`
    );
  });
});

describe('validateExistingAssets', () => {
  it('should throw an error when an asset file does not exist', () => {
    const assetPath = `_assets/articles/test.png`;
    const contentInvalid = 'This is a test post content with an asset reference {BASE_URL}/imgs/articles/test.png';

    const existsSyncSpy = vi.spyOn(fs, 'existsSync');
    existsSyncSpy.mockReturnValueOnce(false);

    expect(() => validateExistingAssets(contentInvalid)).toThrow(`The file does not exist "${assetPath}"!`);
    expect(existsSyncSpy).toHaveBeenCalledWith(assetPath);
  });
});

describe('validateHeaders', () => {
  test.each<{ invalidHeadings: { level: number; text: string }[]; error: string }>([
    {
      invalidHeadings: [
        { level: 1, text: 'Heading 1' },
        { level: 2, text: 'Sub Heading 1' },
        { level: 1, text: 'Heading 2' },
      ],
      error: 'The h1 "Heading 1" is reserved for the title in the metadata at the top of the markdown!',
    },
    {
      invalidHeadings: [
        { level: 3, text: 'Heading 1' },
        { level: 4, text: 'Sub Heading 1' },
        { level: 3, text: 'Heading 2' },
      ],
      error: 'Invalid h3: "Heading 1". Expected level: h2',
    },
    {
      invalidHeadings: [
        { level: 2, text: 'Heading 1' },
        { level: 3, text: 'Sub Heading 1' },
        { level: 5, text: 'Sub Heading 2' },
      ],
      error: 'Invalid h5: "Sub Heading 2". Expected level: h4',
    },
  ])('should throw an error for invalid heading levels', ({ invalidHeadings, error }) => {
    expect(() => validateHeaders(invalidHeadings)).toThrow(error);
  });

  test.each<{ validHeadings: { level: number; text: string }[] }>([
    {
      validHeadings: [
        { level: 2, text: 'Heading 1' },
        { level: 3, text: 'Heading 2' },
        { level: 3, text: 'Heading 3' },
      ],
    },
    {
      validHeadings: [
        { level: 2, text: 'Heading 1' },
        { level: 3, text: 'Sub Heading 1' },
        { level: 2, text: 'Heading 2' },
      ],
    },
  ])('should not throw an error for valid heading levels', ({ validHeadings }) => {
    expect(validateHeaders(validHeadings)).toEqual(true);
  });
});

describe('validateMarkdownContent', () => {
  it('should generate an error when an img tag is used', () => {
    const tagInvalid = '<img src="/imgs/articles/test.png" width="300px" alt="title image" />';
    const options = {
      markdownFilePath: '/path/to/some/file.md',
      content: ['## heading 1', tagInvalid].join('\n'),
    };

    expect(() => validateMarkdownContent(options)).toThrow(
      `The markdown of the file "${options.markdownFilePath}" is invalid! The img tag are no longer allowed, please use markdown syntax! ${tagInvalid}`
    );
  });
});
