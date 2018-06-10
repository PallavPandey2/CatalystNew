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
  RefreshControl,
  Animated,
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
  scrollY: any;
}
const headerMaxHeight = 200;
const headerMinHeight = 40;
const headerScrollHeight = headerMaxHeight - headerMinHeight;

class Home extends Component<IHomeProps & IHomeDispatchProps, IHomeState> {
  
  constructor(props: any) {
    super(props);
    this.state = {
      UserName: "",
      Questions: [],
      animating: false,
      refreshing: false,
      scrollY: new Animated.Value(0)
    };
    this.renderScrollViewContent = this.renderScrollViewContent.bind(this);
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

  static navigationOptions = {
    title: 'Catalyst',
    headerTintColor: '#fff',
    headerStyle: { backgroundColor: '#15233a' },
    headerLeft: null
  };

  renderScrollViewContent(navigate) {
    const data = Array.from({length: 30});
    return (
      <View style={styles.scrollViewContent}>
        {this.state.Questions.length > 0 && this.state.Questions.map(
            (item: ViewModels.Question, index: number) => (
              <View style={ styles.questionContainer} key={index}>
                <Text style={styles.authorName}>{item.Author}</Text>
                <TouchableOpacity style={styles.item} key={item.Id} onPress={() => navigate('Question', { title: item.Title , questionId: item.Id }) }>
                  <Text style={styles.questionTitle}>{item.Title.length > 65 ? (item.Title.substr(0, 65)+ " ...") : item.Title }</Text>
                </TouchableOpacity>
                <View style={ styles.tagContainer }>
                  <Text style={styles.tagName}>{item.Tags}</Text>
                </View>
                
                <Image 
                  source={{ uri: "https://cdn3.iconfinder.com/data/icons/black-easy/512/538774-like_512x512.png" }}
                  style={{ width: 20, height: 20, position: "absolute", bottom: 18, right: 10 }} />
                <Text style={{ position: "absolute", bottom: 15, right: 35 }}>
                  {item.Likes}
                </Text>
                
                <Image
                  source={{ uri: "https://cdn3.iconfinder.com/data/icons/line-icons-medium-version/64/comment-512.png" }}
                  style={{ width: 20, height: 20, position: "absolute", bottom: 15, right: 60 }}
                />
                <Text style={{ position: "absolute", bottom: 15, right: 85 }}>
                  {item.AnswersCount}
                </Text>
                <Image
                  source={{ uri: "https://cdn3.iconfinder.com/data/icons/faticons/32/view-01-512.png" }}
                  style={{ width: 30, height: 30, position: "absolute", bottom: 10, right: 105 }}
                />
                <Text style={{ position: "absolute", bottom: 15, right: 140 }}>
                  {item.AnswersCount}
                </Text>
              </View>
            )
          )}
      </View>
    );
  }


  render() {
    const { navigate } = this.props.navigation;
    const headerHeight = this.state.scrollY.interpolate({
      inputRange: [0, headerScrollHeight],
      outputRange: [headerMaxHeight, headerMinHeight],
      extrapolate: 'clamp',
    });
    return (
      <View style={styles.container}>
        {this.state.animating && <Loader animating={this.state.animating} />}
        <ScrollView 
          refreshControl={ 
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh.bind(this)} />
          }
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {y: this.state.scrollY}}}]
          )}
          style={{ width: "100%" }}>

          {this.renderScrollViewContent(navigate)}
        </ScrollView>
        <Animated.View style={[styles.header, {height: headerHeight}]}>
          <View style={styles.bar}>
            <Text style={styles.title}>Catalyst</Text>
          </View>
        </Animated.View>
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
  fill: {
    flex: 1,
  },
  scrollViewContent: {
    marginTop: headerMaxHeight,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#03A9F4',
    overflow: 'hidden',
  },
  bar: {
    marginTop: 28,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    backgroundColor: 'transparent',
    color: 'white',
    fontSize: 18,
  },
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
    marginTop: 10,
    padding: 15
  },
  item: {
    height: 80,
    
  },
  authorName:{ 
    fontSize: 12,
    color: "#4f603c",
  },
  questionTitle: { 
    color: "#000",
    fontSize: 22
   },
   tagContainer:{
     flexDirection:'row', 
     flexWrap:'wrap',
  },
   tagName: {
    fontSize: 14,
    marginRight: 10,
    backgroundColor: "#eaeaea",
    padding: 5
   }
});
