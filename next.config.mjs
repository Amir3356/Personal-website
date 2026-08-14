/** @type {import('next').NextConfig} */
const nextConfig = {
  // Uploaded media is written at runtime and served through a route handler,
  // so it never passes through the image optimizer.
  images: { unoptimized: true },

  // Dev only: the dev server rejects requests for /_next/* assets that arrive
  // from an origin it doesn't recognise, which 403s every chunk when the site
  // is opened from another device on the LAN (e.g. a phone). Listing the
  // private ranges here permits that. Has no effect on a production build.
  allowedDevOrigins: [
    '192.168.8.19',
    '192.168.*.*',
    '10.*.*.*',
    '172.16.*.*',
    '172.17.*.*',
    '172.18.*.*',
    '172.19.*.*',
  ],
};

export default nextConfig;
