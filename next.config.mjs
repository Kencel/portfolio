/** @type {import('next').NextConfig} */

// The RESUME menu row opens this host in a new tab. It is an alias for the one
// deployment rather than a separate project, so everything it serves is the
// PDF in `public/` — no Next page, no layout, just the browser's own viewer.
const RESUME_HOST = 'resume.kenazc.com';

const nextConfig = {
  images: { unoptimized: true },
  async rewrites() {
    return {
      // beforeFiles, not the plain array form: `/` resolves to app/page.tsx in
      // the filesystem step, which an afterFiles rewrite runs *after* — so the
      // subdomain's root would serve the portfolio instead of the resume.
      beforeFiles: [
        {
          source: '/:path*',
          has: [{ type: 'host', value: RESUME_HOST }],
          destination: '/resume.pdf',
        },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
