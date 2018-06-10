import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Button,
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
}

class AddQuestion extends Component<IAddQuestionProps, IAddQuestionState> {
    tags: string[];
    constructor(props:IAddQuestionProps) {
        super(props);
        this.state = {
            animating: false,
            newQuestion: new ViewModels.Question({})
        }
        this.tags = ["Sharepoint", ".Net"];
        this.onInputFieldValueChange = this.onInputFieldValueChange.bind(this);
        this.AddNewQuestion = this.AddNewQuestion.bind(this);
    }

    componentDidMount() {
    }
    static navigationOptions = {
        title: 'Add a Question'
    };

    AddNewQuestion(){
        this.setState({ animating: true });
        DataService.AddQuestion(this.state.newQuestion).then(isQuestionAdded => {
            debugger;
            const { navigation } = this.props;
            navigation.goBack();
            // navigation.state.params.onNewQuestionAdded({ newQuestion: this.state.newQuestion });
            this.setState({ animating: false });
        })
    }

    onInputFieldValueChange(fieldRef: string, value: string): void {
        var updatedState = {...this.state.newQuestion, [fieldRef]: value};
        this.setState({
            newQuestion: updatedState
        });
    } 

    render() {
        var ques = this.state.newQuestion;
        return (
        <View style={styles.formContainer}>
                {this.state.animating && <Loader animating={this.state.animating} />}
                <TextInput {...ques} value={ques.Title} onChangeText={(val) => this.onInputFieldValueChange('Title', val)}  editable = {true} maxLength = {40} placeholder="Title"/>
                <TextInput {...ques} value={ques.Description} onChangeText={(val) => this.onInputFieldValueChange("Description", val)} multiline={true} editable = {true} maxLength = {40} placeholder="Description"/>
                {this.tags.map(tag => <View style={styles.tags}><Text>{tag}</Text></View>) }
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
        height: '100%'
    },
    tags:{
        borderWidth: 1,
        marginRight: 10,
        width: 80
    }
});
