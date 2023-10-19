import * as glob from 'glob';
import * as fs from 'node:fs';
import { vi } from 'vitest';
import { z } from 'zod';

import {
  frontmatter,
  getDataInMarkdownFile,
  validateAuthor,
  validateMarkdown,
  validateMarkdownContent,
  validatePost,
} from './markdownHelper';

vi.mock('node:fs');
vi.mock('glob');

const markdownContentValidAuthor = `---
username: jdoe
name: John Doe
github: account-github
twitter: account-twitter
linkedin: account-linkedin
---
This is some valid content`;

const markdownContentValidPost = `---
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
    expect(result).toMatchObject(expectedResult);
  });
});

vi.mock('@/app-paths', () => ({
  ARTICLES_DIR: '_articles',
  AUTHORS_DIR: '_authors',
  ASSETS_DIR: '_assets',
}));

describe('getDataInMarkdownFile', () => {
  const ValidationSchema = z.object({
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
        ValidationSchema,
        markdownFilePath,
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
        ValidationSchema,
        markdownFilePath,
      })
    ).toThrow(
      `The markdown of the file "${markdownFilePath}" is invalid ! The syntax isn't allowed, please use valid markdown syntax ! ${syntaxInvalid}`
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
        ValidationSchema,
        markdownFilePath,
      })
    ).not.toThrow(
      `The markdown of the file "${markdownFilePath}" is invalid ! The syntax isn't allowed, please use valid markdown syntax ! {% raw %}`
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
        ValidationSchema: z.object({
          title: z.string(),
          date: z.coerce.date(),
        }),
        markdownFilePath,
      });
    }).toThrow(`The markdown of the file "${markdownFilePath}" is invalid ! Invalid date at "date"`);
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
        ValidationSchema,
        markdownFilePath,
      });
    }).toThrow(
      `The markdown of the file "${markdownFilePath}" is invalid ! Can not read an implicit mapping pair; a colon is missed at line 5, column 14`
    );
    expect(readFileSyncSpy).toHaveBeenCalledWith(markdownFilePath, { encoding: 'utf-8' });
  });
});

