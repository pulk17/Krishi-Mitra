// This file is crucial for a monorepo setup.
// It loads the environment variables from the root .env file
// BEFORE Next.js starts its build process. This makes the variables
// available to the entire frontend application via `process.env`.
require('dotenv').config({ path: '../../.env' });

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your Next.js configuration options can go here if needed in the future.
  // For example:
  // reactStrictMode: true,
};

module.exports = nextConfig;