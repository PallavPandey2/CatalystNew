import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  Image
} from "react-native";

import { ViewModels } from "../Models/ViewModels";
import Loader from "./Loader";

import DataService from "../Services/DataService";

interface IAddQuestionProps {
    navigation?: any;
}

interface IAddQuestionState {
    animating: boolean;
    newQuestion: ViewModels.Question;
    tags: any;
}

class AddQuestion extends Component<IAddQuestionProps, IAddQuestionState> {
    constructor(props:IAddQuestionProps) {
        super(props);
        this.state = {
            animating: false,
            newQuestion: new ViewModels.Question({}),
            tags: [
                {"Id": 1, "Name": "Sharepoint", "IsSelected": false},
                {"Id": 2, "Name": "Azure", "IsSelected": false},
                {"Id": 3, "Name": ".Net", "IsSelected": false}]
        }
        this.onInputFieldValueChange = this.onInputFieldValueChange.bind(this);
        this.AddNewQuestion = this.AddNewQuestion.bind(this);
        this.toggleTagSelection = this.toggleTagSelection.bind(this);
    }

    componentDidMount() {
    }
    static navigationOptions = {
        title: 'Add a Question',
        headerStyle: { marginTop: 25 },
    };

    onInputFieldValueChange(fieldRef: string, value: string): void {
        var updatedState = {...this.state.newQuestion, [fieldRef]: value};
        this.setState({
            newQuestion: updatedState
        });
    } 
    toggleTagSelection(selectedTag: any) : void {
        debugger;
        let updateTags = [...this.state.tags.map((tag: any) => { 
            if(tag.Id == selectedTag.Id) 
                tag.IsSelected = !tag.IsSelected; 
            return tag; 
        })]
        this.setState({
            tags: updateTags
        });

    }

    AddNewQuestion(){
        this.setState({ animating: true });
        debugger;
        // var newQues = {...this.state.newQuestion, Tags: this.state.tags.filter((tag: any) => {if(tag.IsSelected){return tag.Name}}).map().join(';')}
        DataService.AddQuestion(this.state.newQuestion).then(isQuestionAdded => {
            debugger;
            const { navigation } = this.props;
            navigation.goBack();
            // navigation.state.params.onNewQuestionAdded({ newQuestion: this.state.newQuestion });
            this.setState({ animating: false });
        })
    }

    render() {
        var ques = this.state.newQuestion;
        return (
        <View style={styles.formContainer}>
                {this.state.animating && <Loader animating={this.state.animating} />}
                <TextInput {...ques} value={ques.Title} onChangeText={(val) => this.onInputFieldValueChange('Title', val)}  editable = {true} maxLength = {40} placeholder="Title"/>
                <TextInput {...ques} value={ques.Description} onChangeText={(val) => this.onInputFieldValueChange("Description", val)} multiline={true} editable = {true} maxLength = {40} placeholder="Description"/>
                <View style={ styles.tagContainer }>
                    { this.state.tags.map((tag: any,i: number) => 
                        <TouchableOpacity key={i} style={styles.tagName} onPress={() => this.toggleTagSelection(tag)} >
                            <Text>
                                {tag.Name} 
                                {
                                    tag.IsSelected && <Image 
                                    source={require('./assets/selected.png')}
                                    style={{ width: 70, height: 70 }} />
                                }
                            </Text>
                        </TouchableOpacity>) 
                    }
                </View>
                <Button
                    onPress={this.AddNewQuestion}
                    title="Add Question"
                    color="#17718a"
                    accessibilityLabel="Add new Question"
                    />
        </View>
        );
    }
}

export default AddQuestion;

const styles = StyleSheet.create({
    formContainer: {
        backgroundColor: "#fff",
        height: '100%',
        padding: 10
    },
    tagContainer:{
        flexDirection:'row', 
        flexWrap:'wrap',
        paddingTop: 10,
        paddingBottom: 10
     },
     tagName: {
      marginRight: 10,
      backgroundColor: "#eaeaea",
      padding: 5
     }

});
