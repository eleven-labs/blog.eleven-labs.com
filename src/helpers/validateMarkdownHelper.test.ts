import * as glob from 'glob';
import fs from 'node:fs';

import { validateAuthor, validateMarkdown, validatePost } from './validateMarkdownHelper';

describe('validateAuthor', () => {
  it('should throw an error if markdown is invalid', () => {
    jest.spyOn(fs, 'readFileSync').mockReturnValueOnce(`---
username: jdoe
github: account-github
twitter: account-twitter
linkedin: account-Linkedin
---
This is some valid content`);
    const options = { markdownFilePath: 'invalidAuthor.md' };
    expect(() => validateAuthor(options)).toThrowError(
      'The markdown of the file "invalidAuthor.md" is invalid ! Validation error: Required at "name"'
    );
  });

  it('should return valid data and content if markdown is valid', () => {
    jest.spyOn(fs, 'readFileSync').mockReturnValueOnce(`---
username: jdoe
name: John Doe
github: account-github
twitter: account-twitter
linkedin: account-linkedin
---
This is some valid content`);
    const options = { markdownFilePath: 'validAuthor.md' };
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
    jest.spyOn(fs, 'readFileSync').mockReturnValueOnce(`---
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
    const options: Parameters<typeof validatePost>[0] = {
      authors: ['jdoe', 'jdupont'],
      markdownFilePath: 'invalidPost.md',
    };
    expect(() => validatePost(options)).toThrowError(
      'The markdown of the file "invalidPost.md" is invalid ! Validation error: Required at "title"'
    );
  });

  it('should return valid data and content if markdown is valid', () => {
    jest.spyOn(fs, 'readFileSync').mockReturnValueOnce(`---
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
This is some valid content`);
    const options: Parameters<typeof validatePost>[0] = {
      authors: ['jdoe', 'jdupont'],
      markdownFilePath: 'validPost.md',
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
    jest
      .spyOn(glob, 'globSync')
      .mockReturnValueOnce(['path/to/fake-author-1.md', 'path/to/fake-author-2.md'])
      .mockReturnValueOnce(['path/to/fake-post-1.md', 'path/to/fake-post-2.md']);
    jest.spyOn(fs, 'readFileSync').mockReturnValue(`---
username: jdoe
name: John Doe 1
---
Some content`);

    expect(() => validateMarkdown()).toThrow('This author already exists with the same username !');
  });

  it('should throw an error if an article already exists with the same slug and language', () => {
    jest
      .spyOn(glob, 'globSync')
      .mockReturnValueOnce(['path/to/fake-author-1.md'])
      .mockReturnValueOnce(['path/to/fake-post-1.md', 'path/to/fake-post-2.md']);
    jest.spyOn(fs, 'readFileSync').mockReturnValueOnce(`---
username: jdoe
name: John Doe 1
---
Some content`).mockReturnValue(`---
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
Some content`);

    expect(() => validateMarkdown()).toThrow('This article already exists with the same slug and the same language !');
  });
});
