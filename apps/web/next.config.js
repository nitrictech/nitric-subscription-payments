module.exports = {
  reactStrictMode: true,
  api: {
    bodyParser: {
      bodyParser: false, // Disallow body parsing, consume as stream
    },
  },
  // To avoid any CORs issues use NextJS as a proxy for Nitric API
  // We are working on it :)
  async rewrites() {
    return [
      {
        source: "/apis/:path*",
        destination: `${process.env.API_BASE_URL}/apis/:path*`, // Proxy to Backend
      },
    ];
  },
};
