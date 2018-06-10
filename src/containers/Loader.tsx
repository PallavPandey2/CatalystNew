import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { View, StyleSheet, Text, ActivityIndicator } from "react-native";
import * as QuestionActions from "../redux/Questions/action";
import { connect } from "react-redux";
import { Dispatch, AppState } from "../redux";
import Header from "./Header";
import Questions from "./Questions";
import DataService from "../Services/DataService";
import { ViewModels } from "../Models/ViewModels";

interface Iprops {
  animating: boolean;
}

class Loader extends Component<Iprops, {}> {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator
          animating={this.props.animating}
          color="#17718a"
          size="large"
          style={styles.activityIndicator}
        />
      </View>
    );
  }
}

export default Loader;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    position: 'absolute',
    top: '30%',
    left: '45%'
  },
  activityIndicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 80
  }
});
