module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            '@dtos': './src/dtos',
            '@assets': './src/assets',
            '@screens': './src/screens',
            '@components': './src/components',
            '@services': './src/services',
            '@storage': './src/storage',
            '@utils': './src/utils',
            '@hooks': './src/hooks',
            '@contexts': './src/contexts',
            '@routes': './src/routes'
          }
        }
      ]
    ]
  };
};
