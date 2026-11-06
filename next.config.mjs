/** @type {import('next').NextConfig} */
const nextConfig = {
  // Isolate build output so `npm run build` can never corrupt the dev server's
  // `.next` (run builds with NEXT_DIST_DIR=.next-build, see README).
  distDir: process.env.NEXT_DIST_DIR ?? '.next',
}

// Bundle analysis is opt-in: `ANALYZE=1 npm run build` (P1-7).
const withBundleAnalyzer = process.env.ANALYZE
  ? (await import('@next/bundle-analyzer')).default
  : null

export default withBundleAnalyzer
  ? withBundleAnalyzer({}) (nextConfig)
  : nextConfig
