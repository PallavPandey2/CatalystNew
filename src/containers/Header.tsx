import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { View, StyleSheet, Text } from "react-native";
import Counter from "../components/Counter";
import * as CounterActions from "../redux/counter/actions";
import { connect } from "react-redux";
import { Dispatch, AppState } from "../redux";
import Questions from "./Questions";

export default class Header extends Component<{}, {}> {
  appName = "Catalyst";
  render() {
    return (
      <View style={styles.headerContainer}>
        <View style={styles.headerContent}>
          <Text style={styles.text}>{this.appName}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerContainer: {
    flex: 1,
    flexDirection: "row"
  },
  headerContent: {
    height: 50,
    backgroundColor: "#243066",
    width: "100%",
    marginBottom: 50,
    alignItems: "center"
  },
  text: {
    fontSize: 24,
    color: "#fff"
  }
});
