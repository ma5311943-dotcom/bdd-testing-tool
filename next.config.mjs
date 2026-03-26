/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  serverExternalPackages: [
    'lighthouse',
    'puppeteer',
    'chrome-launcher',
    '@cucumber/cucumber',
    'axe-core',
    '@axe-core/puppeteer',
    'mongoose',
  ],
};

export default nextConfig;
