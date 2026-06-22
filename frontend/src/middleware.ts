import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host') || '';

  // Prevent rewriting static files and internal Next.js requests
  if (
    url.pathname.startsWith('/_next') ||
    url.pathname.startsWith('/api') ||
    url.pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Rewrite for specific subdomains
  if (hostname.startsWith('onboarding.') || url.pathname.startsWith('/onboarding-test')) {
    url.pathname = '/onboarding';
    return NextResponse.rewrite(url);
  }

  if (hostname.startsWith('portal.') || url.pathname.startsWith('/portal-test')) {
    // Both portal and onboarding map to the OnboardingApp historically
    url.pathname = '/onboarding';
    return NextResponse.rewrite(url);
  }

  if (hostname.startsWith('portfolio.') || url.pathname.startsWith('/portfolio-test')) {
    url.pathname = '/portfolio';
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
