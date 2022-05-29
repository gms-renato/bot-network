module.exports = {
  apps: [
    {
      name: "bot-network",
      script: "./build/index.js",
    },
    {
      name: "bot-network-wan",
      script: "./build/metrics-wan.js",
    },
  ],
};
