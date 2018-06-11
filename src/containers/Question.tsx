import React, { Component } from "react";
import { bindActionCreators } from "redux";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
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

interface IQuestionDispatchProps { }

interface IQuestionState {
  question: ViewModels.Question;
  refreshing: boolean;
  animating: boolean;
  newAnswer: ViewModels.Answer;
  showTextField: boolean;
}

class Question extends Component<IQuestionProps & IQuestionDispatchProps, IQuestionState> {
  constructor(props: IQuestionProps) {
    super(props);
    this.state = {
      question: new ViewModels.Question({}),
      newAnswer: new ViewModels.Answer({}),
      refreshing: false,
      animating: false,
      showTextField: false
    };

    this.onInputFieldValueChange = this.onInputFieldValueChange.bind(this);
  }

  componentDidMount() {
    this.setState({ animating: true });
    DataService.GetSelectedQuestion(this.props.navigation.state.params.questionId).then(ques => {
      this.setState({
        question: ques,
        newAnswer: new ViewModels.Answer({ QuestionId: ques.Id }),
        animating: false
      })
    })

  }

  onRefresh() {
    this.setState({ refreshing: true });
    DataService.GetSelectedQuestion(this.props.navigation.state.params.questionId).then(ques => {
      this.setState({
        question: ques,
        refreshing: false,
      })
    })
  }
  onInputFieldValueChange(fieldRef: string, value: string): void {
    var updatedState = { ...this.state.newAnswer, [fieldRef]: value };
    this.setState({
      newAnswer: updatedState
    });
  }

  toAddAnswer() {
    this.setState({
      showTextField: true
    });
  }

  onAnswerAdd() {
    this.setState({ animating: true });
    DataService.AddNewAnswer(this.state.question, this.state.newAnswer).then((updatedAnswers: Array<ViewModels.Answer>) => {
      var ques = { ...this.state.question, "Answers": updatedAnswers }
      this.setState({
        question: ques,
        newAnswer: new ViewModels.Answer({ QuestionId: ques.Id }),
        animating: false,
        showTextField: false
      });
    });
  }

  handleOnLike() {
    debugger;
    DataService.LikeAQuestion(this.state.question);
  }

  static navigationOptions = ({ navigation }: any) => ({
    title: navigation.state.params.title,
  });
  render() {
    debugger;
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
          {this.state.question.Title && <View style={styles.questionContainer}>
            {this.state.animating && <Loader animating={this.state.animating} />}
            <View style={{ paddingLeft: 5, paddingRight: 5, marginLeft: 10, marginRight: 10, marginTop: 10, backgroundColor: "#ffffff" }}>
              <Text style={{ fontSize: 12, marginBottom: 5 }}>{this.state.question.Created}</Text>
              <Text style={{ fontSize: 21, marginBottom: 5 }}>{this.state.question.Title}</Text>
              <View style={{marginBottom:5}}>
                <Image
                  source={{
                    uri:
                    "https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/user_male2-128.png"
                  }}
                  style={{
                    width: 20,
                    height: 20,
                    position: "relative",
                    top: 0,
                    left: 5
                  }}
                />
                <View style={{ position: "absolute", top: 0, left: 27 }}>
                  <Text style={{ fontSize: 16 }}>{this.state.question.Author}</Text>
                </View>
              </View>
              <View style={styles.tagContainer}>
                {this.state.question.Tags.length > 0 && this.state.question.Tags.split(";").map((tag) => <Text style={styles.tagName}>{tag}</Text>)}
              </View>
              <View style={{ marginBottom: 5 }}>
                <Text style={{ fontSize: 16 }}>{this.state.question.Description}</Text>
              </View>
              {!this.state.showTextField && <View style={{ marginTop: 10, width: 100 }}>
                <Button onPress={this.toAddAnswer.bind(this)}
                  title="Answer"
                  color="#17718a" />
              </View>}
              {this.state.showTextField && <View style={{ marginTop: 10 }}>
                <TextInput {...this.state.newAnswer} multiline={true} value={this.state.newAnswer.Answer} onChangeText={(val) => this.onInputFieldValueChange('Answer', val)} editable={true} maxLength={40} placeholder="Title" />
                <Button onPress={this.onAnswerAdd.bind(this)}
                  title="Post"
                  color="#17718a" />
              </View>}
              <FlatList
                style={styles.answerContainer}
                data={this.state.question.Answers}
                renderItem={({ item }: any) => (
                  <View style={styles.answer} >
                    <TouchableOpacity style={styles.item} key={item.Id}>
                      <Text style={styles.questionTitle}>{item.Answer}</Text>
                    </TouchableOpacity>
                    <Text style={styles.authorName}>{item.Author}</Text>
                    <Image
                      source={{ uri: "https://cdn3.iconfinder.com/data/icons/black-easy/512/538774-like_512x512.png" }}
                      style={{ width: 20, height: 20, position: "absolute", bottom: 18, right: 10 }} />
                    <Text style={{ position: "absolute", bottom: 15, right: 35 }}>
                      {item.Likes}
                    </Text>
                  </View>
                )}
              />
            </View>
          </View>}
        </ScrollView>
      </View>
    );
  }
}

export default Question;

const styles = StyleSheet.create({
  container: {},
  answer: {
    position: "relative",
    // backgroundColor: "#fff",
    marginTop: 10,
    padding: 15
  },
  item: {

  },
  questionContainer: {},
  text: { color: "#4f603c" },
  newAnswerContainer: {},
  answerContainer: {},
  answerContent: {},
  questionTitle: {},
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 5
  },
  tagName: {
    fontSize: 14,
    marginRight: 10,
    backgroundColor: "#eaeaea",
    padding: 5
  },
  authorName: {
    fontSize: 12,
    color: "#4f603c",
  }
});
