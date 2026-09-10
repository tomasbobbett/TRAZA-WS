export function resolveOrigin(config = {}, env = process.env) {
  const netlifyOrigin = env.NETLIFY === 'true'
    ? (env.CONTEXT && env.CONTEXT !== 'production'
      ? env.DEPLOY_PRIME_URL || env.URL
      : env.URL)
    : '';
  const origin = (env.SITE_ORIGIN || netlifyOrigin || config.origin || '').replace(/\/+$/, '');
  if (origin) {
    const url = new URL(origin);
    if (url.protocol !== 'https:' || url.origin !== origin || url.username || url.password) {
      throw new Error('SITE_ORIGIN must be an HTTPS origin without a path.');
    }
  }
  if (env.NETLIFY === 'true' && !origin) throw new Error('Netlify did not provide a site URL. Set SITE_ORIGIN to the public HTTPS address.');
  return origin;
}
