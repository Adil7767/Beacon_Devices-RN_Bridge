/**
 * @format
 */

import { AppRegistry } from 'react-native';
// import App from './src1/App2'; simple ble example
// import App from './src2/app'; //ble  example
// import { App } from './src/App'; //ble plx example
import App from './src3/app'; //native module

import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
