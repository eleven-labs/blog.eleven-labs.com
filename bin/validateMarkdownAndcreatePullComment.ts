import { Octokit } from "@octokit/core";
import { createServer as createViteServer } from 'vite';

import { MarkdownInvalidError } from '../src/helpers/markdownHelper';
import { getArgs } from './binHelper';

const repo_name = process.argv[3]

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
});

(async (): Promise<void> => {
    const args = getArgs<{ ci: boolean }>();

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
        // console.log(`::set-output name=filePath::${markdownInvalidError.markdownFilePathRelative}`);
        // console.log(`::set-output name=reason::${markdownInvalidError.reason}`);
        // console.log(`::set-output name=line::${markdownInvalidError.line}`);
        // console.log(`::set-output name=column::${markdownInvalidError.column}`);

        const github_ref = process.env.GITHUB_REF
        const pull_request_id = Array.from(github_ref.matchAll('refs\/pull\/(.*)\/merge'))[0][1]

        await octokit.request(`POST /repos/${process.env.GITHUB_REPOSITORY}/pulls/${pull_request_id}/comments`, {
            owner: process.env.GITHUB_REPOSITORY_OWNER,
            repo: process.env.GITHUB_REPOSITORY,
            pull_number: process.env.GITHUB_REF,
            body: markdownInvalidError.reason,
            commit_id: process.env.GITHUB_SHA,
            path: markdownInvalidError.markdownFilePathRelative,
            start_line: markdownInvalidError.line,
            start_side: 'RIGHT',
            line: 1,
            side: 'RIGHT',
            headers: {
                'X-GitHub-Api-Version': '2022-11-28'
            }
        })
    }
})();
