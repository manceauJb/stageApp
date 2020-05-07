import React from 'react'
import { StyleSheet, View, TextInput, Button, Text, FlatList, ActivityIndicator, Platform, CheckBox ,AsyncStorage} from 'react-native'
import ENV from '../environment'
import {getIdFromRegistration} from "../API/Api"
import Toast from 'react-native-tiny-toast'
import firebase from 'firebase'

class Inscription extends React.Component{

    constructor(props){
        super(props)
        this.state= {
            name : "",
            username : "",
            email : "",
            tel : "",
            allowNewletter : false,
            allowSms : false,
            rgpd : false,
            validName : true,
            validUsername: true,
            validEmail: true,
            validTel: true,
            validRgpd: true,
            logged: null,
            password:""
        }
        this.id = undefined
    }



    async buildRequest(){
        let profile = {
            name: this.state.name,
            username: this.state.username,
            password: this.state.password,
            email: this.state.email,
            tel: this.state.tel,
            newsletter: this.state.allowNewletter,
            sms: this.state.allowSms,
            rgpd: this.state.rgpd
        }

        
        let resp = await getIdFromRegistration(profile)
        console.log(profile);
        if(resp.success){
            
            await AsyncStorage.setItem("prenom", this.state.username);
            await AsyncStorage.setItem("nom", this.state.name);
            
            await AsyncStorage.setItem("email",this.state.email);
            await AsyncStorage.setItem("tel",this.state.tel);
            try{
                firebase.auth().createUserWithEmailAndPassword(this.state.email,this.state.password).then(async function(result){
                    this.id = result.user.uid;
                    await AsyncStorage.setItem("id",this.id);
                    if(result.additionalUserInfo.isNewUser){
                        firebase
                        .database()
                        .ref('/users/' + result.user.uid)
                        .set({
                            mail: this.state.email,
                            first_name: this.state.username,
                            last_name: this.state.name,
                            tel: this.state.tel,
                            adresse: null,
                            cp: null,
                            ville: null,
                            pays: null
                        }).then(function(snapchot){
                            console.log('Snapshot',snapchot)
                        })
                    }

                    if (!result.user.emailVerified) {
                        result.user.sendEmailVerification();
                    }
                    this.props.navigation.replace("Catalogue");
                }.bind(this))
                
            }catch(e){
                console.log(e.toString())
            }
            
        }else{
            console.log("fail");
            console.log(resp.error.code);
            Toast.show("Err "+ resp.error.code + ": "  + resp.error.desc);
        }

    }
    

    checkContent(){
        let result = true;

        let paternName = new RegExp('^[a-zA-Z_-]{3,20}$')
        let paternMail = new RegExp('^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})$')
        let paternTel = new RegExp('^[0-9]{10}$')

        let tmpName = this.state.name;
        let tmpUsername = this.state.username;
        let tmpEmail = this.state.email;
        let tmpTel = this.state.tel;

        let tmpValidName = this.state.validName;
        let tmpValidUsername = this.state.validUsername;
        let tmpValidEmail = this.state.validEmail;
        let tmpValidTel = this.state.validTel;
        let tmpValidRgpd = this.state.validRgpd;

        if(!this.state.rgpd){
            result =  false
            tmpValidRgpd = false
        }else{
            tmpValidRgpd = true
        }
        if(tmpName === ("") | !paternName.test(tmpName)){
            result = false
            tmpValidName = false
        }else{
            tmpValidName = true
        }
        if(tmpUsername === ("") | !paternName.test(tmpUsername)){
            result = false
            tmpValidUsername = false
        }else{
            tmpValidUsername = true
        }
        if(tmpTel === ("") | !paternTel.test(tmpTel)){
            result = false
            tmpValidTel = false
        }else{
            tmpValidTel = true
        }
        if(tmpEmail === ("") | !paternMail.test(tmpEmail)){
            result = false
            tmpValidEmail = false
        }else{
            tmpValidEmail = true
        }
        if(!result){
            Toast.show("Veuillez remplir tous les champs obligatoires")
            this.setState({
                name: tmpName,
                username: tmpUsername,
                tel: tmpTel,
                email: tmpEmail,
                validName: tmpValidName,
                validUsername: tmpValidUsername,
                validEmail: tmpValidEmail,
                validTel: tmpValidTel,
                validRgpd: tmpValidRgpd
            })
        }
        return result
    }

    renderValidInput(bool){
        if(bool){
            return styles.textinput
        }else{
            return styles.textinputred
        }
    }

