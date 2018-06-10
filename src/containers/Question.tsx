import React, { Component } from "react";
import { bindActionCreators } from "redux";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  ScrollView,
  RefreshControl,
  FlatList,
  Image,
  Button
} from "react-native";
import * as CounterActions from "../redux/counter/actions";
import { connect } from "react-redux";
import { Dispatch, AppState } from "../redux";
import { ViewModels } from "../Models/ViewModels";
import Loader from "./Loader";
import DataService from "../Services/DataService";

interface IQuestionProps {
  title: string;
  questionId: number;
  navigation: any;
}

interface IQuestionDispatchProps {}

interface IQuestionState {
  question: ViewModels.Question;
  refreshing: boolean;
  animating: boolean;
  newAnswer: ViewModels.Answer;
}

class Question extends Component<IQuestionProps & IQuestionDispatchProps,IQuestionState> {
  constructor(props: IQuestionProps) {
    super(props);
    this.state = {
      question: new ViewModels.Question({}),
      newAnswer: new ViewModels.Answer({}),
      refreshing: false,
      animating: false
    };

    this.onInputFieldValueChange = this.onInputFieldValueChange.bind(this);
  }

  componentDidMount() {
    this.setState({ animating: true });
    DataService.GetSelectedQuestion(this.props.navigation.state.params.questionId).then(ques =>{
      this.setState({
        question: ques,
        newAnswer: new ViewModels.Answer({ QuestionId: ques.Id }),
        animating: false
      })
    })

  }

  onRefresh() {
    this.setState({ refreshing: true });
    DataService.GetSelectedQuestion(this.props.navigation.state.params.questionId).then(ques =>{
      this.setState({
        question: ques,
        refreshing: false,
      })
    })
  }
  onInputFieldValueChange(fieldRef: string, value: string): void {
    var updatedState = {...this.state.newAnswer, [fieldRef]: value};
    this.setState({
      newAnswer: updatedState
    });
  }
  
  onAnswerAdd(){
    this.setState({ animating: true });
    DataService.AddNewAnswer(this.state.question, this.state.newAnswer).then((updatedAnswers : Array<ViewModels.Answer>) => {
      var ques = {...this.state.question, "Answers": updatedAnswers}
      this.setState({
        question: ques,
        newAnswer: new ViewModels.Answer({ QuestionId: ques.Id }),
        animating: false
      })
    });
  }

  handleOnLike(){
    debugger;
    DataService.LikeAQuestion(this.state.question);
  }

  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.title,
  });
  render() {
    return (
      <View style={styles.container}>
        <ScrollView 
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.onRefresh.bind(this)}
              />
            }
          >
          <View style={styles.questionContainer}>
            {this.state.animating && <Loader animating={this.state.animating} />}
            <Text>
              {this.state.question.Id > 0 && this.state.question.Title} {this.state.question.Likes}
            </Text>
            <Button onPress={this.handleOnLike.bind(this)} 
                title="Like"
                color="#17718a" />
          </View>
          <View style={styles.newAnswerContainer}>
            <TextInput {...this.state.newAnswer} multiline={true} value={this.state.newAnswer.Answer} onChangeText={(val) => this.onInputFieldValueChange('Answer', val)}  editable = {true} maxLength = {40} placeholder="Title"/>
            <Button onPress={this.onAnswerAdd.bind(this)} 
                title="Add Answer"
                color="#17718a" /></View>
          <FlatList
            style={styles.answerContainer}
            data={this.state.question.Answers}
            renderItem={({ item }) => (
              <View style={styles.answerContent}>
                <Text>{item.Likes}</Text>
                <Text>{item.Answer}</Text>
              </View>
            )}
          />
        </ScrollView>
      </View>
    );
  }
}

export default Question;

const styles = StyleSheet.create({
  container: {},
  questionContainer: {
    backgroundColor: "#fff",
    marginBottom: 10,
    minHeight: 50,
    padding: 5
  },
  newAnswerContainer: {
    backgroundColor: "#fff",
    minHeight: 40
  },
  answerContainer: { backgroundColor: "#fff", padding: 5 },
  answerContent: {}
});
