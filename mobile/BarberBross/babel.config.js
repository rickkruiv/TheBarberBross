const path = require('path');

module.exports = function (api) {
  api.cache(true)

  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        '@tamagui/babel-plugin',
        {
          config: path.resolve(__dirname, './tamagui.config.js'),
          components: ['tamagui'],
          logTimings: false,
        },
      ],

      'react-native-reanimated/plugin',
    ],
  }
}