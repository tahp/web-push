// next.config.js
const path = require('path');

module.exports = {
  reactStrictMode: true,

  // Optional: define custom static file handling
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Prevent server-side bundling of service worker
      config.externals.push({
        'sw.js': 'sw.js',
      });
    }

    return config;
  },

  // Optional: custom headers or rewrites if needed
  async headers() {
    return [
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Service-Worker-Allowed',
            value: '/',
          },
        ],
      },
    ];
  },
};
