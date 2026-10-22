import { NextResponse } from 'next/server';

import { mainAppUrl } from '@/lib/main-app';

/**
 * This app no longer hosts a projects directory; the main Boundless app owns
 * it. Every `/projects` path redirects there permanently.
 *
 * This lives in the proxy rather than `next.config.ts` because config redirects
 * always forward the incoming query string, and the filter parameters differ
 * between the two apps. Here the destination is built by hand, so nothing leaks
 * across.
 */
export function proxy() {
  return NextResponse.redirect(mainAppUrl('/projects'), 308);
}

export const config = {
  matcher: ['/projects', '/projects/:path*'],
};
