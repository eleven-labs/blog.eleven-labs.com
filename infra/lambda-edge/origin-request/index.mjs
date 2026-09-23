export const handler = async (event, context, callback) => {
  const { request } = event.Records[0].cf;
  const uri = request.uri;

  // amp redirection
  if (/^\/amp/.test(uri)) {
    return callback(
      null,
      {
        status: "301",
        statusDescription: "Moved Permanently",
        headers: {
          location: [{
            key: "Location",
            value: `https://${request.headers.host[0].value.replace(".s3.eu-west-3.amazonaws.com", "")}${uri.replace(/^\/amp/, "")}`,
          }],
        },
      }
    );
  }

  // tutorial step redirection: every step of a tutorial is now a section of its page, `/:lang/:slug/:step/`
  // points to `/:lang/:slug/#:step`. Only a tutorial step has an url with three segments under a language,
  // the author and category pages aside. The environments of the pull requests are served under the name
  // of their branch, which may itself contain slashes: any prefix is kept.
  const tutorialStepMatch = uri.match(/^(.*?)\/(fr|en)\/(?!authors\/|categories\/)([^/.]+)\/([^/.]+)\/?$/);
  if (tutorialStepMatch) {
    const [, prefix, lang, slug, step] = tutorialStepMatch;
    return callback(
      null,
      {
        status: "301",
        statusDescription: "Moved Permanently",
        headers: {
          location: [{
            key: "Location",
            value: `https://${request.headers.host[0].value.replace(".s3.eu-west-3.amazonaws.com", "")}${prefix}/${lang}/${slug}/#${step}`,
          }],
        },
      }
    );
  }

  // ignore if uri has extension
  if (/\.([a-z]|\d)+$/.test(uri)) {
    return callback(null, request);
  }

  // Add trailing slash and redirect if needed
  if (uri.slice(-1) !== "/") {
    return callback(
      null,
      {
        status: "301",
        statusDescription: "Moved Permanently",
        headers: {
          location: [{
            key: "Location",
            value: `https://${request.headers.host[0].value.replace(".s3.eu-west-3.amazonaws.com", "")}${uri}/`,
          }],
        },
      }
    );
  }

  // Add index.html
  request.uri = uri.replace(/\/$/, "\/index.html");

  return callback(null, request);
};
