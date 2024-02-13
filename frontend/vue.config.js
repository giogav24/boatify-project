const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  transpileDependencies: true,
});

module.exports = {
  devServer: {
    allowedHosts: [
      'localhost',
      'boatifyappfrontend.onrender.com',
    ],
  },
};

