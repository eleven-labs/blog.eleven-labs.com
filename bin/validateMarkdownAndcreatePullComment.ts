import { Octokit } from '@octokit/core';
import { createServer as createViteServer } from 'vite';

import { MarkdownInvalidError } from '../src/helpers/markdownHelper';

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

(async (): Promise<void> => {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom',
  });

  try {
    const { validateMarkdown } = await vite.ssrLoadModule('/src/helpers/markdownHelper.ts');
    validateMarkdown();
    vite.close();
  } catch (e) {
    vite.close();

    const markdownInvalidError = e as MarkdownInvalidError;
    const githubRef = process.env.GITHUB_REF || '';
    const pullRequestIdMatch = Array.from(githubRef.matchAll(/refs\/pull\/(.*)\/merge/g));
    let pullRequestId: string = '';
    if (pullRequestIdMatch.length) pullRequestId = pullRequestIdMatch[0][1];

    await octokit.request(`POST /repos/${process.env.GITHUB_REPOSITORY}/pulls/${pullRequestId}/comments`, {
      owner: process.env.GITHUB_REPOSITORY_OWNER,
      repo: process.env.GITHUB_REPOSITORY,
      pull_number: pullRequestId,
      body: markdownInvalidError.reason,
      commit_id: process.env.GITHUB_SHA,
      path: markdownInvalidError.markdownFilePathRelative,
      start_line: markdownInvalidError.line,
      start_side: 'RIGHT',
      line: 1,
      side: 'RIGHT',
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });
  }
})();
