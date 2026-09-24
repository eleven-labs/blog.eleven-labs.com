import * as glob from 'glob';
import * as fs from 'node:fs';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

import {
  getDataInMarkdownFile,
  type MarkdownInvalidError,
  getImagesWithoutAlt,
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
---
This is some valid content`;

vi.mock('@/app-paths', () => ({
  ARTICLES_DIR: '_articles',
  TUTORIALS_DIR: '_tutorials',
  AUTHORS_DIR: '_authors',
  ASSETS_DIR: '_assets',
}));

afterEach(() => {
  vi.resetAllMocks();
});

describe('getDataInMarkdownFile', () => {
  const validationSchema = z.object({
    title: z.string(),
    slug: z.string(),
  });

  it('should parse markdown file and validate frontmatter data', () => {
    vi.mocked(fs.readFileSync).mockReturnValueOnce(`---
title: Example Title
slug: example-title
---
This is the content`);

    const markdownFilePath = '/path/to/dir/valid-file.mdx';
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
    expect(fs.readFileSync).toHaveBeenCalledWith(markdownFilePath, { encoding: 'utf-8' });
  });

  it('should throw an error if frontmatter data is invalid', () => {
    vi.mocked(fs.readFileSync).mockReturnValueOnce(`---
title: Example Title
date: invalid-date
---

This is the content`);

    const markdownFilePath = '/path/to/dir/invalid-file-with-validation-schema.mdx';
    expect(() => {
      getDataInMarkdownFile({
        markdownFilePath,
        validationSchema: z.object({
          title: z.string(),
          date: z.coerce.date(),
        }),
      });
    }).toThrow(`The markdown of the file "${markdownFilePath}" is invalid! Invalid date at "date"`);
    expect(fs.readFileSync).toHaveBeenCalledWith(markdownFilePath, { encoding: 'utf-8' });
  });

  it('should throw an error if an error occurs during parsing or validation', () => {
    vi.mocked(fs.readFileSync).mockReturnValueOnce(`---
title: Example Title
slug: example-title
description: ->
'lorem ipsum'
---

This is the content`);

    const markdownFilePath = '/path/to/dir/invalid-file-syntax.mdx';
    expect(() => {
      getDataInMarkdownFile({
        markdownFilePath,
        validationSchema,
      });
    }).toThrow(
      `The markdown of the file "${markdownFilePath}" is invalid! Can not read an implicit mapping pair; a colon is missed at line 5, column 14`
    );
    expect(fs.readFileSync).toHaveBeenCalledWith(markdownFilePath, { encoding: 'utf-8' });
  });
});

describe('validateAuthor', () => {
  it('should throw an error if markdown is invalid', () => {
    vi.mocked(fs.readFileSync).mockReturnValueOnce(`---
contentType: author
username: jdoe
github: account-github
twitter: account-twitter
linkedin: account-Linkedin
---
This is some valid content`);

    const markdownFilePath = '/path/to/dir/invalid-author.mdx';
    expect(() => validateAuthor({ markdownFilePath })).toThrow(
      `The markdown of the file "${markdownFilePath}" is invalid! Required at "name"`
    );
    expect(fs.readFileSync).toHaveBeenCalledWith(markdownFilePath, { encoding: 'utf-8' });
  });

  it('should throw an error if markdown is invalid because of social networking', () => {
    vi.mocked(fs.readFileSync).mockReturnValueOnce(`---
contentType: author
username: jdoe
name: John Doe
github: https://github.com/account-github
twitter: '@account-twitter'
linkedin: https://www.linkedin.com/in/account-Linkedin/
---
This is some valid content`);

    const markdownFilePath = '/path/to/dir/invalid-author-social-networks.mdx';
    expect(() => validateAuthor({ markdownFilePath })).toThrow(
      `The markdown of the file "${markdownFilePath}" is invalid! No need to set the "@" for twitter, just the username. at "twitter"; No need to define the complete url of github, just give the user name at "github"; No need to define the complete url of linkedin, just give the user name at "linkedin"`
    );
    expect(fs.readFileSync).toHaveBeenCalledWith(markdownFilePath, { encoding: 'utf-8' });
  });

  it('should return valid data and content if markdown is valid', () => {
    vi.mocked(fs.readFileSync).mockReturnValueOnce(markdownContentValidAuthor);

    const markdownFilePath = '/path/to/dir/valid-author.mdx';
    expect(validateAuthor({ markdownFilePath })).toEqual({
      contentType: 'author',
      username: 'jdoe',
      name: 'John Doe',
      github: 'account-github',
      twitter: 'account-twitter',
      linkedin: 'account-linkedin',
      content: 'This is some valid content',
    });
    expect(fs.readFileSync).toHaveBeenCalledWith(markdownFilePath, { encoding: 'utf-8' });
  });
});

describe('validatePost', () => {
  it('should throw an error if markdown is invalid', () => {
    vi.mocked(fs.readFileSync).mockReturnValueOnce(`---
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

    const markdownFilePath = '/path/to/dir/invalid-post.mdx';
    expect(() =>
      validatePost({
        authors: ['jdoe', 'jdupont'],
        markdownFilePath,
      })
    ).toThrow(`The markdown of the file "${markdownFilePath}" is invalid! Required at "title"`);
    expect(fs.readFileSync).toHaveBeenCalledWith(markdownFilePath, { encoding: 'utf-8' });
  });

  it('should throw an error if an article has a keyword included in the categories', () => {
    vi.mocked(fs.readFileSync).mockReturnValueOnce(`---
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
---
This is some valid content`);

    const markdownFilePath = '/path/to/dir/invalid-post-keyword-includes-in-categories.mdx';
    expect(() =>
      validatePost({
        authors: ['jdoe', 'jdupont'],
        markdownFilePath,
      })
    ).toThrow(`The markdown of the file "${markdownFilePath}" is invalid! Must not include a category. at "keywords"`);
    expect(fs.readFileSync).toHaveBeenCalledWith(markdownFilePath, { encoding: 'utf-8' });
  });

  it('should throw an error if an article has more than 5 keywords', () => {
    vi.mocked(fs.readFileSync).mockReturnValueOnce(`---
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

    const markdownFilePath = '/path/to/dir/invalid-post-too-many-keywords.mdx';
    expect(() =>
      validatePost({
        authors: ['jdoe', 'jdupont'],
        markdownFilePath,
      })
    ).toThrow(`The markdown of the file "${markdownFilePath}" is invalid! Too many items 😡. at "keywords"`);
    expect(fs.readFileSync).toHaveBeenCalledWith(markdownFilePath, { encoding: 'utf-8' });
  });

  it('should throw an error if an article has a duplicate keyword', () => {
    vi.mocked(fs.readFileSync).mockReturnValueOnce(`---
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

    const markdownFilePath = '/path/to/dir/invalid-post-duplicates-keywords.mdx';
    expect(() =>
      validatePost({
        authors: ['jdoe', 'jdupont'],
        markdownFilePath,
      })
    ).toThrow(`The markdown of the file "${markdownFilePath}" is invalid! No duplicates allowed. at "keywords"`);
    expect(fs.readFileSync).toHaveBeenCalledWith(markdownFilePath, { encoding: 'utf-8' });
  });

  it('should return valid data and content if markdown is valid', () => {
    vi.mocked(fs.readFileSync).mockReturnValueOnce(markdownContentValidArticle);

    const markdownFilePath = '/path/to/dir/valid-post.mdx';
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
      authors: ['jdoe'],
      categories: ['javascript'],
      content: 'This is some valid content',
    });
    expect(fs.readFileSync).toHaveBeenCalledWith(markdownFilePath, { encoding: 'utf-8' });
  });
});

