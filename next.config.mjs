/** @type {import('next').NextConfig} */
const nextConfig = {
  // Uploaded media is written at runtime and served through a route handler,
  // so it never passes through the image optimizer.
  images: { unoptimized: true },
};

export default nextConfig;
