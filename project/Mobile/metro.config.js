/**
 * Metro configuration for React Native
 * https://facebook.github.io/metro/docs/configuration
 *
 * @format
 */

const { getDefaultConfig } = require('@react-native/metro-config');
const path = require('path');

// Create the default Metro config
const defaultConfig = getDefaultConfig(__dirname);

module.exports = {
  ...defaultConfig, // Use the default Metro configuration
  watchFolders: [
    // Watch the current project's node_modules directory
    path.resolve(__dirname, 'node_modules'), // Adjust if necessary
    // Add additional folders you want to watch (if any)
  ],
  resolver: {
    blockList: [
      // Avoid watching unnecessary directories (if needed)
      /buck-out/,
      /sdks\/hermes/,
    ],
    // Add other resolver settings if required
  },
};