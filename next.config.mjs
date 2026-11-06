/** @type {import('next').NextConfig} */
const nextConfig = {
  // Isolate build output so `npm run build` can never corrupt the dev server's
  // `.next` (run builds with NEXT_DIST_DIR=.next-build, see README).
  distDir: process.env.NEXT_DIST_DIR ?? '.next',
}

export default nextConfig
