/** @type {import('next').NextConfig} */
const webpack = require("webpack");
const { withAxiom } = require('next-axiom');
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
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
      {
          protocol: 'https',
          hostname: 'raw.githubusercontent.com',
          port: '',
          pathname: '/**',
          },
          {
          protocol: 'https',
          hostname: 'github.com',
          port: '',
          pathname: '/**',
          },
          {
          protocol: 'https',
          hostname: 'avatars.githubusercontent.com',
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
