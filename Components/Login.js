import React from 'react'
import { StyleSheet, View, TextInput, Button, Text, FlatList, ActivityIndicator, Platform ,AsyncStorage} from 'react-native'
import NetInfo from "@react-native-community/netinfo";
import ENV from '../environment'
import * as Font from 'expo-font'
import firebase from 'firebase'
import * as Google from 'expo-google-app-auth';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Dialog from "react-native-dialog";

class Login extends React.Component {
    connected = false;

    constructor(props) {
        super(props)
        this.state = {
            id : null,
            connected: undefined,
            email: "",
            password: "",
            error_message: null,
            loading: false,
            dialogResetPasswordlVisible: false,
            validEmail: true,
            error_reset_message: ""
        }
        
    }

    loginUser = () => {
        this.setState({error_message:null, loading:true})
        try {
            firebase.auth().signInWithEmailAndPassword(this.state.email,this.state.password)
            .then( async function (result){
                await AsyncStorage.setItem("id",result.user.uid)
                firebase
                .database()
                .ref('/users/' + result.user.uid)
                .once('value')
                .then(async function(snapchot){
                    console.log(snapchot.val())
                    await AsyncStorage.setItem("prenom",snapchot.val()['first_name']);
                    console.log("name set")
                    await AsyncStorage.setItem("nom",snapchot.val()['last_name']);
                    await AsyncStorage.setItem("email",snapchot.val()['mail']);
                    await AsyncStorage.setItem("tel",snapchot.val()['tel']);
                    
                    this.props.navigation.replace("Catalogue")
                    }.bind(this))
                }.bind(this))
            .catch(function(error) {
                console.log(error.code);
                switch (error.code){
                    case 'auth/wrong-password':
                        console.log("error avec password");
                        this.setState({error_message:"Mot de passe incorrect", loading:false})
                        break;
                    case 'auth/too-many-requests':
                        console.log("trop de request");
                        this.setState({error_message: "Vous avez essayé trop de fois. Veuillez réessayer plus tard.", loading:false})
                        break;
                    case 'auth/user-not-found':
                        console.log("user not found")
                        this.setState({error_message: "Email non reconnu", loading:false})
                        break;
                    default:
                        console.log("default");
                        this.setState({error_message: error.message, loading:false})
                }
            }.bind(this))
        } catch (error) {
            console.log(error)   
        }
    }

    sendPasswordReset = () =>{
        try {
            firebase.auth().sendPasswordResetEmail(this.state.email)
            .then(function(){
                this.setState({dialogResetPasswordlVisible: false})
            }.bind(this))
            .catch(function(error){
                this.setState({error_reset_message:error.message})
            }.bind(this))
        } catch (error) {
            console.log(error)   
        }
    }

    checkContent(){
        let result = true;

        let paternMail = new RegExp('^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})$')
        
        let tmpEmail = this.state.email;
        

        
        let tmpValidEmail = this.state.validEmail;
        

       
        if(tmpEmail === ("") | !paternMail.test(tmpEmail)){
            result = false
            tmpValidEmail = false
        }else{
            tmpValidEmail = true
        }
        if(!result){
            this.setState({
                email: tmpEmail,
                validEmail: tmpValidEmail
            })
        }
        return result
    }

    connectivityOnscreen(){
        let Inputstyle = styles.textinput

        let EditInputStyle = styles.textinput
        if(!this.state.validEmail){
            EditInputStyle = styles.textinputred
        }

        let error = (this.state.error_message===null)?null:<Text style={styles.errorMessage}>{this.state.error_message}</Text>
        let loading = (this.state.loading)?<ActivityIndicator size="large" color={ENV.PRIMARY_COLOR}/>:<Button title="Se connecter" onPress={() => this.loginUser()}
    />
            return(
                <View style={{flex:1}}>
                    <View style={styles.topContainer}>
                        
                        <View>
                            <Text style={{fontFamily: 'josefin', fontSize: 17}}>Email</Text>
                            <TextInput
                                style={styles.textinput}
                                placeholder="Email"
                                keyboardType="default"
                                onChangeText={(text) => this.setState({email:text})}
                            />
                        </View>
                        <View >
                            <Text style={{fontFamily: 'josefin', fontSize: 17}}>Mot de passe</Text>
                            <TextInput
                                style={styles.textinput}
                                placeholder="Mot de passe"
                                keyboardType="numeric"
                                autoCorrect={false}
                                secureTextEntry={true}
                                onChangeText={(text) => this.setState({password:text})}
                            />
                        </View>
                        <View>
                            <TouchableOpacity
                                onPress={() => this.setState({dialogResetPasswordlVisible: true})}>
                                <Text>Mot de passe oublié ?</Text>
                            </TouchableOpacity>
                        </View>
                        <View>
                            {error}
                        </View>

                        <View style={styles.button_loading}>
                            {loading}
                        </View>
                    
                    </View>
                    
                    <View>
                        <Button 
                            color={ENV.PRIMARY_COLOR}
                            title="INSCRIPTION"
                            onPress={() => this.props.navigation.navigate('Inscription')}
                            />
                        <Button 
                            title={"Log with google"}
                            onPress={() => this.signInWithGoogleAsync()}
                        /> 
                    </View>

                    <Dialog.Container visible={this.state.dialogResetPasswordlVisible}>
                        <Dialog.Title>Réinitialiser votre mot de passe</Dialog.Title>
                        <Dialog.Input 
                            value={this.state.email}
                            label="Email" 
                            style={EditInputStyle}
                            placeholder="Email"
                            keyboardType="email-address"
                            onChangeText={(text) => this.setState({email: text})}
                        />
                        <Dialog.Description style={{color:'red'}}>{this.state.error_reset_message}</Dialog.Description>
                        <Dialog.Button label="Annuler" onPress={() => this.setState({dialogResetPasswordlVisible: false})}/>
                        <Dialog.Button label="Réinitialiser" onPress={() => { this.sendPasswordReset() }}/>
                        
                    </Dialog.Container>
                </View>
            )
    }