describe('validateMarkdown', () => {
  it('should throw an error if a content is still written in markdown', () => {
    vi.mocked(glob.globSync).mockReturnValueOnce(['/path/to/dir/article.md']);

    expect(() => validateMarkdown()).toThrow(
      'The markdown of the file "/path/to/dir/article.md" is invalid! The markdown contents are no longer supported, rename the file with the .mdx extension!'
    );
  });

  it('should throw an error if an author already exists with the same username', () => {
    vi.mocked(glob.globSync)
      .mockReturnValueOnce([])
      .mockReturnValueOnce(['/path/to/dir/valid-author.mdx', '/path/to/dir/valid-author.mdx']);
    vi.mocked(fs.readFileSync)
      .mockReturnValueOnce(markdownContentValidAuthor)
      .mockReturnValueOnce(markdownContentValidAuthor);

    expect(() => validateMarkdown()).toThrow('This author already exists with the same username!');
    expect(fs.readFileSync).toHaveBeenCalledWith('/path/to/dir/valid-author.mdx', { encoding: 'utf-8' });
    expect(fs.readFileSync).toHaveBeenCalledWith('/path/to/dir/valid-author.mdx', { encoding: 'utf-8' });
  });

  it('should throw an error if an article already exists with the same slug and language', () => {
    vi.mocked(glob.globSync)
      .mockReturnValueOnce([])
      .mockReturnValueOnce(['/path/to/dir/valid-author.mdx'])
      .mockReturnValueOnce(['/path/to/dir/valid-post.mdx', '/path/to/dir/valid-post.mdx']);

    vi.mocked(fs.readFileSync)
      .mockReturnValueOnce(markdownContentValidAuthor)
      .mockReturnValueOnce(markdownContentValidArticle)
      .mockReturnValueOnce(markdownContentValidArticle);

    expect(() => validateMarkdown()).toThrow('This article already exists with the same slug and the same language!');
    expect(fs.readFileSync).toHaveBeenCalledWith('/path/to/dir/valid-author.mdx', { encoding: 'utf-8' });
    expect(fs.readFileSync).toHaveBeenCalledWith('/path/to/dir/valid-post.mdx', { encoding: 'utf-8' });
    expect(fs.readFileSync).toHaveBeenCalledWith('/path/to/dir/valid-post.mdx', { encoding: 'utf-8' });
  });
});

