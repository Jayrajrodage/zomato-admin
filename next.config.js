/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/CreateProfile",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
