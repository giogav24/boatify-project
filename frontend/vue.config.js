const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  transpileDependencies: true,
  chainWebpack: (config) => {
    config.devServer
      .allowedHosts['localhost','boatifyappfrontend.onrender.com'];
  },
});
