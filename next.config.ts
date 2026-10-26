import type { NextConfig } from 'next';

// Static export: Vercel serves the `out/` folder as plain files.
const config: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
};

export default config;
