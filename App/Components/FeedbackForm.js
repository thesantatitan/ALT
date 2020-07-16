import React, {Component} from 'react';
import {SafeAreaView, StyleSheet, View, ScrollView, TextInput} from 'react-native';
import {Icon, Text, Button} from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import Feedback from '../Databases/Feedback';
import {Button as IosButton } from 'react-native';
export default class FeedbackForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            course: this.props.course,
            user: this.props.user,
            textInput : [],
            inputData : [],
            date : null,
            iosdate : moment().format("DD/MM/YYYY"),
            showDate : false,
            showTime : false,
            time : null,
            iostime : moment().format("HH:mm:ss"),
            error : null,
            topics : [],
            duration : 1,
        }
    }


    addTextInput = (index) => {
        let textInput = this.state.textInput;
        textInput.push(
                <TextInput
                    style={styles.textInput}
                    key = {index}
                    onChangeText={(text) => this.addValues(text, index)}
                />
            );
        this.setState({ textInput });
    }

    updateTopics = async () => {
        let arr = []
        const t = this.state.inputData
        for await (const item of t){
            if (item['text'].length!==0) {
                arr.push(item['text']);
            }
        }
        await this.setState({
            topics:arr
        })
    }

    addFeedback = async () => {

        if (this.state.inputData.length === 0) {
            this.setState({
                error: "Please enter at least one topic."
            })
        }
        else if(Platform.OS==='android'&& (this.state.date == null || this.state.time == null)){

            this.setState({
                error: "Please schedule feedback."
            })
        }
        else {
            const feedback = new Feedback()
            let startTime = "0"

            if(Platform.OS==='android')
                startTime = this.state.date + " " + this.state.time
           else
                startTime = this.state.iosdate + " " + this.state.iostime

            let endTime = moment(startTime, "DD/MM/YYYY HH:mm:ss").add(this.state.duration, 'minutes').format("DD/MM/YYYY HH:mm:ss")

            const temp = moment(startTime, "DD/MM/YYYY HH:mm:ss")
            const curr = moment()

            if(curr>temp)
            {
                this.setState({
                    error: "Please schedule correct time."
                })
            }
           else
            {
                await this.updateTopics().then(r=>{console.log()})

                await feedback.getFeedback(this.state.course.passCode)
                    .then((url) => {
                        console.log(url)
                        if (url === null) {
                            console.log("hello")
                            feedback.createFeedback(
                                this.state.course.passCode,
                                startTime,
                                endTime,
                                this.state.topics,
                                this.state.user.email
                            ).then(r => {
                                console.log("create")
                            })
                        } else {
                            console.log("hello")
                            feedback.setFeedback(
                                this.state.course.passCode,
                                startTime,
                                endTime,
                                this.state.topics,
                                this.state.user.email,
                                url,
                                false
                            ).then(r => {
                                console.log("update")
                            })

                        }
                        this.props.setTopics(this.state.topics)
                        this.setState({
                            textInput : [],
                            inputData : [],
                            date : null,
                            showDate : false,
                            showTime : false,
                            time : null,
                            error : null,
                            topics : [],
                        })

                    })
            }

        }
    }

    addValues = (text, index) => {
        let dataArray = this.state.inputData;
        let checkBool = false;
        if (dataArray.length !== 0){
            dataArray.forEach(element => {
                if (element.index === index ){
                    element.text = text;
                    checkBool = true;
                }
            });
        }
        if (checkBool){
            this.setState({
                inputData: dataArray
            });
        }
        else {
            dataArray.push({'text':text,'index':index});
            this.setState({
                inputData: dataArray
            });
        }
    }

    onChangeDate = (event, selectedDate) => {
        const currentDate = moment(selectedDate).format("DD/MM/YYYY")
        this.setState({
            date : currentDate,
            showDate : false,
            showTime : false
        })
    }

    onChangeTime = (event, selectedDate) => {
        const currentDate = moment(selectedDate).format("HH:mm:ss")
        this.setState({
            time : currentDate,
            showDate : false,
            showTime : false
        })
    }
    iOSonChangeDate = (event, selectedDate) => {
        const currentDate = moment(selectedDate).format("DD/MM/YYYY")
        this.setState({
            iosdate : currentDate,
        })
    }

    iOSonChangeTime = (event, selectedDate) => {
        const currentDate = moment(selectedDate).format("HH:mm:ss")
        this.setState({
            iostime : currentDate,
        })
    }
    doneButton = () =>{
        this.setState({
            showDate : false,
            showTime : false,
        })
    }

    showDatePicker = ()=>{
        this.setState({
            showDate : true,
            showTime : false
        })
    }

    showTimePicker = ()=>{
        this.setState({
            showDate : false,
            showTime : true
        })
    }

    render(){

        return(
            <SafeAreaView style={styles.safeContainer}>
                <ScrollView>
                    <Text style={styles.heading}> New Minute Paper</Text>

                    <View style={styles.rowContainer}>
                        <Text style={styles.topic}> Topics </Text>
                        <Icon
                            name='plus-circle'
                            type='font-awesome'
                            style={{borderRadius:1}}
                            onPress={() => this.addTextInput(this.state.textInput.length)}
                        />

                    </View>

                    {this.state.textInput.map((value) => {
                        return value
                    })}

                    <View style={styles.buttonRowContainer}>
                        <View style={styles.container}>
                            { Platform.OS==='ios'?
                                <View>
                                    <IosButton onPress={this.showDatePicker} title="Select Date" />
                                    <Text style={styles.dateTime}> {this.state.iosdate!=null ? this.state.iosdate:""}</Text>
                                </View>
                            :
                                <View>
                                    <Button onPress={this.showDatePicker} title="Select Date" />
                                    <Text style={styles.dateTime}> {this.state.date!=null ? this.state.date:""}</Text>
                                </View>
                            }

                        </View>
                        <View style={styles.container}>
                            {  Platform.OS === 'ios' ?
                                <View>
                                    <IosButton onPress={this.showTimePicker} title="Select Time" />
                                    <Text style={styles.dateTime}> {this.state.iostime!=null ? this.state.iostime:""}</Text>
                                </View>
                                :
                                <View>
                                    <Button onPress={this.showTimePicker} title="Select Time" />
                                    <Text style={styles.dateTime}> {this.state.time!=null ? this.state.time:""}</Text>
                                </View>
                            }

                        </View>
                    </View>

                    <View>
                        { this.state.showDate
                            ?
                            <View>

                                { Platform.OS==='ios'?
                                    <View>
                                        <View style={styles.iosButton}>
                                            <IosButton  onPress={this.doneButton} title="Done"/>
                                        </View>
                                        <DateTimePicker
                                            testID="datePicker"
                                            value={moment(this.state.iosdate,"DD/MM/YYYY").toDate()}
                                            mode={'date'}
                                            is24Hour={true}
                                            display="default"
                                            minimumDate = {moment().toDate()}
                                            maximumDate = {moment().add(30,'days').toDate()}
                                            onChange={this.iOSonChangeDate}
                                        />
                                    </View>
                                    :
                                    <DateTimePicker
                                        testID="datePicker"
                                        value={moment().toDate()}
                                        mode={'date'}
                                        is24Hour={true}
                                        display="default"
                                        minimumDate = {moment().toDate()}
                                        maximumDate = {moment().add(30,'days').toDate()}
                                        onChange={this.onChangeDate}
                                    />
                                }
                            </View>
                            : this.state.showTime
                            ?
                            <View>
                                { Platform.OS==='ios'?
                                    <View>
                                        <View style={styles.iosButton}>
                                            <IosButton onPress={this.doneButton} title="Done"/>
                                        </View>
                                        <DateTimePicker
                                            testID="timePicker"
                                            value={moment(this.state.iostime,"HH:mm:ss").toDate()}
                                            mode={'time'}
                                            is24Hour={true}
                                            display="default"
                                            onChange={this.iOSonChangeTime}
                                        />
                                    </View>
                                    :
                                    <DateTimePicker
                                        testID="timePicker"
                                        value={moment().toDate()}
                                        mode={'time'}
                                        is24Hour={true}
                                        display="default"
                                        onChange={this.onChangeTime}
                                    />
                                }

                            </View>

                            :<Text/>
                        }
                    </View>

                    <View style={styles.buttonContainer}>

                    {this.state.error ?
                        <Text style={styles.errorMessage}>
                            {this.state.error}
                        </Text> : <Text/>}
                        <Button style={styles.buttonMessage} title='SUBMIT' onPress={this.addFeedback} />
                    </View>

                </ScrollView>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
    },
    errorMessage: {
        color: 'red',
        marginBottom: 15,
        paddingTop : 20,
        paddingBottom: 10,
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
    dateTime : {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: 10,
        fontSize : 16,
        color: 'grey',
        marginTop: 5,
        textAlign: 'center',
    },
    topic : {
        padding: 10,
        fontSize : 18,
        fontWeight: "bold",
        color: 'grey',
        paddingLeft :20
    },
    container: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: 15,
    },
    rowContainer: {

        paddingVertical: 15,
        paddingHorizontal: 10,
        flexDirection: "row",
        alignItems: "center"
    },
    iosButton :{
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingRight :30,
    },
    buttonRowContainer: {
        flex: 1,
        display: "flex",
        flexWrap: "wrap",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingTop: 10,
        paddingBottom:10,
        paddingLeft : 30,
        paddingRight : 30
    },
    textInput: {
        width: '80%',
        marginBottom: 15,
        paddingBottom: 15,
        alignSelf: "center",
        borderColor: "#ccc",
        borderBottomWidth: 1
    },
    buttonContainer: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        paddingLeft : 30,
        paddingRight : 30
    },
})