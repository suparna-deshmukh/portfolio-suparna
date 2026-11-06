/** @type {import('next').NextConfig} */
const nextConfig = {
  // Isolate build output so `npm run build` can never corrupt the dev server's
  // `.next` (run builds with NEXT_DIST_DIR=.next-build, see README).
  distDir: process.env.NEXT_DIST_DIR ?? '.next',

  // P3-6: security headers. A full CSP ships in Report-Only once the inline pre-paint
  // theme script carries a hash; frame-ancestors is inert on its own but lands now.
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Content-Security-Policy', value: "frame-ancestors 'none'" },
        ],
      },
    ]
  },
}

// Bundle analysis is opt-in: `ANALYZE=1 npm run build` (P1-7).
const withBundleAnalyzer = process.env.ANALYZE
  ? (await import('@next/bundle-analyzer')).default
  : null

export default withBundleAnalyzer
  ? withBundleAnalyzer({}) (nextConfig)
  : nextConfig
