module.exports = {
  apps: [
    {
      name: "API",
      script: "server.js",
      instances: "max",
      exec_mode: "cluster",
      kill_timeout: 1000,
      max_memory_restart: "100M",
      env: {
        NODE_ENV: "development"
      },
      env_production: {
        PORT: process.env.PORT,
        NODE_ENV: "production"
      }
    }
  ]
};