describe('validateAuthor', () => {
  it('should throw an error if markdown is invalid', () => {
    const readFileSyncSpy = vi.spyOn(fs, 'readFileSync');
    readFileSyncSpy.mockReturnValueOnce(`---
username: jdoe
github: account-github
twitter: account-twitter
linkedin: account-Linkedin
---
This is some valid content`);

    const markdownFilePath = '/path/to/dir/invalid-author.md';
    expect(() => validateAuthor({ markdownFilePath })).toThrow(
      `The markdown of the file "${markdownFilePath}" is invalid ! Required at "name"`
    );
    expect(readFileSyncSpy).toHaveBeenCalledWith(markdownFilePath, { encoding: 'utf-8' });
  });

  it('should throw an error if markdown is invalid because of social networking', () => {
    const readFileSyncSpy = vi.spyOn(fs, 'readFileSync');
    readFileSyncSpy.mockReturnValueOnce(`---
username: jdoe
name: John Doe
github: https://github.com/account-github
twitter: '@account-twitter'
linkedin: https://www.linkedin.com/in/account-Linkedin/
---
This is some valid content`);

    const markdownFilePath = '/path/to/dir/invalid-author-social-networks.md';
    expect(() => validateAuthor({ markdownFilePath })).toThrow(
      `The markdown of the file "${markdownFilePath}" is invalid ! No need to set the "@" for twitter, just the username. at "twitter"; No need to define the complete url of github, just give the user name at "github"; No need to define the complete url of linkedin, just give the user name at "linkedin"`
    );
    expect(readFileSyncSpy).toHaveBeenCalledWith(markdownFilePath, { encoding: 'utf-8' });
  });

  it('should return valid data and content if markdown is valid', () => {
    const readFileSyncSpy = vi.spyOn(fs, 'readFileSync');
    readFileSyncSpy.mockReturnValueOnce(markdownContentValidAuthor);

    const markdownFilePath = '/path/to/dir/valid-author.md';
    expect(validateAuthor({ markdownFilePath })).toEqual({
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
    ).toThrow(`The markdown of the file "${markdownFilePath}" is invalid ! Required at "title"`);
    expect(readFileSyncSpy).toHaveBeenCalledWith(markdownFilePath, { encoding: 'utf-8' });
  });

  it('should throw an error if an article has a keyword included in the categories', () => {
    const readFileSyncSpy = vi.spyOn(fs, 'readFileSync');
    readFileSyncSpy.mockReturnValueOnce(`---
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
    ).toThrow(`The markdown of the file "${markdownFilePath}" is invalid ! Must not include a category. at "keywords"`);
    expect(readFileSyncSpy).toHaveBeenCalledWith(markdownFilePath, { encoding: 'utf-8' });
  });

  it('should throw an error if an article has more than 5 keywords', () => {
    const readFileSyncSpy = vi.spyOn(fs, 'readFileSync');
    readFileSyncSpy.mockReturnValueOnce(`---
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
    ).toThrow(`The markdown of the file "${markdownFilePath}" is invalid ! Too many items 😡. at "keywords"`);
    expect(readFileSyncSpy).toHaveBeenCalledWith(markdownFilePath, { encoding: 'utf-8' });
  });

  it('should throw an error if an article has a duplicate keyword', () => {
    const readFileSyncSpy = vi.spyOn(fs, 'readFileSync');
    readFileSyncSpy.mockReturnValueOnce(`---
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
    ).toThrow(`The markdown of the file "${markdownFilePath}" is invalid ! No duplicates allowed. at "keywords"`);
    expect(readFileSyncSpy).toHaveBeenCalledWith(markdownFilePath, { encoding: 'utf-8' });
  });

  it('should return valid data and content if markdown is valid', () => {
    const readFileSyncSpy = vi.spyOn(fs, 'readFileSync');
    readFileSyncSpy.mockReturnValueOnce(markdownContentValidPost);

    const markdownFilePath = '/path/to/dir/valid-post.md';
    expect(
      validatePost({
        authors: ['jdoe', 'jdupont'],
        markdownFilePath,
      })
    ).toEqual({
      lang: 'en',
      date: new Date('2022-01-01T00:00:00.000Z'),
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

    expect(() => validateMarkdown()).toThrow('This author already exists with the same username !');
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
      .mockReturnValueOnce(markdownContentValidPost)
      .mockReturnValueOnce(markdownContentValidPost);

    expect(() => validateMarkdown()).toThrow('This article already exists with the same slug and the same language !');
    expect(readFileSyncSpy).toHaveBeenCalledWith('/path/to/dir/valid-author.md', { encoding: 'utf-8' });
    expect(readFileSyncSpy).toHaveBeenCalledWith('/path/to/dir/valid-post.md', { encoding: 'utf-8' });
    expect(readFileSyncSpy).toHaveBeenCalledWith('/path/to/dir/valid-post.md', { encoding: 'utf-8' });
  });
});

describe('validateMarkdownContent', () => {
  it('should return the content when there are no asset references', () => {
    const options = {
      markdownFilePath: '/path/to/some/file.md',
      content: 'This is a test post content without asset references.',
    };

    const result = validateMarkdownContent(options);

    expect(result).toBe(options.content);
    const existsSyncSpy = vi.spyOn(fs, 'existsSync');
    expect(existsSyncSpy).not.toHaveBeenCalled();
  });

  it('should throw an error when an asset file does not exist', () => {
    const markdownFilePath = '/path/to/some/file.md';
    const assetPath = `_assets/posts/test.png`;

    const existsSyncSpy = vi.spyOn(fs, 'existsSync');
    existsSyncSpy.mockReturnValueOnce(false);

    expect(() =>
      validateMarkdownContent({
        markdownFilePath,
        content: 'This is a test post content with an asset reference {{ site.baseurl }}/assets/test.png',
      })
    ).toThrow(`The markdown of the file "${markdownFilePath}" is invalid ! The file does not exist "${assetPath}"!`);
    expect(existsSyncSpy).toHaveBeenCalledWith(assetPath);
  });

  it('should generate an error when an img tag is used', () => {
    const markdownFilePath = '/path/to/some/file.md';
    const contentInvalid = `<img src="{{ site.baseurl }}/assets/posts/test.png" width="300px" alt="title image" />`;

    expect(() =>
      validateMarkdownContent({
        markdownFilePath,
        content: contentInvalid,
      })
    ).toThrow(
      `The markdown of the file "${markdownFilePath}" is invalid ! The img tag are no longer allowed, please use markdown syntax ! ${contentInvalid}`
    );
  });
});