describe('validateTags', () => {
  it('should generate an error when an img tag is used', () => {
    const contentInvalid = `<img src="/imgs/articles/test.png" width="300px" alt="title image" />`;

    expect(() => validateTags(contentInvalid)).toThrow(
      `The img tag are no longer allowed, please use the markdown syntax or the Figure component! ${contentInvalid}`
    );
  });
});

describe('validateExistingAssets', () => {
  it('should throw an error when an asset file does not exist', () => {
    const assetPath = `_assets/articles/test.png`;
    const contentInvalid = 'This is a test post content with an asset reference {BASE_URL}/imgs/articles/test.png';

    vi.mocked(fs.existsSync).mockReturnValueOnce(false);

    expect(() => validateExistingAssets(contentInvalid)).toThrow(`The file does not exist "${assetPath}"!`);
    expect(fs.existsSync).toHaveBeenCalledWith(assetPath);
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
    {
      validHeadings: [
        { level: 2, text: 'Heading 1' },
        { level: 3, text: 'Subheading 1.1' },
        { level: 3, text: 'Subheading 1.2' },
        { level: 2, text: 'Heading 2' },
        { level: 3, text: 'Subheading 2.1' },
        { level: 3, text: 'Subheading 2.2' },
        { level: 2, text: 'Heading 3' },
        { level: 3, text: 'Subheading 3.1' },
        { level: 3, text: 'Subheading 3.2' },
        { level: 4, text: 'Sub-subheading 3.2.1' },
        { level: 4, text: 'Sub-subheading 3.2.2' },
        { level: 5, text: 'Sub-sub-subheading 3.2.2.1' },
        { level: 5, text: 'Sub-sub-subheading 3.2.2.2' },
        { level: 5, text: 'Sub-sub-subheading 3.2.2.3' },
        { level: 5, text: 'Sub-sub-subheading 3.2.2.4' },
        { level: 5, text: 'Sub-sub-subheading 3.2.2.5' },
        { level: 5, text: 'Sub-sub-subheading 3.2.2.6' },
        { level: 2, text: 'Heading 4' },
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
      markdownFilePath: '/path/to/some/file.mdx',
      content: ['## heading 1', tagInvalid].join('\n'),
    };

    expect(() => validateMarkdownContent(options)).toThrow(
      `The markdown of the file "${options.markdownFilePath}" is invalid! The img tag are no longer allowed, please use the markdown syntax or the Figure component! ${tagInvalid}`
    );
  });

  it('should validate an MDX content using an allowed component', () => {
    const content = [
      '## Heading',
      '',
      '<Reminder variant="tip" title="Tip">',
      '',
      'Some **markdown**',
      '',
      '</Reminder>',
    ];

    expect(validateMarkdownContent({ markdownFilePath: '/path/to/file.mdx', content: content.join('\n') })).toEqual(
      content.join('\n')
    );
  });

  it('should generate an error when an MDX content uses a component that is not allowed', () => {
    expect(() =>
      validateMarkdownContent({ markdownFilePath: '/path/to/file.mdx', content: '## Heading\n\n<Unknown />' })
    ).toThrow(/The MDX doesn't compile! .*Unknown/);
  });

  it('should generate an error with its position when an MDX content has an invalid syntax', () => {
    let error: MarkdownInvalidError | undefined;
    try {
      validateMarkdownContent({ markdownFilePath: '/path/to/file.mdx', content: '## Heading\n\nA {broken expression' });
    } catch (e) {
      error = e as MarkdownInvalidError;
    }

    expect(error?.reason).toMatch(/^The MDX doesn't compile!/);
    expect(error?.line).toEqual(3);
  });

  it('should validate the headings of an MDX content', () => {
    const content = '# Title\n\n<Reminder variant="tip" title="Tip">Text</Reminder>';

    expect(() => validateMarkdownContent({ markdownFilePath: '/path/to/file.mdx', content })).toThrow(
      'The h1 "Title" is reserved for the title in the metadata at the top of the markdown!'
    );
  });
});

describe('getImagesWithoutAlt', () => {
  it('should list the images without alternative text with their line', () => {
    const content = [
      '## Title',
      '![A described image]({BASE_URL}/imgs/articles/post/described.png)',
      '![]({BASE_URL}/imgs/articles/post/undescribed.png)',
      'Text and ![ ]({BASE_URL}/imgs/articles/post/blank.png?width=500)',
    ].join('\n');

    expect(getImagesWithoutAlt(content)).toEqual([
      { image: '![]({BASE_URL}/imgs/articles/post/undescribed.png)', line: 3 },
      { image: '![ ]({BASE_URL}/imgs/articles/post/blank.png?width=500)', line: 4 },
    ]);
  });

  it('should list the figures without alternative text', () => {
    const content = [
      '<Figure src="{BASE_URL}/imgs/described.png" alt="A described image">Caption</Figure>',
      '<Figure src="{BASE_URL}/imgs/undescribed.png" alt="">Caption</Figure>',
      '<Figure src="{BASE_URL}/imgs/missing.png" caption="Caption" />',
    ].join('\n');

    expect(getImagesWithoutAlt(content)).toEqual([
      { image: '<Figure src="{BASE_URL}/imgs/undescribed.png" alt="">', line: 2 },
      { image: '<Figure src="{BASE_URL}/imgs/missing.png" caption="Caption" />', line: 3 },
    ]);
  });

  it('should ignore the images inside code', () => {
    const content = ['```markdown', '![](image.png)', '```', 'Use `![](image.png)` to add an image'].join('\n');

    expect(getImagesWithoutAlt(content)).toEqual([]);
  });
});