    signInWithGoogleAsync = async () =>{
        try {
        const result = await Google.logInAsync({
            androidClientId: "208255507948-fci8kjckdivnjc4f2rpqro8pjnhdjogj.apps.googleusercontent.com",
            //iosClientId: YOUR_CLIENT_ID_HERE,
            scopes: ['profile', 'email'],
        });
    
        if (result.type === 'success') {
            this.onSignIn(result);
            return result.accessToken;
        } else {
            return { cancelled: true };
        }
        } catch (e) {
        return { error: true };
        }
    }

    onSignIn = googleUser => {
        console.log('Google Auth Response', googleUser);
        // We need to register an Observer on Firebase Auth to make sure auth is initialized.
        var unsubscribe = firebase.auth().onAuthStateChanged(function(firebaseUser) {
          unsubscribe();
          // Check if we are already signed-in Firebase with the correct user.
          if (!this.isUserEqual(googleUser, firebaseUser)) {
            // Build Firebase credential with the Google ID token.
            var credential = firebase.auth.GoogleAuthProvider.credential(
                googleUser.idToken,
                googleUser.accessToken
                );
            // Sign in with credential from the Google user.
            firebase.auth().signInWithCredential(credential)
            .then(function(result){
                console.log("user signed in", result.additionalUserInfo);
                AsyncStorage.setItem("id",result.user.uid);
                if(result.additionalUserInfo.isNewUser){
                    firebase
                    .database()
                    .ref('/users/' + result.user.uid)
                    .set({
                        mail: result.user.email,
                        profile_picture: result.additionalUserInfo.profile.picture,
                        first_name: result.additionalUserInfo.profile.given_name,
                        last_name: result.additionalUserInfo.profile.family_name,
                        adresse: null,
                        cp: null,
                        ville: null,
                        pays: null
                    }).then(async function(snapchot){
                        console.log('Snapshot',snapchot)
                    })
                    firebase
                        .database()
                        .ref('/users/' + result.user.uid)
                        .once('value')
                        .then(async function(snapchot){
                            console.log(snapchot.val())
                            await AsyncStorage.setItem("prenom",snapchot.val()['first_name']);
                            console.log("name set")
                            await AsyncStorage.setItem("nom",snapchot.val()['last_name']);
                            await AsyncStorage.setItem("email",snapchot.val()['mail']);
                            
                            
                            this.props.navigation.replace("Catalogue")
                        }.bind(this))
                    
                }else{
                    firebase
                        .database()
                        .ref('/users/' + result.user.uid)
                        .once('value')
                        .then(async function(snapchot){
                            console.log(snapchot.val())
                            await AsyncStorage.setItem("prenom",snapchot.val()['first_name']);
                            console.log("name set")
                            await AsyncStorage.setItem("nom",snapchot.val()['last_name']);
                            await AsyncStorage.setItem("email",snapchot.val()['mail']);
                            
                            
                            this.props.navigation.replace("Catalogue")
                        }.bind(this))
                   
                }
                
            }.bind(this))
            
            
            .catch(function(error) {
              // Handle Errors here.
              var errorCode = error.code;
              var errorMessage = error.message;
              // The email of the user's account used.
              var email = error.email;
              // The firebase.auth.AuthCredential type that was used.
              var credential = error.credential;
              // ...
            });
          } else {
            console.log('User already signed-in Firebase.');
          }
        }.bind(this));
      }

    isUserEqual = (googleUser, firebaseUser) => {
    if (firebaseUser) {
        var providerData = firebaseUser.providerData;
        for (var i = 0; i < providerData.length; i++) {
        if (providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
            providerData[i].uid === googleUser.getBasicProfile().getId()) {
            // We don't need to reauth the Firebase connection.
            return true;
        }
        }
    }
        return false;
    }

    render() {
        return (
                <View style={styles.main_container}>
                    {this.connectivityOnscreen()}
                </View>
            )
    }}

    const styles = StyleSheet.create({
    main_container: {
        flex: 1,
    },
    loading_container: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 100,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
      },
      topContainer:{
          flex: 1,
          marginHorizontal: 4
      },
      textinput: {
        marginLeft: 5,
        marginRight: 5,
        height: 50,
        borderColor: '#000000',
        paddingLeft: 5,
        fontFamily: 'josefin',
    },
    errorMessage:{
        color:'red',
        width:"100%",
        textAlign: "center",
        fontSize: 15,
        fontFamily: 'josefin',
    },
    button_loading:{
        marginTop: 10
    }

    })

export default Login