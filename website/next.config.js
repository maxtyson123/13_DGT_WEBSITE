/** @type {import('next').NextConfig} */
const webpack = require("webpack");
const { withAxiom } = require('next-axiom');
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['i.ibb.co', 'rongoa.stream'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'rongoa.stream',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) =>
  {
    config.plugins.push(
        new webpack.ProvidePlugin({
          $: "jquery",
          jQuery: "jquery",
          "window.jQuery": "jquery",
        })
    );
  return config;
  },
}

module.exports = withAxiom(nextConfig);
