import React from 'react';
import { AppRegistry } from 'react-native';
import App from './App';

AppRegistry.registerComponent('JetlyFlightBookingRN', () => App);

const rootTag = document.getElementById('root');
if (rootTag) {
  AppRegistry.runApplication('JetlyFlightBookingRN', {
    initialProps: {},
    rootTag,
  });
}
