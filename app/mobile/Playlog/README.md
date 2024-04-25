# Playlog Mobile Application

This project is built using Expo and React Native. If you're new to these technologies, don't worry. This guide will help you set up and run the project.

## Prerequisites

Before you begin, make sure your development environment includes `Node.js®` and an `npm` package manager.

## Node.js

React Native requires Node.js version 10 or newer.

- To install Node.js, visit [Node.js® website](https://nodejs.org/) and download the installer.
- To check your version, run `node -v` in a terminal/console window.

## npm package manager

React Native requires `npm` version 6 or newer.

- To update your npm, type `npm install npm@latest -g` in a terminal/console window.
- To check your version, run `npm -v`.

## Expo CLI

Expo CLI is a command line app that is the main interface between a developer and Expo tools. For the latest installation guide, please refer to the [Expo-Cli Documentation](https://docs.expo.dev/more/expo-cli/)

- To install Expo CLI, run `npm install expo` in a terminal/console window.
- To check your version, run `npx expo --version`.

## Running the project

1. Clone the repository: `git clone -b mobile-dev https://github.com/bounswe/bounswe2024group12.git`
2. Navigate to the project directory: `cd bounswe2024group12/app/mobile/Playlog/`
3. Install the dependencies: `npm install`
4. Start the project: `npm start`

This will start a development server for you and print a QR code in your terminal.

Use the Expo Go app on your iOS or Android device to scan the QR code. You can download the Expo Go app from the App Store or the Google Play Store. Please note that you need to be on the same Wi-Fi network as your computer.

You can also use an Android Emulator or iOS Simulator to run the app.

## Troubleshooting

Note: `npm` and `yarn` are package managers for Node.js. Using both of them in the same project may lead to some unintended behaviors. For consistency, we will only use `npm` . So, if any documentation or answer from a forum uses `yarn`, we replace it with `npm`.

Example: Instead of `yarn add packagename`, we write `npm install packagename`.


Note: If you encounter an error about a package, update the package by writing `npm install packagename` and relaunch the server by writing `npm start`. If it doesn't solve the problem, delete the `node_modules` directory, install all the packages again by writing `npm install` and relaunch the server by writing `npm start`.

If you encounter any issues, please refer to the [Expo Documentation](https://docs.expo.dev/).

## Support

If you require further support, or if you have any suggestions for the app, please email us at support@playlog.com

