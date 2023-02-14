/**
 * @typedef { Object } Summary
 * @prop { number } performance
 * @prop { number } accessibility
 * @prop { number } best-practices
 * @prop { number } seo
 * @prop { number } pwa
 */

/**
 * @typedef {Object} Manifest
 * @prop { string } url
 * @prop { boolean } isRepresentativeRun
 * @prop { string } htmlPath
 * @prop { string } jsonPath
 * @prop { Summary } summary
 */

/**
 * @typedef { Object } AssertionResult
 * @prop { string } name
 * @prop { number } expected
 * @prop { number } actual
 * @prop { [number, number, number] } values
 * @prop { string } operator
 * @prop { boolean } passed
 * @prop { string } auditId
 * @prop { string } level
 * @prop { string } url
 * @prop { string } auditTitle
 * @prop { string } auditDocumentationLink
 */

/**
 * @typedef { Object } LighthouseOutputs
 * @prop { Record<string, string> } links
 * @prop { Manifest[] } manifest
 * @prop { AssertionResult[] } assertionResults
 */

/**
 * @typedef { Object } AuditHead
 * @prop { string } key
 * @prop { string } title
 * @prop { string } documentationLink
 * @prop { string } operator
 * @prop { number } expected
 */

/**
 * @typedef { Object } Audit
 * @prop { boolean } passed
 * @prop { number } actual
 */

/**
 * @typedef { Object } AuditByUrl
 * @prop { string } path
 * @prop { string } url
 * @prop { Audit[] } audits
 */

/**
 * @param { number } score
 */
const formatScore = (score) => Math.round(score * 100);
const emojiScore = (/** @type { number } */ score) =>
  score >= 0.9 ? "🟢" : score >= 0.5 ? "🟠" : "🔴";

/**
 * @param { number } score
 */
const scoreRow = (score) => `${emojiScore(score)} ${formatScore(score)}`;

/**
 * @param { Manifest[] } manifests
 * @param { [string, string][] } links
 */
const summaryRows = (manifests, links) =>
  manifests
    .map(({ summary }, index) => {
      const [testedUrl, reportUrl] = links[index];
      const testedUrlParsed = new URL(testedUrl);
      return `| [${testedUrlParsed.pathname}](${reportUrl}) | ${scoreRow(
        summary.performance
      )} | ${scoreRow(summary.accessibility)} | ${scoreRow(
        summary["best-practices"]
      )} | ${scoreRow(summary.seo)} | ${scoreRow(summary.pwa)}`;
    })
    .join("\n");

/**
 * @param { Manifest[] } manifests
 * @param { [string, string][] } links
 */
const summaryTable = (manifests, links) => `Here's the summary:
| Path | Performance | Accessibility | Best practices | SEO | PWA |
| ---- | ----------- | ------------- | -------------- | --- | --- |
${summaryRows(manifests, links)}`;

/**
 * @param { AuditByUrl[] } auditsByUrl
 */
const auditRows = (auditsByUrl) =>
  auditsByUrl
    .map((auditByUrl) => {
      return `| [${auditByUrl.path}](${auditByUrl.url}) | ${auditByUrl.audits
        .map(
          (audit) =>
            `${audit.passed ? "🟢" : "🔴"} ${audit.actual < 1 ?
              Math.round(audit.actual * 100) / 100 :
              Math.round(audit.actual)
            }`
        )
        .join(" | ")} |`;
    })
    .join("\n");

/**
 * @param { string } key
 * @param { string } title
 */
const nameByAuditKey = (key, title) => {
  switch (key) {
    case 'first-contentful-paint':
      return 'FCP';
    case 'largest-contentful-paint':
      return 'LCP';
    case 'interactive':
      return 'TTI';
    case 'total-blocking-time':
      return 'TBT';
    case 'cumulative-layout-shift':
      return 'CLS';
    default:
      return title;
  }
};

/**
 * @param { AssertionResult[] } assertionResults
 */
const auditTable = (assertionResults) => {

  /** @type { Record<string, AuditHead> } */ const auditHeads = assertionResults.reduce((currentRows, assertionResult) => {
    if (!currentRows[assertionResult.auditId]) {
      currentRows[assertionResult.auditId] = {
        key: assertionResult.auditId,
        title: assertionResult.auditTitle,
        documentationLink: assertionResult.auditDocumentationLink,
        operator: assertionResult.operator,
        expected: assertionResult.expected
      };
    }

    return currentRows;
  }, {});

  const auditTitles = Object.values(auditHeads).map(
    (audit) =>
      `[${nameByAuditKey(audit.key, audit.title)}](${audit.documentationLink}) <br/> ${
        Math.round(audit.expected * 100) / 100
      } ${audit.operator}`
  );

  /** @type { Record<string, AuditByUrl> } */ const auditsByUrl = assertionResults.reduce(
    (currentAudits, assertionResult) => {
      if (!currentAudits[assertionResult.url]) {
        const testedUrlParsed = new URL(assertionResult.url);
        currentAudits[assertionResult.url] = {
          path: testedUrlParsed.pathname,
          url: assertionResult.url,
          audits: []
        };
      }

      currentAudits[assertionResult.url].audits.push({
        passed: assertionResult.passed,
        actual: assertionResult.actual
      });

      return currentAudits;
    },
    {}
  );

  return `Here's the audits:
| Path | ${auditTitles.join(" | ")} |
| ---- | ${auditTitles
    .map((auditTitle) =>
      Array.from({ length: auditTitle.length + 1 }).join("-")
    )
    .join(' | ')} |
${auditRows(Object.values(auditsByUrl))}`;
};

/**
 * @param { LighthouseOutputs } lighthouseOutputs
 */
function makeComment(lighthouseOutputs) {
  const manifests = lighthouseOutputs.manifest.filter(
    (manifest) => manifest.isRepresentativeRun
  );
  const links = Object.entries(lighthouseOutputs.links);
  const assertionResults = lighthouseOutputs.assertionResults;

  return `## ⚡️🏠 Lighthouse report
${summaryTable(manifests, links)}

${auditTable(assertionResults)}`;
}

module.exports = ({ lighthouseOutputs }) => makeComment(lighthouseOutputs);
