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
  StatusBar
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

const headerMaxHeight = 300;
const headerMinHieight = 73;
const headerScrollDistance = headerMaxHeight - headerMinHieight;

class Home extends Component<IHomeProps & IHomeDispatchProps, IHomeState> {
  
  constructor(props: any) {
    super(props);
    this.state = {
      UserName: "",
      Questions: [],
      animating: false,
      refreshing: false,
      scrollY: new Animated.Value(0,),
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
    headerLeft: null,
    header: null
  };

  renderScrollViewContent(navigate: any) {
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
                  {
                    item.Tags && item.Tags.split(';').map(t => <Text style={styles.tagName}>{t}</Text>)
                  }
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
    const scrollY = Animated.add(this.state.scrollY,0,);
    const headerTranslate = scrollY.interpolate({
      inputRange: [0, headerScrollDistance],
      outputRange: [0, -headerScrollDistance],
      extrapolate: 'clamp',
    });

    const imageOpacity = scrollY.interpolate({
      inputRange: [0, headerScrollDistance / 2, headerScrollDistance],
      outputRange: [1, 1, 0],
      extrapolate: 'clamp',
    });
    const imageTranslate = scrollY.interpolate({
      inputRange: [0, headerScrollDistance],
      outputRange: [0, 100],
      extrapolate: 'clamp',
    });

    const titleScale = scrollY.interpolate({
      inputRange: [0, headerScrollDistance / 2, headerScrollDistance],
      outputRange: [1, 1, 0.8],
      extrapolate: 'clamp',
    });
    const titleTranslate = scrollY.interpolate({
      inputRange: [0, headerScrollDistance / 2, headerScrollDistance],
      outputRange: [0, 0, -8],
      extrapolate: 'clamp',
    });
    return (
      <View style={[styles.container,styles.fill ]}>
        <StatusBar
          translucent
          barStyle="light-content"
          backgroundColor="rgba(0, 0, 0, 0.251)"
        />
        {this.state.animating && <Loader animating={this.state.animating} />}
        <Animated.ScrollView
          style={styles.fill}
          scrollEventThrottle={1}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }],
            { useNativeDriver: true },
          )}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={() => {
                this.setState({ refreshing: true });
                setTimeout(() => this.setState({ refreshing: false }), 1000);
              }}
              // Android offset for RefreshControl
              progressViewOffset={headerMaxHeight}
            />
          }
          // iOS offset for RefreshControl
          contentInset={{
            top: headerMaxHeight,
          }}
          contentOffset={{
            y: -headerMaxHeight,
          }}
        >
          {this.renderScrollViewContent(navigate)}
        </Animated.ScrollView>
        <Animated.View
          pointerEvents="none"
          style={[
            styles.header,
            { transform: [{ translateY: headerTranslate }] },
          ]}
        >
          <Animated.Image
            style={[
              styles.backgroundImage,
              {
                opacity: imageOpacity,
                transform: [{ translateY: imageTranslate }],
              },
            ]}
            source={require('./assets/appIcon.png')}
          />
        </Animated.View>
        <Animated.View
          style={[
            styles.bar,
            {
              transform: [
                { scale: titleScale },
                { translateY: titleTranslate },
              ],
            },
          ]}
        >
          <Text style={styles.title}>Catalyst</Text>
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
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#15233a',
    overflow: 'hidden',
    height: headerMaxHeight,
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: null,
    height: headerMaxHeight,
    resizeMode: 'cover',
  },
  bar: {
    backgroundColor: 'transparent',
    marginTop: 38,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  title: {
    color: 'white',
    fontSize: 18,
  },
  scrollViewContent: {
    // iOS uses content inset, which acts like padding.
    paddingTop: headerMaxHeight,
  },
  container: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    backgroundColor: "#e8eaea",
  },
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
