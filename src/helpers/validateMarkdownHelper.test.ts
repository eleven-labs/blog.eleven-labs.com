import * as glob from 'glob';
import { vi } from 'vitest';

import { validateAuthor, validateMarkdown, validatePost } from './validateMarkdownHelper';

vi.mock('node:fs', () => ({
  readFileSync: vi.fn().mockImplementation((path: string) => {
    switch (path) {
      case '/path/to/dir/invalid-author.md':
        return `---
username: jdoe
github: account-github
twitter: account-twitter
linkedin: account-Linkedin
---
This is some valid content`;
      case '/path/to/dir/valid-author.md':
        return `---
username: jdoe
name: John Doe
github: account-github
twitter: account-twitter
linkedin: account-linkedin
---
This is some valid content`;
      case '/path/to/dir/invalid-post.md':
        return `---
lang: en
date: 2022-01-01
slug: valid-post
excerpt: This is a valid post excerpt
authors:
  - jdoe
categories:
  - javascript
---
This is some valid content`;
      case '/path/to/dir/invalid-post-keyword-includes-in-categories.md':
        return `---
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
This is some valid content`;
      case '/path/to/dir/invalid-post-too-many-keywords.md':
        return `---
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
Some content`;
      case '/path/to/dir/invalid-post-duplicates-keywords.md':
        return `---
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
Some content`;
      case '/path/to/dir/invalid-post-bad-syntax-on-markdown.md':
        return `---
lang: en
date: 2022-04-01
slug: my-post
title: My Post
excerpt: Some excerpt
authors:
  - jdoe
categories:
  - javascript
---
[Eleven Labs Link](https://eleven-labs.com/){:rel="nofollow noreferrer"}`;
      case '/path/to/dir/valid-post.md':
        return `---
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
    }
  }),
}));
vi.mock('glob');

describe('validateAuthor', () => {
  it('should throw an error if markdown is invalid', () => {
    const options = { markdownFilePath: '/path/to/dir/invalid-author.md' };
    expect(() => validateAuthor(options)).toThrowError(
      'The markdown of the file "/path/to/dir/invalid-author.md" is invalid ! Validation error: Required at "name"'
    );
  });

  it('should return valid data and content if markdown is valid', () => {
    const options = { markdownFilePath: '/path/to/dir/valid-author.md' };
    const author = validateAuthor(options);
    expect(author).toEqual({
      username: 'jdoe',
      name: 'John Doe',
      github: 'account-github',
      twitter: 'account-twitter',
      linkedin: 'account-linkedin',
      content: 'This is some valid content',
    });
  });
});

describe('validatePost', () => {
  it('should throw an error if markdown is invalid', () => {
    const options: Parameters<typeof validatePost>[0] = {
      authors: ['jdoe', 'jdupont'],
      markdownFilePath: '/path/to/dir/invalid-post.md',
    };
    expect(() => validatePost(options)).toThrowError(
      'The markdown of the file "/path/to/dir/invalid-post.md" is invalid ! Validation error: Required at "title"'
    );
  });

  it('should throw an error if an article has a keyword included in the categories', () => {
    const options: Parameters<typeof validatePost>[0] = {
      authors: ['jdoe', 'jdupont'],
      markdownFilePath: '/path/to/dir/invalid-post-keyword-includes-in-categories.md',
    };

    expect(() => validatePost(options)).toThrow(
      'The markdown of the file "/path/to/dir/invalid-post-keyword-includes-in-categories.md" is invalid ! Validation error: Must not include a category. at "keywords"'
    );
  });

  it('should throw an error if an article has more than 10 keywords', () => {
    const options: Parameters<typeof validatePost>[0] = {
      authors: ['jdoe', 'jdupont'],
      markdownFilePath: '/path/to/dir/invalid-post-too-many-keywords.md',
    };

    expect(() => validatePost(options)).toThrow(
      'The markdown of the file "/path/to/dir/invalid-post-too-many-keywords.md" is invalid ! Validation error: Too many items 😡. at "keywords"'
    );
  });

  it('should throw an error if an article has a duplicate keyword', () => {
    const options: Parameters<typeof validatePost>[0] = {
      authors: ['jdoe', 'jdupont'],
      markdownFilePath: '/path/to/dir/invalid-post-duplicates-keywords.md',
    };

    expect(() => validatePost(options)).toThrow(
      'The markdown of the file "/path/to/dir/invalid-post-duplicates-keywords.md" is invalid ! Validation error: No duplicates allowed. at "keywords"'
    );
  });

  it('should throw an error if an article has bad syntax on markdown', () => {
    const options: Parameters<typeof validatePost>[0] = {
      authors: ['jdoe', 'jdupont'],
      markdownFilePath: '/path/to/dir/invalid-post-bad-syntax-on-markdown.md',
    };

    expect(() => validatePost(options)).toThrow(
      'The markdown of the file "/path/to/dir/invalid-post-bad-syntax-on-markdown.md" is not compliant, it contains a syntax that is not allowed !'
    );
  });

  it('should return valid data and content if markdown is valid', () => {
    const options: Parameters<typeof validatePost>[0] = {
      authors: ['jdoe', 'jdupont'],
      markdownFilePath: '/path/to/dir/valid-post.md',
    };
    const post = validatePost(options);
    expect(post).toEqual({
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
  });
});

describe('validateMarkdown', () => {
  it('should throw an error if an author already exists with the same username', () => {
    vi.spyOn(glob, 'globSync').mockReturnValueOnce(['/path/to/dir/valid-author.md', '/path/to/dir/valid-author.md']);

    expect(() => validateMarkdown()).toThrow('This author already exists with the same username !');
  });

  it('should throw an error if an article already exists with the same slug and language', () => {
    vi.spyOn(glob, 'globSync')
      .mockReturnValueOnce(['/path/to/dir/valid-author.md'])
      .mockReturnValueOnce(['/path/to/dir/valid-post.md', '/path/to/dir/valid-post.md']);

    expect(() => validateMarkdown()).toThrow('This article already exists with the same slug and the same language !');
  });
});
