import React, { Component } from "react";
import { View, StyleSheet, Image, Text, TouchableOpacity } from "react-native";
import {ReactNativeAD, ADLoginView} from 'react-native-azure-ad';

interface ILandingProps{
  onLoginBtnClick?: Function
}

class LandingPage extends Component<ILandingProps, any> {
  constructor(props : any) {
    super(props);
  }

  
  render() {
    return (
      <View style={styles.container}>
      <Image
        source={require('./assets/appIcon.png')}
        style={{
        width: 70,
        height: 70,
        }}
      />
        <Text style={styles.appName}>MaileJol</Text>
        <Text style={styles.appSlogan}>The Employee Intergration App</Text>
        <TouchableOpacity style={styles.loginBtn} onPress={this.props.onLoginBtnClick.bind(this)}>
        <Image source={{
            uri:
                "https://static.applenovinky.cz/wp-content/uploads/2014/03/microsoft-office-2013-100x100.png"
            }}
            style={{ width: 20, height: 20, position: 'absolute', top:10, left: 10}}
        />
        <Text>O365 Login</Text>
        </TouchableOpacity>
      </View>
    );
  } 
}

export default LandingPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#15233a",
    height: "100%",
    width: "100%"
  },
  appName: {
      color: '#fff',
      fontSize: 32
  },
  appSlogan: {
    color: '#fff',
    fontSize: 14
  },
  loginBtn: {
    backgroundColor: '#fff',
    padding: 10,
    paddingLeft: 35,
    marginTop: 20,
    shadowColor: '#303838',
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    shadowOpacity: 0.35,
    position: 'relative'
  }
});
