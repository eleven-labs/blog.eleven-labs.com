module.exports = {
  extends: 'lighthouse:default',
  settings: {
    maxWaitForFcp: 15 * 1000,
    maxWaitForLoad: 35 * 1000,
    throttling: {
      cpuSlowdownMultiplier: 2
    },
    skipAudits: ['uses-http2'],
  },
  audits: [
    'metrics/first-contentful-paint-3g',
  ],
  categories: {
    performance: ({
      auditRefs: [
        { id: 'first-contentful-paint-3g', weight: 0 },
      ],
    }),
  },
};