    renderRgpdcheck(){
        if(this.state.validRgpd){
            return styles.boxHint
        }else{
            return styles.boxHintred
        }
    }

    render(){
        
        return(
            <View style={styles.main_container}>
                <View >
                    <Text style={styles.attribut}>Nom</Text>
                    <TextInput
                        style={this.renderValidInput(this.state.validName)}
                        placeholder="Nom"
                        keyboardType="default"
                        onChangeText={(text) => this.setState({name:text})}
                        onSubmitEditing={(event) => {
                                this.secondInput.focus()
                            }}
                    />
                </View>
                <View >
                    <Text style={styles.attribut}>Prénom</Text>
                    <TextInput
                        ref={(input) => this.secondInput = input }
                        style={this.renderValidInput(this.state.validUsername)}
                        placeholder="Prénom"
                        keyboardType="default"
                        onChangeText={(text) => this.setState({username:text})}
                        onSubmitEditing={(text) => {
                            this.thirdInput.focus()
                        }}
                    />
                </View>
                <View >
                    <Text style={styles.attribut}>Email</Text>
                    <TextInput
                        ref={(input) => this.thirdInput = input }
                        style={this.renderValidInput(this.state.validEmail)}
                        placeholder="Email"
                        keyboardType="email-address"
                        onChangeText={(text) => this.setState({email:text})}
                        onSubmitEditing={(text) => {
                            this.lastInput.focus()
                        }}
                    />
                </View>
                <View >
                    <Text style={styles.attribut}>Téléphone</Text>
                    <TextInput
                        ref={(input) => this.lastInput = input }
                        style={this.renderValidInput(this.state.validTel)}
                        placeholder="Téléphone"
                        keyboardType="numeric"
                        onChangeText={(text) => this.setState({tel:text})}
                    />
                </View>

                <View >
                    <Text style={styles.attribut}>Mot de passe</Text>
                    <TextInput
                        style={this.renderValidInput(this.state.validTel)}
                        placeholder="Mot de passe"
                        autoCorrect={false}
                        secureTextEntry={true}
                        keyboardType="numeric"
                        onChangeText={(text) => this.setState({password:text})}
                    />
                </View>

                <View>
                    <View style={styles.row}>
                        <CheckBox 
                            value={this.state.allowNewletter}
                            onChange={() => this.setState({
                            allowNewletter:!this.state.allowNewletter})}
                        />
                        <Text style={styles.boxHint}>Inscription Newsletter</Text>
                    </View>
                    <View style={styles.row}>
                        <CheckBox 
                            value={this.state.allowSms}
                            onChange={() => this.setState({
                                allowSms:!this.state.allowSms})}
                        />
                        <Text style={styles.boxHint}>Inscription SMS</Text>
                    </View>
                    <View style={styles.row}>
                        <CheckBox 
                            value={this.state.rgpd}
                            onChange={() => this.setState({
                                rgpd:!this.state.rgpd})}
                        />
                        <Text style={this.renderRgpdcheck()}>Accept tems and conditions *</Text>
                    </View>
                </View>

                <View style={styles.button}>
                    <Button
                        
                        color={ENV.PRIMARY_COLOR}
                        title='Insciption'
                        onPress={() => {
                            console.log(this.state)
                            if(this.checkContent()){
                                console.log("Check Content")
                                this.buildRequest()
                            }
                        }
                        }
                    />
                </View>

            </View>
        )
    }
}


const styles = StyleSheet.create({
    title:{
        textAlign: 'center'
    },

    champs:{
        alignContent: 'center',
        textAlign: 'center',
        fontFamily: 'josefin',
    },    
    main_container: {
        flex: 1,
        marginHorizontal: 4
    },
    textinput: {
        marginLeft: 5,
        marginRight: 5,
        height: 50,
        borderColor: '#000000',
        borderWidth: 1,
        paddingLeft: 5,
        fontFamily: 'josefin',
    },
    textinputred: {
        marginLeft: 5,
        marginRight: 5,
        height: 50,
        borderColor: 'red',
        borderWidth: 1,
        paddingLeft: 5,
        fontFamily: 'josefin',
    },
    row:{
        flexDirection:'row'
    },
    boxHint:{
        marginTop:5,
        fontFamily: 'josefin',
    },
    boxHintred:{
        marginTop: 5,
        color: 'red',
        fontFamily: 'josefin',
    },
    attribut:{
        fontFamily: 'josefin'
    }
})

export default Inscription