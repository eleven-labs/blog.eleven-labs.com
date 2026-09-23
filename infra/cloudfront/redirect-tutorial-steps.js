/**
 * CloudFront Function (runtime cloudfront-js-2.0), to attach to the viewer request of the distribution.
 *
 * A tutorial used to serve each of its steps on its own url, `/:lang/:slug/:step/`. Its steps are now the
 * sections of the tutorial page: the former urls are permanently redirected to the matching anchor.
 * Only a tutorial step has an url with three segments under a language, the author and category pages
 * aside, so no list of tutorials needs to be kept in sync here.
 *
 * The CI already turns these urls into 301 on S3 (bin/apply-s3-redirects.sh), which only works when the
 * distribution reads the website endpoint of the bucket. This function is the alternative when it reads
 * its REST endpoint instead.
 */
// eslint-disable-next-line no-unused-vars
function handler(event) {
  var request = event.request;
  var match = request.uri.match(/^\/(fr|en)\/(?!authors\/|categories\/)([^/.]+)\/([^/.]+)\/?$/);

  if (!match) {
    return request;
  }

  return {
    statusCode: 301,
    statusDescription: 'Moved Permanently',
    headers: {
      location: { value: '/' + match[1] + '/' + match[2] + '/#' + match[3] },
      'cache-control': { value: 'max-age=31536000' },
    },
  };
}
