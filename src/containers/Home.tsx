import React, { Component } from "react";
import { bindActionCreators } from "redux";
import {
  View,
  StyleSheet,
  Text,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Button,
  ScrollView,
  RefreshControl
} from "react-native";
import * as QuestionActions from "../redux/Questions/action";
import { connect } from "react-redux";
import { Dispatch, AppState } from "../redux";
import Questions from "./Questions";
import Loader from "./Loader";
import DataService from "../Services/DataService";
import { ViewModels } from "../Models/ViewModels";

interface IHomeProps {
  questions?: Array<ViewModels.Question>;
  navigation? : any;
}

interface IHomeDispatchProps {
  loadQuestions: () => any;
}

interface IHomeState {
  UserName: string;
  Questions: Array<ViewModels.Question>;
  animating: boolean;
  refreshing: boolean;
}

class Home extends Component<IHomeProps & IHomeDispatchProps, IHomeState> {
  constructor(props) {
    super(props);
    this.state = {
      UserName: "",
      Questions: [],
      animating: false,
      refreshing: false
    };
  }
  onRefresh() {
    this.setState({ refreshing: true });
    DataService.GetQuestions().then(questions => {
      this.setState({
        Questions: questions,
        refreshing: false
      });
    });
  }
  componentDidMount() {
    this.setState({
      animating: true
    });
    DataService.GetQuestions().then(questions => {
      this.setState({
        Questions: questions,
        animating: false
      });
    });
  }

  onNewQuestionAdded = newQuestion =>{
    debugger;
  }

  static navigationOptions = {
    title: 'Catalyst',
    headerTintColor: '#fff',
    headerStyle: { backgroundColor: '#15233a' },
    headerLeft: null
  };
  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        {this.state.animating && <Loader animating={this.state.animating} />}
        {this.state.Questions.length > 0 && (
          <ScrollView 
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.onRefresh.bind(this)}
              />
            }
            style={{ width: "100%" }}>
            {/* <Questions questions={this.state.Questions} navigation={navigate} /> */}
            {this.state.Questions.length > 0 && this.state.Questions.map(
            (item: ViewModels.Question, index: number) => (
              <View style={ styles.questionContainer} key={index}>
                <Text style={{ position: "absolute", top: 15, left: 5 }}>
                  {item.Likes}
                </Text>
                <Image
                  source={{
                    uri:
                      "https://cdn3.iconfinder.com/data/icons/black-easy/512/538774-like_512x512.png"
                  }}
                  style={{
                    width: 20,
                    height: 20,
                    position: "absolute",
                    top: 15,
                    left: 25
                  }}
                  
                />
                <Text style={{ position: "absolute", top: 45, left: 5 }}>
                  {item.AnswersCount}
                </Text>
                <Image
                  source={{
                    uri:
                      "http://www.retns.ie/wp-content/uploads/sites/9/2016/11/comment-edit-icon.png"
                  }}
                  style={{
                    width: 20,
                    height: 20,
                    position: "absolute",
                    top: 45,
                    left: 25
                  }}
                />
                <TouchableOpacity style={styles.item} key={item.Id} onPress={() => navigate('Question', { title: item.Title , questionId: item.Id }) }>
                  <Text style={styles.text}>{item.Title}</Text>
                </TouchableOpacity>
              </View>
            )
          )}
          </ScrollView>
        )}
        <TouchableOpacity style={styles.addButtonContainer} onPress={() =>
            navigate('NewQuestion', { title: 'NewQuestion' })
          }>
          <Text style={{ color: "#fff", fontSize: 20 }}>+</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default connect<IHomeProps, IHomeDispatchProps>(
  (state: AppState) => ({
    questions: state.questions
  }),
  (dispatch: Dispatch) => ({
    loadQuestions: () => dispatch(QuestionActions.loadQuestions())
  })
)(Home);

const styles = StyleSheet.create({
  container: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    backgroundColor: "#e8eaea",
  },
  WelcomeText: { fontSize: 24, fontWeight: "bold" },
  addButtonContainer: {
    position: "absolute",
    bottom: 10,
    right: 15,
    borderRadius: 50,
    backgroundColor: "#4f6b51",
    padding: 15,
    paddingRight: 23,
    paddingLeft: 23
  },
  questionContainer: {
    position: "relative",
    backgroundColor: "#fff",
    marginTop: 10
  },
  item: {
    padding: 10,
    marginLeft: 50,
    marginRight: 15,
    height: 80
  },
  text: { color: "#4f603c" }
});
