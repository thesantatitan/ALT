import React, {Component} from 'react';
import {ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import Feedback from '../../Databases/Feedback';
import {Button, Text} from 'react-native-elements';
import CountDown from 'react-native-countdown-component';
import StudentFeedbackCard from './StudentFeedbackCard';
import Toast from 'react-native-simple-toast';
import FeedbackResponses from '../../Databases/FeedbackResponses';
import moment from 'moment';

export default class FeedbackStudentPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            course: this.props.course,
            user: this.props.user,
            topics : [],
            responded : false,
            responses : {},
            error : null,
            loading : true
        }
        this.getTopics = this.getTopics.bind(this);
        this.studentResponses = this.studentResponses.bind(this)
    }

    studentResponses(key, value){
        let responses = this.state.responses
        responses[key] = value

        this.setState({
            responses : responses
        })
    }

    async getTopics (){
        const feedback = new Feedback()
        await feedback.getFeedbackDetails(this.state.course.passCode).then(async value => {
            const arr = value["topics"]
            let responses = {}
            let responded = false

            const feedbackResponse = new FeedbackResponses()
            await feedbackResponse.getFeedbackResponseForOneStudent(
                this.state.user.url,
                this.state.course.passCode,
                value["startTime"],
                value["endTime"]
            ).then(r=>{
                    responded = r
                })

            for await (const item of arr)
                responses[item] = -1

            await this.setState({
                topics : value["topics"],
                responses : responses,
                responded : responded
            })
        })
    }

    submitFeedback= async()=> {

        const {responses} = this.state
        var err = false

        for await (let response of Object.values(responses)) {
            if (response === -1) {
                err = true
                break
            }
        }

        if (err){
            await this.setState({
                error: "Please enter all responses."
            })
        }
        else{
            await this.setState({
                error : null
            })
        }

        if (!err) {
            Toast.show('Responses have been recorded!');
            const feedbackResponse = new FeedbackResponses()
            const timestamp = moment().format("DD/MM/YYYY HH:mm:ss")

            await feedbackResponse.getFeedbackResponse(this.state.user.url, this.state.course.passCode)
                .then((url) => {
                    if (url === null) {
                        feedbackResponse.createFeedbackResponse(
                            this.state.course.passCode,
                            this.state.user.url,
                            this.state.user.email,
                            this.state.responses,
                            timestamp
                        ).then(r => {
                            console.log("create")
                        })
                    } else {
                        feedbackResponse.setFeedbackResponse(
                            this.state.course.passCode,
                            this.state.user.url,
                            this.state.user.email,
                            this.state.responses,
                            timestamp,
                            url
                        ).then(r => {
                            console.log("update")
                        })

                    }
                })
            await this.setState({
                responded: true,
                topics: [],
                responses: {},
                error: null
            })
        }
    }

    componentDidMount() {
        this.getTopics().then(r=>{console.log(this.state.topics)})
    }

    render(){
        if(!this.state.loading){
        return(
            <SafeAreaView style={styles.safeContainer}>
                {this.props.currentFeedback===false
                    ?this.props.beforeFeedback === false
                        ?
                            <ScrollView>
                                <Text style={styles.or}> No current minute paper!</Text>
                            </ScrollView>
                                :
                        <ScrollView>
                            <Text style={styles.or}> No current minute paper!</Text>
                            <View style={styles.invisible}>
                                <CountDown
                                    until={this.props.beforeDuration + 5}
                                    onFinish={() =>  {
                                        this.getTopics().then(r=>{console.log(this.state.topics)})
                                        this.props.setFeedbackState()
                                    }}
                                />
                            </View>
                        </ScrollView>

                    : this.state.responded === true
                    ?
                        <ScrollView>
                            <Text style={styles.or}> No current minute paper!</Text>
                        </ScrollView>
                        :

                        <ScrollView>
                            <View style={styles.container}>
                                <Text style={styles.heading}> Minute Paper</Text>

                                <CountDown
                                    until={this.props.currentDuration + 5}
                                    size={24}
                                    onFinish={() => {
                                        this.setState({
                                            topics : [],
                                            responded : false,
                                            responses : {},
                                            error : null
                                        })
                                        this.props.setFeedbackState()
                                    }}
                                    digitStyle={{backgroundColor: '#FFF'}}
                                    digitTxtStyle={{color: '#2697BF'}}
                                    timeToShow={['M', 'S']}
                                    timeLabels={{m: 'Min', s: 'Sec'}}
                                />
                                <Text style={styles.text}> How well did you understand these topics?</Text>
                                <View style={styles.grid}>
                                    {this.state.topics.map((value, i) => (
                                        <StudentFeedbackCard
                                            value = {value}
                                            key = {i}
                                            index = {i}
                                            studentResponses = {this.studentResponses}
                                        />
                                    ))}
                                </View>

                                <View style={styles.buttonContainer}>
                                    { this.state.error ?
                                        <Text style={styles.errorMessage}>
                                            {this.state.error}
                                        </Text> : <Text/>}

                                    <Button style={styles.buttonMessage} title='SUBMIT' onPress={this.submitFeedback} />
                                </View>
                            </View>

                        </ScrollView>

                }
            </SafeAreaView>

        )}
        else{
            let that = this;
            setTimeout(function(){that.setState({loading: false})}, 1000);
            return(
                <View style={styles.preloader}>
                    <ActivityIndicator size="large" color="#9E9E9E"/>
                </View>
            )
        }
    }
}

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    heading : {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        paddingTop : 25,
        padding: 15,
        fontSize : 22,
        fontWeight: "bold",
        color: 'grey',
        marginTop: 5,
        textAlign: 'center',
    },
    container: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: 'center',
        padding : 10
    },
    or: {
        marginTop: 200,
        color: 'grey',
        alignSelf: "center",
        fontSize: 22,
        paddingBottom: 20,
        fontWeight : "bold"
    },
    buttonContainer: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        paddingTop : 15,
        paddingLeft : 30,
        paddingRight : 30
    },
    buttonMessage: {
        marginTop: 15,
        paddingTop : 15
    },
    invisible : {
        display:'none',
        opacity : 0
    },
    text : {
        flex: 1,
        display: "flex",
        padding: 10,
        fontSize : 16,
        color: 'grey',
        marginTop: 5,
    },
    grid: {
        marginTop: 10,
        marginBottom: 10,
        paddingTop : 10,
        paddingBottom : 10,
        alignItems: 'center',
    },
    errorMessage: {
        color: 'red',
        marginBottom: 5,
        paddingTop : 5,
        paddingBottom: 10,
    },
    preloader: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff'
    }
})