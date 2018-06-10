import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

import App from './src/App';

export default class MyApp extends Component {
  render() {
    return (
      <App />
    );
  }
}

AppRegistry.registerComponent('MyApp', () => MyApp);
