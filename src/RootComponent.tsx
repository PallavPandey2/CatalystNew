import React, { Component } from "react";
import { View, StyleSheet, Image, Text, TouchableOpacity } from "react-native";

import {
    StackNavigator,
} from 'react-navigation';


import {ReactNativeAD, ADLoginView} from 'react-native-azure-ad';
import LandingPage from "./containers/LnadingPage";
import Home from "./containers/Home";
import Question from "./containers/Question";
import AddQuestion from "./containers/AddQuestion";


const CLIENT_ID = '62f5b38a-2fdb-46ed-a62c-6639744a46db'
const AUTH_URL = 'https://login.microsoftonline.com/7a0790de-1f44-4125-887e-aae0c8e764cc/oauth2/authorize'
const ADContext = new ReactNativeAD({
  client_id : CLIENT_ID,
  // redirectUrl : 'http://localhost:8080',
  // Optional
  authority_host : AUTH_URL,
  // Optional
  // tenant  : 'common',
  // This is required if client_id is a web application id
  // but not recommended doing this way.
  // client_secret : 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  resources : [
    'https://graph.microsoft.com',
  ]
})

interface IProps{
    navigation?: any;
}

interface IState{
  info: any;
  shouldLogout: boolean;
  displayType: string;
}
class RootComponent extends Component<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      // this property will store user credential after logged in.
      info : null,
      // logout if this is true
      shouldLogout : false,
      // for display different views
      displayType : 'before_login'
    }
  }
  render() {
    return (
      <View style={styles.container}>
        {this._renderContent.bind(this)()}
      </View>
    );
  }

  _renderContent() {
    switch(this.state.displayType) {
      case 'before_login' :
        return <LandingPage onLoginBtnClick={this._showADLogin.bind(this)}/>
      case 'login' :
        // In fact we care if it successfully redirect to the URI, because
        // we alread have the access_token after successfully logged in.
        // set `hideAfterLogin` to `true` so that it won't display an error page.
        return [
          <ADLoginView
            key="webview"
            hideAfterLogin={true}
            style={{flex :1}}
            needLogout={this.state.shouldLogout}
            context={ADContext}
            onURLChange={this._onURLChange.bind(this)}
            onSuccess={this._onLoginSuccess.bind(this)}/>]
      case 'after_login' :
        return [this.props.navigation.navigate('Home')]
        // [
        //   // <View key="view" style={styles.container}>
        //   //   <TouchableOpacity key="button" style={styles.button}
        //   //     onPress={(this._logout.bind(this))}>
        //   //     <Text style={{ color: 'white' }}>Logout</Text>
        //   //   </TouchableOpacity>
        //   //   <EmployeeDirectoryApp key="ED" />
        //   // </View>
        //   // this.props.navigation.navigate('Home');
        //   // <Text key="text">You're logged in as {this.state.info} </Text>,
          
        // ]
      break
    }
  }
  _onURLChange(e:any) {
    // listen to webview URL change, if the URL matches login URL redirect user
    // to start page.
    let isLoginPage = e.url === `${AUTH_URL}?response_type=code&client_id=${CLIENT_ID}`
    if(isLoginPage && this.state.shouldLogout) {
      console.log('logged out')
      this.setState({
        displayType : 'before_login',
        shouldLogout : false
      })
    }
  }
  _showADLogin() {
    this.setState({
      displayType : 'login'
    })
  }
  _logout() {
    this.setState({
      displayType : 'login',
      shouldLogout : true
    })
  }
  _onLoginSuccess(cred: any) {
    console.log('user credential', cred)
    let access_token = ADContext.getAccessToken('https://graph.microsoft.com')
    fetch('https://graph.microsoft.com/beta/me', {
      method : 'GET',
      headers : {
        Authorization : `bearer ${access_token}`
      }
    })
    .then(res => res.json())
    .then(user => {
      console.log(user)
      this.setState({
        displayType : 'after_login',
        info : user.displayName
      })
    })
  }
}

export default RootComponent;

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
  },

  button : {
    margin : 24,
    backgroundColor : '#1a6ed1',
    padding : 12
  },
});
