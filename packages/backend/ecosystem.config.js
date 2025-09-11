module.exports = {
  apps: [
    {
      name: 'krishi-mitra-backend',
      script: './dist/index.js',
      // Run on all available CPU cores
      instances: 'max',
      exec_mode: 'cluster',
      // Automatically restart the app if it crashes
      autorestart: true,
      // Do not watch for file changes in production
      watch: false,
      // Max memory before restart
      max_memory_restart: '1G',
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};