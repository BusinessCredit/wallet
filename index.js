/** @format */

// import {AppRegistry} from 'react-native';
// import App from './App';
// import {name as appName} from './app.json';

// AppRegistry.registerComponent(appName, () => App);


import { AppRegistry, YellowBox } from 'react-native';
import './global';
import './shim';
import crypto from 'crypto';
import Root from './app/root';
import './arrayPolyfills';

YellowBox.ignoreWarnings([ 
  'Warning: isMounted(...) is deprecated', 
  'Module RCTImageLoader' , 
  'Module RNOS requires',
  'Class RCTCxxModule'
]);
console.ignoredYellowBox = [ 'Remote debugger' ];

AppRegistry.registerComponent('BCACWallet', () => Root);